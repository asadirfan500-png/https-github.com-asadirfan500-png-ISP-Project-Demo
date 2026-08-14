import type {
  FullEvaluationResult,
  MediaKind,
  Platform,
  StepEvaluationResult,
} from "@/lib/types";
import {
  compressImageForReview,
  isHeicLike,
} from "@/lib/media/compress-image";
import {
  extractVideoFrames,
  isVideoFile,
} from "@/lib/media/extract-video-frames";

export type VisualFrame = {
  base64: string;
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
};

/**
 * Runs evaluation via /api/evaluate (Claude when key is set).
 * Videos are sampled into still frames before upload — Claude does not take video natively.
 * Still images are resized/compressed so Mac/phone photos fit under Vercel body limits.
 */
export async function runRemoteEvaluation(
  input: {
    platform: Platform;
    caption: string;
    mediaFile: File | null;
    mediaKind: MediaKind | null;
  },
  onStepComplete?: (result: StepEvaluationResult) => void,
): Promise<{ result: FullEvaluationResult; source: "claude" | "rules" }> {
  let frames: VisualFrame[] = [];
  let visualKind: MediaKind | "none" = "none";

  if (input.mediaFile) {
    if (input.mediaKind === "video" || isVideoFile(input.mediaFile)) {
      visualKind = "video";
      const extracted = await extractVideoFrames(input.mediaFile, {
        count: 5,
        maxWidth: 960,
        quality: 0.72,
      });
      frames = extracted.map((f) => ({
        base64: f.base64,
        mediaType: f.mediaType,
      }));
    } else {
      visualKind = "image";
      if (isHeicLike(input.mediaFile)) {
        // Try canvas decode (works on Safari often); clear error if not.
        try {
          frames = [await compressImageForReview(input.mediaFile)];
        } catch {
          throw new Error(
            "HEIC photos are not supported here. On Mac: export as JPEG (File → Export) or take a screenshot, then retry.",
          );
        }
      } else {
        frames = [await compressImageForReview(input.mediaFile)];
      }
    }
  }

  const response = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      platform: input.platform,
      caption: input.caption,
      visualKind,
      frames,
      // Back-compat for older handlers
      imageBase64: frames[0]?.base64,
      imageMediaType: frames[0]?.mediaType,
    }),
  });

  const raw = await response.text();
  let data: {
    error?: string;
    source?: "claude" | "rules";
    result?: FullEvaluationResult;
  };
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    if (
      response.status === 413 ||
      /^request entity too large/i.test(raw.trim())
    ) {
      throw new Error(
        "That image is too large for the server. Try a smaller JPG/PNG (under ~2MB).",
      );
    }
    throw new Error(
      raw.trim().slice(0, 160) ||
        `Evaluation failed (HTTP ${response.status}).`,
    );
  }

  if (!response.ok || !data.result) {
    throw new Error(data.error || "Evaluation request failed");
  }

  const { result } = data;
  const source = data.source ?? "rules";

  onStepComplete?.({ step: "best_practice", data: result.bestPractice });
  await delay(400);
  onStepComplete?.({ step: "brand_tone", data: result.brandTone });
  await delay(400);
  onStepComplete?.({ step: "audience", data: result.audience });
  await delay(400);
  onStepComplete?.({ step: "caption", data: result.caption });

  return { result, source };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
