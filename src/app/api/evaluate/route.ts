import { NextResponse } from "next/server";
import { evaluateWithClaude } from "@/lib/evaluation/claude-evaluator";
import { runFullEvaluation } from "@/lib/evaluation/simulator";
import type { Platform } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const PLATFORMS: Platform[] = [
  "instagram",
  "tiktok",
  "linkedin",
  "facebook",
  "x",
];

type Body = {
  platform?: string;
  caption?: string;
  imageBase64?: string;
  imageMediaType?: string;
  useClaude?: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const platform = body.platform as Platform | undefined;
    const caption = body.caption?.trim() ?? "";

    if (!platform || !PLATFORMS.includes(platform)) {
      return NextResponse.json(
        { error: "Valid platform is required." },
        { status: 400 },
      );
    }
    if (!caption) {
      return NextResponse.json(
        { error: "Caption is required." },
        { status: 400 },
      );
    }

    const hasKey = Boolean(process.env.ANTHROPIC_API_KEY?.trim());
    const wantClaude = body.useClaude !== false;

    if (hasKey && wantClaude) {
      const mediaType =
        body.imageMediaType === "image/jpeg" ||
        body.imageMediaType === "image/png" ||
        body.imageMediaType === "image/gif" ||
        body.imageMediaType === "image/webp"
          ? body.imageMediaType
          : undefined;

      const result = await evaluateWithClaude({
        platform,
        caption,
        imageBase64: body.imageBase64,
        imageMediaType: mediaType,
      });

      return NextResponse.json({
        source: "claude",
        result,
      });
    }

    const result = await runFullEvaluation({
      platform,
      caption,
      hasImage: Boolean(body.imageBase64),
    });

    return NextResponse.json({
      source: "rules",
      result,
    });
  } catch (error) {
    console.error("[api/evaluate]", error);
    const message =
      error instanceof Error ? error.message : "Evaluation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
