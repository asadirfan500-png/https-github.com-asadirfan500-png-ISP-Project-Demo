import { NextResponse } from "next/server";
import { evaluateWithClaude } from "@/lib/evaluation/claude-evaluator";
import { runFullEvaluation } from "@/lib/evaluation/simulator";
import type { MediaKind, Platform } from "@/lib/types";

export const runtime = "nodejs";
/** Three parallel Claude calls — allow headroom for demo (esp. reel frames). */
export const maxDuration = 120;

const PLATFORMS: Platform[] = [
  "instagram",
  "tiktok",
  "linkedin",
  "facebook",
  "x",
];

type FrameBody = {
  base64?: string;
  mediaType?: string;
};

type Body = {
  platform?: string;
  caption?: string;
  visualKind?: string;
  frames?: FrameBody[];
  imageBase64?: string;
  imageMediaType?: string;
  useClaude?: boolean;
};

function parseFrames(body: Body): {
  frames: {
    base64: string;
    mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  }[];
  visualKind: MediaKind | "none";
} {
  const allowed = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ]);

  const fromArray = (body.frames ?? [])
    .filter((f) => f.base64 && f.mediaType && allowed.has(f.mediaType))
    .map((f) => ({
      base64: f.base64!,
      mediaType: f.mediaType as
        | "image/jpeg"
        | "image/png"
        | "image/gif"
        | "image/webp",
    }));

  if (fromArray.length > 0) {
    const visualKind: MediaKind | "none" =
      body.visualKind === "video" ? "video" : "image";
    return { frames: fromArray, visualKind };
  }

  if (
    body.imageBase64 &&
    body.imageMediaType &&
    allowed.has(body.imageMediaType)
  ) {
    return {
      frames: [
        {
          base64: body.imageBase64,
          mediaType: body.imageMediaType as
            | "image/jpeg"
            | "image/png"
            | "image/gif"
            | "image/webp",
        },
      ],
      visualKind: body.visualKind === "video" ? "video" : "image",
    };
  }

  return { frames: [], visualKind: "none" };
}

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

    const { frames, visualKind } = parseFrames(body);
    const hasKey = Boolean(process.env.ANTHROPIC_API_KEY?.trim());
    const wantClaude = body.useClaude !== false;

    if (hasKey && wantClaude) {
      const result = await evaluateWithClaude({
        platform,
        caption,
        visualKind,
        frames,
      });

      return NextResponse.json({
        source: "claude",
        result,
      });
    }

    const result = await runFullEvaluation({
      platform,
      caption,
      hasImage: frames.length > 0,
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
