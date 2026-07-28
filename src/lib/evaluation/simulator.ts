import { AUDIENCE_PERSONAS, BRAND_VOICE } from "@/lib/data/citroen";
import { getPlatformConfig } from "@/lib/data/platforms";
import { isClearlyUnrelatedToClient } from "@/lib/evaluation/client-relevance";
import type {
  AudienceResult,
  CheckResult,
  CheckStatus,
  EvaluationInput,
  EvaluationStep,
  Finding,
  FullEvaluationResult,
  PersonaQuote,
  Receptiveness,
  StepEvaluationResult,
} from "@/lib/types";

const STEP_DELAYS: Record<EvaluationStep, number> = {
  best_practice: 1400,
  brand_tone: 1600,
  audience: 1800,
  caption: 1500,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function statusFromScore(score: number): CheckStatus {
  if (score >= 75) return "pass";
  if (score >= 55) return "warn";
  return "fail";
}

function countEmojis(text: string): number {
  const matches = text.match(/\p{Extended_Pictographic}/gu);
  return matches?.length ?? 0;
}

function hasHashtag(text: string): boolean {
  return /#\w+/.test(text);
}

function hasQuestionHook(text: string): boolean {
  const firstLine = text.split("\n")[0]?.trim() ?? "";
  return firstLine.includes("?") || /^(what|where|how|why|when|who|weekends?|imagine|ready)/i.test(firstLine);
}

function hasCta(text: string): boolean {
  return /\b(discover|explore|find out|learn more|shop|book|visit|click|link in bio|where are you|heading)\b/i.test(text);
}

export async function evaluateBestPractice(
  input: EvaluationInput
): Promise<CheckResult> {
  await delay(STEP_DELAYS.best_practice);

  // Caption craft is scored separately — this check is visual / packaging only.
  const config = getPlatformConfig(input.platform);
  const findings: Finding[] = [];
  const suggestions: string[] = [];
  let score = 78;

  if (config.requiresImage && !input.hasImage) {
    score -= 28;
    findings.push({
      type: "issue",
      message: "Carousel, still, or reel strongly recommended for Instagram.",
    });
    suggestions.push("Add a hero visual that matches the brief.");
  } else if (input.hasImage && (input.platform === "instagram" || input.platform === "tiktok")) {
    score += 8;
    findings.push({
      type: "strength",
      message: "Visual/reel file present for a visual-first platform.",
    });
    findings.push({
      type: "info",
      message:
        "Offline fallback confirms a file was present; Claude reviews frames when the API key is set.",
    });
  } else if (!input.hasImage) {
    score -= 12;
    findings.push({
      type: "issue",
      message: "No visual attached — packaging is weak for social scroll.",
    });
    suggestions.push("Attach a still or reel before production.");
  }

  if (input.platform === "tiktok" && !input.hasImage) {
    score -= 15;
    findings.push({
      type: "issue",
      message: "TikTok needs a video/reel asset, not caption packaging alone.",
    });
  }

  findings.push({
    type: "info",
    message: "Caption length, hooks and hashtags are scored in the Caption check.",
  });

  const finalScore = clampScore(score);
  return {
    score: finalScore,
    status: statusFromScore(finalScore),
    findings,
    suggestions: [...new Set(suggestions)],
  };
}

function countSignalHits(captionLower: string, signals: string[]): string[] {
  return signals.filter((signal) => captionLower.includes(signal.toLowerCase()));
}

function hasFirstPersonStory(caption: string): boolean {
  return /\b(i|i'm|i’ve|i've|we|we're|my|our)\b/i.test(caption);
}

export async function evaluateBrandTone(
  input: EvaluationInput
): Promise<CheckResult> {
  await delay(STEP_DELAYS.brand_tone);

  // Caption ToV is scored in Caption check — this offline path is visual packaging only.
  const findings: Finding[] = [];
  const suggestions: string[] = [];
  let score = 72;

  if (!input.hasImage) {
    score -= 35;
    findings.push({
      type: "issue",
      message: "No visual to check against Citroën Charte rules.",
    });
    suggestions.push("Attach a still or reel so brand visual rules can be reviewed.");
  } else {
    score += 10;
    findings.push({
      type: "strength",
      message: "Visual present for brand identity review.",
    });
    findings.push({
      type: "info",
      message:
        "Offline mode cannot inspect colours/logo — Claude applies Charte rules when the API key is set.",
    });
    suggestions.push(
      "Confirm white predominance, logo clear space, and no black/blue backgrounds before production.",
    );
  }

  findings.push({
    type: "info",
    message: "Written tone of voice is scored in the Caption check, not here.",
  });

  const finalScore = clampScore(score);
  return {
    score: finalScore,
    status: statusFromScore(finalScore),
    findings,
    suggestions: [...new Set(suggestions)],
  };
}

export async function evaluateCaption(
  input: EvaluationInput
): Promise<CheckResult> {
  await delay(STEP_DELAYS.caption);

  const config = getPlatformConfig(input.platform);
  const captionLower = input.caption.toLowerCase();
  const findings: Finding[] = [];
  const suggestions: string[] = [];
  let score = 68;

  if (input.caption.length > config.maxCaptionLength) {
    score -= 35;
    findings.push({
      type: "issue",
      message: `Caption exceeds ${config.label}'s ${config.maxCaptionLength}-character limit.`,
    });
    suggestions.push("Trim the copy to fit platform limits.");
  } else if (input.caption.length > config.idealCaptionLength * 3) {
    score -= 12;
    findings.push({
      type: "issue",
      message: `Caption is longer than ideal for ${config.label}.`,
    });
    suggestions.push(
      `Aim for around ${config.idealCaptionLength} characters for better engagement.`,
    );
  } else {
    findings.push({
      type: "strength",
      message: "Caption length fits platform expectations.",
    });
  }

  if (input.platform === "tiktok" && input.caption.length > 150) {
    score -= 15;
    findings.push({
      type: "issue",
      message: "Caption is too long for TikTok — keep it as a short hook.",
    });
  }

  if (config.hashtagRecommended && !hasHashtag(input.caption)) {
    score -= 8;
    findings.push({
      type: "info",
      message: "No hashtags detected — Instagram posts typically include 3–5 tags.",
    });
    suggestions.push("Add branded hashtags such as #EverydayOutsiders.");
  }

  if (!hasQuestionHook(input.caption) && !hasCta(input.caption)) {
    score -= 10;
    findings.push({
      type: "issue",
      message: "No clear hook or call-to-action in the opening line.",
    });
    suggestions.push("Open with a question or bold statement to stop the scroll.");
  } else {
    findings.push({
      type: "strength",
      message: "Opening line includes an engaging hook or CTA.",
    });
  }

  if (input.platform === "x" && input.caption.length > 280) {
    score -= 40;
    findings.push({
      type: "issue",
      message: "Post exceeds X's 280-character limit.",
    });
  }

  const matchedPrefer = BRAND_VOICE.preferPhrases.filter((phrase) =>
    captionLower.includes(phrase.toLowerCase()),
  );
  const matchedAvoid = BRAND_VOICE.avoidPhrases.filter((phrase) =>
    captionLower.includes(phrase.toLowerCase()),
  );
  const highHits = countSignalHits(
    captionLower,
    BRAND_VOICE.highEngagementSignals,
  );
  const lowHits = countSignalHits(
    captionLower,
    BRAND_VOICE.lowEngagementSignals,
  );

  if (matchedPrefer.length > 0) {
    score += Math.min(matchedPrefer.length * 5, 20);
    findings.push({
      type: "strength",
      message: `On-brand lifestyle language: "${matchedPrefer.slice(0, 2).join('", "')}".`,
    });
  }

  if (matchedAvoid.length > 0) {
    score -= matchedAvoid.length * 14;
    findings.push({
      type: "issue",
      message: `Off-voice phrasing: "${matchedAvoid.slice(0, 2).join('", "')}".`,
    });
    suggestions.push(
      "Rewrite in everyday human language — real life, not racing jargon or corporate claims.",
    );
  }

  if (highHits.length >= 2) {
    score += Math.min(highHits.length * 3, 18);
    findings.push({
      type: "strength",
      message: `Matches high-engagement caption patterns (e.g. "${highHits.slice(0, 3).join('", "')}").`,
    });
  }

  if (lowHits.length >= 1) {
    score -= Math.min(lowHits.length * 10, 35);
    findings.push({
      type: "issue",
      message: `Low-engagement copy patterns (e.g. "${lowHits.slice(0, 2).join('", "')}").`,
    });
  }

  if (hasFirstPersonStory(input.caption)) {
    score += 8;
    findings.push({
      type: "strength",
      message: "First-person storytelling — common in top-performing UGC captions.",
    });
  }

  const emojiCount = countEmojis(input.caption);
  if (emojiCount > BRAND_VOICE.maxEmojiCount) {
    score -= 8;
    findings.push({
      type: "issue",
      message: `Too many emojis (${emojiCount}).`,
    });
  }

  const finalScore = clampScore(score);
  return {
    score: finalScore,
    status: statusFromScore(finalScore),
    findings,
    suggestions: [...new Set(suggestions)],
  };
}

function buildPersonaQuotes(input: EvaluationInput, score: number): PersonaQuote[] {
  const caption = input.caption;
  const captionLower = caption.toLowerCase();
  const isCorporate = BRAND_VOICE.avoidPhrases.some((p) =>
    captionLower.includes(p.toLowerCase())
  );
  const isMotorsportHeavy = BRAND_VOICE.lowEngagementSignals.some((p) =>
    captionLower.includes(p.toLowerCase())
  );
  const isEngaging =
    hasQuestionHook(caption) ||
    hasFirstPersonStory(caption) ||
    /weekend|adventure|family|kids|electric|journey|diy|clean/i.test(caption);

  const names = AUDIENCE_PERSONAS.map((p) => p.name);
  // Always include Jay (last) as a dissenting voice — matches Claude panel rules.
  const jay = names[names.length - 1] ?? "Jay, 24";

  if (isCorporate || isMotorsportHeavy) {
    return names.map((persona, i) => ({
      persona,
      quote:
        i === names.length - 1
          ? "Yeah no. Ad. Scrolled."
          : "This feels like a press release — I'd scroll past.",
      sentiment: "negative" as const,
    }));
  }

  if (isEngaging && score >= 75) {
    return names.map((persona, i) => {
      if (i === names.length - 1) {
        return {
          persona: jay,
          quote: "Fine, the joke landed once. Still wouldn't save it.",
          sentiment: "negative" as const,
        };
      }
      if (i === 3) {
        return {
          persona,
          quote: "The family chaos / day-out vibe is spot on. I'd stop for this.",
          sentiment: "positive" as const,
        };
      }
      return {
        persona,
        quote:
          "This feels honest and human — the kind of Citroën content I'd actually watch.",
        sentiment: "positive" as const,
      };
    });
  }

  return names.map((persona, i) => ({
    persona,
    quote:
      i === names.length - 1
        ? "Generic. Next."
        : "It's fine but doesn't feel especially aimed at me.",
    sentiment: (i === names.length - 1 ? "negative" : "neutral") as
      | "positive"
      | "neutral"
      | "negative",
  }));
}

function receptivenessFromScore(score: number): Receptiveness {
  if (score >= 75) return "high";
  if (score >= 55) return "medium";
  return "low";
}

export async function evaluateAudience(
  input: EvaluationInput
): Promise<AudienceResult> {
  await delay(STEP_DELAYS.audience);

  const captionLower = input.caption.toLowerCase();
  const findings: Finding[] = [];
  const suggestions: string[] = [];
  let score = 70;

  const isTooNiche =
    /stakeholder|paradigm|synergy|utilize|utilise|racecraft|energy management|pole position/i.test(
      captionLower
    );
  const isMotorsport =
    countSignalHits(captionLower, BRAND_VOICE.lowEngagementSignals).length >= 2;
  const isTooGeneric = captionLower.length < 40;
  const lifestyleHits = countSignalHits(
    captionLower,
    BRAND_VOICE.highEngagementSignals
  );
  const hasAudienceSignal = lifestyleHits.length > 0;

  if (isTooNiche || isMotorsport) {
    score -= 28;
    findings.push({
      type: "issue",
      message:
        "Copy skews toward niche motorsport / corporate language. Real Everyday Outsiders engagement favoured lifestyle UGC over Formula E race copy.",
    });
    suggestions.push(
      "Reframe around a moment your audience recognises: school run, weekend trip, DIY haul, or a fresh-car reset."
    );
  }

  if (isTooGeneric) {
    score -= 15;
    findings.push({
      type: "issue",
      message: "Caption is too short and thin — top posts usually tell a small story.",
    });
    suggestions.push(
      "Add a short scene (who, where, why it matters) before the model name."
    );
  }

  if (hasAudienceSignal) {
    score += Math.min(8 + lifestyleHits.length * 2, 20);
    findings.push({
      type: "strength",
      message: "Messaging connects to lifestyle signals seen in high-engagement Citroën posts.",
    });
  }

  if (hasQuestionHook(input.caption)) {
    score += 8;
    findings.push({
      type: "strength",
      message: "Question hook invites audience participation and comment.",
    });
  }

  if (hasFirstPersonStory(input.caption) && hasAudienceSignal) {
    score += 6;
    findings.push({
      type: "strength",
      message: "Personal story + lifestyle context — pattern shared by top UGC performers.",
    });
  }

  const finalScore = clampScore(score);
  const personaQuotes = buildPersonaQuotes(input, finalScore);

  return {
    score: finalScore,
    status: statusFromScore(finalScore),
    findings,
    suggestions: [...new Set(suggestions)],
    receptiveness: receptivenessFromScore(finalScore),
    personaQuotes,
  };
}

function aggregateResults(
  bestPractice: CheckResult,
  brandTone: CheckResult,
  audience: AudienceResult,
  caption: CheckResult,
): FullEvaluationResult {
  const aggregateScore = clampScore(
    (bestPractice.score + brandTone.score + audience.score + caption.score) / 4,
  );

  const statuses = [
    bestPractice.status,
    brandTone.status,
    audience.status,
    caption.status,
  ];
  let overallStatus: CheckStatus = "pass";
  if (statuses.includes("fail")) overallStatus = "fail";
  else if (statuses.includes("warn")) overallStatus = "warn";

  const allSuggestions = [
    ...caption.suggestions,
    ...bestPractice.suggestions,
    ...brandTone.suggestions,
    ...audience.suggestions,
  ];

  const topActions = [...new Set(allSuggestions)].slice(0, 3);

  if (topActions.length === 0) {
    topActions.push(
      "Creative is client-ready — proceed to human sign-off.",
      "Consider A/B testing the opening hook.",
      "Monitor engagement against Everyday Outsiders benchmarks post-publish.",
    );
  }

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

function unrelatedFullResult(message: string): FullEvaluationResult {
  const check: CheckResult = {
    score: 0,
    status: "fail",
    findings: [{ type: "issue", message }],
    suggestions: [
      "Submit creative that is clearly for Citroën (brand, model, or client brief).",
    ],
  };
  return {
    bestPractice: check,
    brandTone: check,
    audience: {
      ...check,
      receptiveness: "low",
      personaQuotes: [
        {
          persona: "Jay, 24, Birmingham",
          quote: "This isn't even for Citroën.",
          sentiment: "negative",
        },
      ],
    },
    caption: check,
    aggregateScore: 0,
    overallStatus: "fail",
    topActions: [
      "This creative is not related to the Citroën client — score is 0.",
      "Resubmit with Citroën product, brand, or brief-aligned content.",
    ],
  };
}

export async function runFullEvaluation(
  input: EvaluationInput,
  onStepComplete?: (result: StepEvaluationResult) => void,
): Promise<FullEvaluationResult> {
  if (isClearlyUnrelatedToClient(input.caption, { hasVisual: input.hasImage })) {
    const zeroed = unrelatedFullResult(
      "Nothing here relates to the Citroën client — overall score is 0.",
    );
    onStepComplete?.({ step: "best_practice", data: zeroed.bestPractice });
    onStepComplete?.({ step: "brand_tone", data: zeroed.brandTone });
    onStepComplete?.({ step: "audience", data: zeroed.audience });
    onStepComplete?.({ step: "caption", data: zeroed.caption });
    return zeroed;
  }

  const bestPractice = await evaluateBestPractice(input);
  onStepComplete?.({ step: "best_practice", data: bestPractice });

  const brandTone = await evaluateBrandTone(input);
  onStepComplete?.({ step: "brand_tone", data: brandTone });

  const audience = await evaluateAudience(input);
  onStepComplete?.({ step: "audience", data: audience });

  const caption = await evaluateCaption(input);
  onStepComplete?.({ step: "caption", data: caption });

  return aggregateResults(bestPractice, brandTone, audience, caption);
}

export const STEP_LABELS: Record<EvaluationStep, string> = {
  best_practice: "Platform Best Practice",
  brand_tone: "Brand Visual Identity",
  audience: "Audience Focus Group",
  caption: "Caption Performance",
};

export const STEP_DESCRIPTIONS: Record<EvaluationStep, string> = {
  best_practice: "Visual format and platform packaging (not caption craft)",
  brand_tone: "Charte visual rules — logo, colour, composition",
  audience: "Everyday Outsiders reaction to the visual",
  caption: "Written copy: hook, ToV, length, engage reason",
};
