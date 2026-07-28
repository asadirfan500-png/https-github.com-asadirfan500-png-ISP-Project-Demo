import type {
  FullEvaluationResult,
  MediaKind,
  Platform,
  StepEvaluationResult,
} from "@/lib/types";
import {
  extractVideoFrames,
  isVideoFile,
} from "@/lib/media/extract-video-frames";

export type VisualFrame = {
  base64: string;
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
};

export async function fileToBase64(file: File): Promise<VisualFrame> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  const base64 = btoa(binary);

  const type = file.type;
  const mediaType =
    type === "image/png" ||
    type === "image/gif" ||
    type === "image/webp" ||
    type === "image/jpeg"
      ? type
      : "image/jpeg";

  return { base64, mediaType };
}

/**
 * Runs evaluation via /api/evaluate (Claude when key is set).
 * Videos are sampled into still frames before upload — Claude does not take video natively.
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
      frames = [await fileToBase64(input.mediaFile)];
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

  const data = (await response.json()) as {
    error?: string;
    source?: "claude" | "rules";
    result?: FullEvaluationResult;
  };

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
