"use client";

import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  greetingFirstName,
  loadUserName,
} from "@/lib/user-store";
import { cn } from "@/lib/utils";
import { Loader2, MessageSquareText, RotateCcw, Send } from "lucide-react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  /** UI-only greeting — not sent to the API */
  seed?: boolean;
};

function makeId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildGreeting(): ChatMessage {
  const name = greetingFirstName(loadUserName(), "there");
  return {
    id: makeId(),
    role: "assistant",
    content: `How may I help you, ${name}?`,
    seed: true,
  };
}

export function ConceptChat() {
  // TODO: persist concept chats later
  const [messages, setMessages] = useState<ChatMessage[]>([buildGreeting()]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  function resetChat() {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    setInput("");
    setMessages([buildGreeting()]);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: ChatMessage = {
      id: makeId(),
      role: "user",
      content: text,
    };
    const assistantId = makeId();
    const nextMessages = [
      ...messages,
      userMsg,
      { id: assistantId, role: "assistant" as const, content: "" },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsStreaming(true);

    const payload = nextMessages
      .filter((m) => !m.seed && m.content.trim())
      .filter((m) => m.id !== assistantId)
      .map((m) => ({ role: m.role, content: m.content }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/concept-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(errBody?.error || `Request failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("No response stream.");
      }

      const decoder = new TextDecoder();
      let assembled = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assembled += decoder.decode(value, { stream: true });
        const snapshot = assembled;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: snapshot } : m,
          ),
        );
      }
      assembled += decoder.decode();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: assembled.trim() || m.content }
            : m,
        ),
      );
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const message =
        err instanceof Error ? err.message : "Concept chat failed";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  m.content.trim() ||
                  `I couldn't complete that check. ${message}`,
              }
            : m,
        ),
      );
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  return (
    <>
      <PageHeader
        title="Concept Check"
        description="Pressure-test a written idea or rough caption before you spend on production. Early gate only — a human keeps the final call, and this can't judge a finished visual."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={resetChat}
            disabled={isStreaming}
          >
            <RotateCcw className="size-4" />
            New concept
          </Button>
        }
      />

      <div className="flex min-h-[min(70vh,640px)] flex-col overflow-hidden rounded-lg border border-border bg-card/80 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <MessageSquareText className="size-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Grounded in Citroën brand tone, Everyday Outsiders, platform tips,
            and caption craft examples.
          </p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[min(100%,36rem)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-muted/30 text-foreground",
                )}
              >
                {m.content ||
                  (isStreaming ? (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Loader2 className="size-3.5 animate-spin" />
                      Thinking…
                    </span>
                  ) : (
                    ""
                  ))}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form
          className="border-t border-border p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage();
          }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a concept, angle, or rough caption…"
              className="min-h-[72px] flex-1 resize-none bg-background/50"
              disabled={isStreaming}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
            />
            <Button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="sm:mb-0.5"
            >
              {isStreaming ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Send
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
