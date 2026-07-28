/**
 * Claude evaluation — four parallel checks.
 * Caption is scored separately; the other three ignore caption craft.
 * Unrelated-to-Citroën creatives are forced to score 0.
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  audiencePrompt,
  bestPracticePrompt,
  brandTonePrompt,
  captionPrompt,
} from "@/lib/ai/prompts";
import { isClearlyUnrelatedToClient } from "@/lib/evaluation/client-relevance";
import type {
  AudienceResult,
  CheckResult,
  CheckStatus,
  FullEvaluationResult,
  MediaKind,
  Platform,
  Receptiveness,
} from "@/lib/types";

export type VisionFrame = {
  base64: string;
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
};

export interface ClaudeEvaluationInput {
  platform: Platform;
  caption: string;
  visualKind?: MediaKind | "none";
  frames?: VisionFrame[];
  imageBase64?: string;
  imageMediaType?: VisionFrame["mediaType"];
}

function statusFromScore(score: number): CheckStatus {
  if (score >= 75) return "pass";
  if (score >= 55) return "warn";
  return "fail";
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function zeroCheck(message: string): CheckResult {
  return {
    score: 0,
    status: "fail",
    findings: [{ type: "issue", message }],
    suggestions: [
      "Submit creative that is clearly for Citroën (brand, model, or client brief).",
    ],
  };
}

function zeroAudience(message: string): AudienceResult {
  return {
    ...zeroCheck(message),
    receptiveness: "low",
    personaQuotes: [
      {
        persona: "Jay, 24, Birmingham",
        quote: "This isn't even for Citroën. Why am I looking at it?",
        sentiment: "negative",
      },
    ],
  };
}

function unrelatedFullResult(message: string): FullEvaluationResult {
  const check = zeroCheck(message);
  return {
    bestPractice: check,
    brandTone: check,
    audience: zeroAudience(message),
    caption: check,
    aggregateScore: 0,
    overallStatus: "fail",
    topActions: [
      "This creative is not related to the Citroën client — score is 0.",
      "Resubmit with Citroën product, brand, or brief-aligned content.",
    ],
  };
}

function normalizeCheck(
  raw: (Partial<CheckResult> & { reasoning?: string; clientRelevant?: boolean }) | undefined,
  fallbackScore = 60,
  options?: { zeroOnIrrelevant?: boolean },
): CheckResult & { clientRelevant?: boolean } {
  const zeroOnIrrelevant = options?.zeroOnIrrelevant !== false;

  if (zeroOnIrrelevant && raw?.clientRelevant === false) {
    return {
      ...zeroCheck(
        raw.findings?.[0]?.message ||
          "Not related to the Citroën client — score set to 0.",
      ),
      clientRelevant: false,
    };
  }

  const score = clampScore(raw?.score ?? fallbackScore);
  return {
    score,
    status: statusFromScore(score),
    findings: Array.isArray(raw?.findings) ? raw!.findings! : [],
    suggestions: Array.isArray(raw?.suggestions) ? raw!.suggestions! : [],
    clientRelevant: raw?.clientRelevant,
  };
}

function normalizeAudience(
  raw:
    | (Partial<AudienceResult> & { reasoning?: string; clientRelevant?: boolean })
    | undefined,
): AudienceResult & { clientRelevant?: boolean } {
  if (raw?.clientRelevant === false) {
    return {
      ...zeroAudience(
        raw.findings?.[0]?.message ||
          "Not related to the Citroën client — score set to 0.",
      ),
      clientRelevant: false,
    };
  }

  const base = normalizeCheck(raw, 60);
  const receptiveness: Receptiveness =
    raw?.receptiveness === "high" ||
    raw?.receptiveness === "medium" ||
    raw?.receptiveness === "low"
      ? raw.receptiveness
      : base.score >= 75
        ? "high"
        : base.score >= 55
          ? "medium"
          : "low";

  return {
    ...base,
    receptiveness,
    personaQuotes: Array.isArray(raw?.personaQuotes)
      ? raw!.personaQuotes!
      : [],
  };
}

function extractJson(text: string): unknown {
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error(
      `Could not parse response as JSON: ${cleaned.slice(0, 200)}`,
    );
  }
}

function resolveFrames(input: ClaudeEvaluationInput): VisionFrame[] {
  if (input.frames && input.frames.length > 0) {
    return input.frames.slice(0, 8);
  }
  if (input.imageBase64 && input.imageMediaType) {
    return [
      { base64: input.imageBase64, mediaType: input.imageMediaType },
    ];
  }
  return [];
}

async function runCheck(
  client: Anthropic,
  model: string,
  prompt: string,
  frames: VisionFrame[],
): Promise<unknown> {
  const content: Anthropic.ContentBlockParam[] = [];

  for (const frame of frames) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: frame.mediaType,
        data: frame.base64,
      },
    });
  }

  content.push({ type: "text", text: prompt });

  const response = await client.messages.create({
    model,
    max_tokens: 2000,
    messages: [{ role: "user", content }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return extractJson(text);
}

export async function evaluateWithClaude(
  input: ClaudeEvaluationInput,
): Promise<FullEvaluationResult> {
  const frames = resolveFrames(input);
  const hasVisual = frames.length > 0;

  // Caption-only hard gate. With a photo/reel, Claude must look at the image.
  if (isClearlyUnrelatedToClient(input.caption, { hasVisual })) {
    return unrelatedFullResult(
      "Nothing here relates to the Citroën client — overall score is 0.",
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const model = process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-6";
  const client = new Anthropic({ apiKey });
  const visualKind: MediaKind | "none" =
    input.visualKind === "video" || input.visualKind === "image"
      ? input.visualKind
      : hasVisual
        ? "image"
        : "none";

  const [bestRaw, brandRaw, audienceRaw, captionRaw] = await Promise.all([
    runCheck(
      client,
      model,
      bestPracticePrompt(
        input.platform,
        input.caption,
        hasVisual,
        visualKind,
      ),
      frames,
    ),
    runCheck(
      client,
      model,
      brandTonePrompt(input.platform, input.caption, hasVisual, visualKind),
      frames,
    ),
    runCheck(
      client,
      model,
      audiencePrompt(input.platform, input.caption, hasVisual, visualKind),
      frames,
    ),
    runCheck(
      client,
      model,
      captionPrompt(input.platform, input.caption, hasVisual, visualKind),
      // Caption craft is text-only; client relevance with a visual is decided below
      [],
    ),
  ]);

  let bestPractice = normalizeCheck(bestRaw as Partial<CheckResult>, 65);
  let brandTone = normalizeCheck(brandRaw as Partial<CheckResult>, 65);
  let audience = normalizeAudience(audienceRaw as Partial<AudienceResult>);
  // Caption: keep Claude's craft score (including 0 for bad copy). Don't auto-zero
  // solely from clientRelevant when a visual exists — handled below.
  let caption = normalizeCheck(captionRaw as Partial<CheckResult>, 65, {
    zeroOnIrrelevant: !hasVisual,
  });

  // Vision checks decide "is this even a Citroën piece?" for the whole board.
  // Caption score stays independent: a weak/off caption can be 0 without zeroing the photo.
  const visionSaysUnrelated =
    hasVisual &&
    bestPractice.clientRelevant === false &&
    brandTone.clientRelevant === false;

  const captionOnlyUnrelated =
    !hasVisual && caption.clientRelevant === false;

  if (visionSaysUnrelated || captionOnlyUnrelated) {
    return unrelatedFullResult(
      "Not related to the Citroën client — all scores set to 0.",
    );
  }

  // Bad / off caption with a valid Citroën visual → caption indicator 0 only.
  const captionRawScore =
    typeof (captionRaw as { score?: number })?.score === "number"
      ? clampScore((captionRaw as { score: number }).score)
      : caption.score;

  if (hasVisual && caption.clientRelevant === false) {
    caption = {
      score: 0,
      status: "fail",
      findings: [
        ...(Array.isArray((captionRaw as { findings?: CheckResult["findings"] })?.findings)
          ? (captionRaw as { findings: CheckResult["findings"] }).findings
          : caption.findings),
        {
          type: "info",
          message:
            "Caption score is 0. Visual checks scored the image separately.",
        },
      ],
      suggestions:
        caption.suggestions.length > 0
          ? caption.suggestions
          : [
              "Rewrite the caption so it supports the Citroën visual with clear, on-voice copy.",
            ],
      clientRelevant: false,
    };
  } else if (hasVisual && captionRawScore === 0) {
    // Claude already scored caption craft at 0 — keep it
    caption = {
      ...caption,
      score: 0,
      status: "fail",
    };
  }

  const aggregateScore = clampScore(
    (bestPractice.score +
      brandTone.score +
      audience.score +
      caption.score) /
      4,
  );
  const overallStatus = statusFromScore(aggregateScore);

  const topActions = [
    ...caption.suggestions,
    ...bestPractice.suggestions,
    ...brandTone.suggestions,
    ...audience.suggestions,
  ].slice(0, 3);

  return {
    bestPractice,
    brandTone,
    audience,
    caption,
    aggregateScore,
    overallStatus,
    topActions,
  };
}

export function hasAnthropicKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}
