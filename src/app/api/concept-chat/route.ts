import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildConceptChatSystemPrompt } from "@/lib/ai/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatMessage = {
  role?: string;
  content?: string;
};

type Body = {
  messages?: ChatMessage[];
};

function sanitizeMessages(
  messages: ChatMessage[],
): { role: "user" | "assistant"; content: string }[] {
  const cleaned: { role: "user" | "assistant"; content: string }[] = [];
  for (const m of messages) {
    const role = m.role === "assistant" || m.role === "user" ? m.role : null;
    const content = typeof m.content === "string" ? m.content.trim() : "";
    if (!role || !content) continue;
    // Drop UI-only greeting seeds that look like the opening assistant line
    if (
      role === "assistant" &&
      /^how may i help you[, ]/i.test(content) &&
      cleaned.length === 0
    ) {
      continue;
    }
    cleaned.push({ role, content });
  }
  // Anthropic requires alternating roles starting with user
  while (cleaned.length > 0 && cleaned[0]!.role !== "user") {
    cleaned.shift();
  }
  return cleaned;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const messages = sanitizeMessages(body.messages ?? []);

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Send at least one user message." },
        { status: 400 },
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Claude is not configured. Set ANTHROPIC_API_KEY on the server and redeploy.",
        },
        { status: 503 },
      );
    }

    const model =
      process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-6";
    const client = new Anthropic({ apiKey });
    const system = buildConceptChatSystemPrompt();

    const stream = await client.messages.stream({
      model,
      max_tokens: 1600,
      system,
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Concept chat failed";
          controller.enqueue(encoder.encode(`\n\n[Error: ${message}]`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[api/concept-chat]", error);
    const message =
      error instanceof Error ? error.message : "Concept chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
