import Anthropic from "@anthropic-ai/sdk";
import {
  AUDIENCE_PERSONAS,
  BRAND_VOICE,
  CITROEN_CLIENT,
} from "@/lib/data/citroen";
import { getPlatformConfig } from "@/lib/data/platforms";
import type {
  AudienceResult,
  CheckResult,
  CheckStatus,
  FullEvaluationResult,
  Platform,
  Receptiveness,
} from "@/lib/types";

export interface ClaudeEvaluationInput {
  platform: Platform;
  caption: string;
  imageBase64?: string;
  imageMediaType?: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
}

function statusFromScore(score: number): CheckStatus {
  if (score >= 75) return "pass";
  if (score >= 50) return "warn";
  return "fail";
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function buildSystemPrompt(platform: Platform): string {
  const config = getPlatformConfig(platform);
  return `You are the Synthetic Team Member (STM) for 33Seconds, reviewing social creative for client ${CITROEN_CLIENT.name} before it goes to the client.

Audience: ${CITROEN_CLIENT.audience} — ${CITROEN_CLIENT.tagline}
Brand voice traits: ${BRAND_VOICE.traits.join(", ")}
Prefer language like: ${BRAND_VOICE.preferPhrases.slice(0, 20).join(", ")}
Avoid: ${BRAND_VOICE.avoidPhrases.slice(0, 20).join(", ")}
Training insight: ${BRAND_VOICE.trainingInsights.summary}

Platform: ${config.label}
- Max caption length: ${config.maxCaptionLength}
- Ideal length: ~${config.idealCaptionLength}
- Image required: ${config.requiresImage ? "yes" : "no"}
- Hashtags recommended: ${config.hashtagRecommended ? "yes" : "no"}
Tips: ${config.tips.join("; ")}

Audience personas to speak as in quotes:
${AUDIENCE_PERSONAS.map((p) => `- ${p.name}: ${p.description}`).join("\n")}

You MUST respond with ONLY valid JSON (no markdown fences) matching this schema:
{
  "bestPractice": {
    "score": 0-100,
    "findings": [{"type":"strength"|"issue"|"info","message":"..."}],
    "suggestions": ["..."]
  },
  "brandTone": {
    "score": 0-100,
    "findings": [{"type":"strength"|"issue"|"info","message":"..."}],
    "suggestions": ["..."]
  },
  "audience": {
    "score": 0-100,
    "receptiveness": "high"|"medium"|"low",
    "findings": [{"type":"strength"|"issue"|"info","message":"..."}],
    "suggestions": ["..."],
    "personaQuotes": [
      {"persona":"Maya — Urban Creative","quote":"...","sentiment":"positive"|"neutral"|"negative"}
    ]
  },
  "topActions": ["up to 3 concrete fixes"]
}

Rules:
- If an image is provided, actually analyse what is visible (product, people, setting, text overlays, brand fit with caption).
- If no image and platform needs one, flag that in bestPractice.
- Be specific and useful for a social team. Prefer lifestyle/human UGC over motorsport jargon for this client.
- Include 2-4 findings per check and 1-3 suggestions per check.
- Include exactly 3 personaQuotes (one per persona).`;
}

function normalizeCheck(
  raw: Partial<CheckResult> | undefined,
  fallbackScore = 60,
): CheckResult {
  const score = clampScore(raw?.score ?? fallbackScore);
  return {
    score,
    status: statusFromScore(score),
    findings: Array.isArray(raw?.findings) ? raw!.findings! : [],
    suggestions: Array.isArray(raw?.suggestions) ? raw!.suggestions! : [],
  };
}

function normalizeAudience(
  raw: Partial<AudienceResult> | undefined,
): AudienceResult {
  const base = normalizeCheck(raw, 60);
  const receptiveness: Receptiveness =
    raw?.receptiveness === "high" ||
    raw?.receptiveness === "medium" ||
    raw?.receptiveness === "low"
      ? raw.receptiveness
      : base.score >= 75
        ? "high"
        : base.score >= 50
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
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Claude did not return valid JSON");
  }
}

export async function evaluateWithClaude(
  input: ClaudeEvaluationInput,
): Promise<FullEvaluationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const model =
    process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-6";

  const client = new Anthropic({ apiKey });

  const userContent: Anthropic.MessageCreateParams["messages"][0]["content"] =
    [];

  if (input.imageBase64 && input.imageMediaType) {
    userContent.push({
      type: "image",
      source: {
        type: "base64",
        media_type: input.imageMediaType,
        data: input.imageBase64,
      },
    });
  }

  userContent.push({
    type: "text",
    text: `Review this ${input.platform} post for ${CITROEN_CLIENT.name}.

Caption:
"""
${input.caption}
"""

Image attached: ${input.imageBase64 ? "yes — analyse it" : "no"}

Return JSON only.`,
  });

  const response = await client.messages.create({
    model,
    max_tokens: 2048,
    system: buildSystemPrompt(input.platform),
    messages: [{ role: "user", content: userContent }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Empty response from Claude");
  }

  const parsed = extractJson(textBlock.text) as {
    bestPractice?: Partial<CheckResult>;
    brandTone?: Partial<CheckResult>;
    audience?: Partial<AudienceResult>;
    topActions?: string[];
  };

  const bestPractice = normalizeCheck(parsed.bestPractice, 65);
  const brandTone = normalizeCheck(parsed.brandTone, 65);
  const audience = normalizeAudience(parsed.audience);

  const aggregateScore = clampScore(
    (bestPractice.score + brandTone.score + audience.score) / 3,
  );
  const statuses = [
    bestPractice.status,
    brandTone.status,
    audience.status,
  ];
  const overallStatus: CheckStatus = statuses.includes("fail")
    ? "fail"
    : statuses.includes("warn")
      ? "warn"
      : "pass";

  const topActions =
    Array.isArray(parsed.topActions) && parsed.topActions.length > 0
      ? parsed.topActions.slice(0, 3)
      : [
          ...bestPractice.suggestions,
          ...brandTone.suggestions,
          ...audience.suggestions,
        ].slice(0, 3);

  return {
    bestPractice,
    brandTone,
    audience,
    aggregateScore,
    overallStatus,
    topActions,
  };
}

export function hasAnthropicKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}
