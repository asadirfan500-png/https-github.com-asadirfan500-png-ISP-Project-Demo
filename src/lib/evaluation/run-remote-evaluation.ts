import type {
  FullEvaluationResult,
  Platform,
  StepEvaluationResult,
} from "@/lib/types";

export async function fileToBase64(file: File): Promise<{
  base64: string;
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
}> {
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
 * Invokes onStepComplete in sequence so the existing stepper UI still animates.
 */
export async function runRemoteEvaluation(
  input: {
    platform: Platform;
    caption: string;
    imageFile: File | null;
  },
  onStepComplete?: (result: StepEvaluationResult) => void,
): Promise<{ result: FullEvaluationResult; source: "claude" | "rules" }> {
  let imageBase64: string | undefined;
  let imageMediaType:
    | "image/jpeg"
    | "image/png"
    | "image/gif"
    | "image/webp"
    | undefined;

  if (input.imageFile) {
    const encoded = await fileToBase64(input.imageFile);
    imageBase64 = encoded.base64;
    imageMediaType = encoded.mediaType;
  }

  const response = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      platform: input.platform,
      caption: input.caption,
      imageBase64,
      imageMediaType,
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

  // Pace step callbacks so the pipeline UI still feels sequential
  onStepComplete?.({ step: "best_practice", data: result.bestPractice });
  await delay(450);
  onStepComplete?.({ step: "brand_tone", data: result.brandTone });
  await delay(450);
  onStepComplete?.({ step: "audience", data: result.audience });

  return { result, source };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
