import { AUDIENCE_PERSONAS, BRAND_VOICE } from "@/lib/data/citroen";
import { getPlatformConfig } from "@/lib/data/platforms";
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
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function statusFromScore(score: number): CheckStatus {
  if (score >= 75) return "pass";
  if (score >= 50) return "warn";
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

  const config = getPlatformConfig(input.platform);
  const findings: Finding[] = [];
  const suggestions: string[] = [];
  let score = 82;

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
    suggestions.push(`Aim for around ${config.idealCaptionLength} characters for better engagement.`);
  } else {
    findings.push({
      type: "strength",
      message: "Caption length fits platform expectations.",
    });
  }

  if (config.requiresImage && !input.hasImage) {
    score -= 18;
    findings.push({
      type: "issue",
      message: "Carousel or single image strongly recommended for Instagram.",
    });
    suggestions.push("Add a hero image or carousel to support the caption.");
  } else if (input.hasImage && (input.platform === "instagram" || input.platform === "tiktok")) {
    score += 8;
    findings.push({
      type: "strength",
      message: "Visual asset included — aligns with platform best practice.",
    });
  }

  if (input.platform === "tiktok" && input.caption.length > 150) {
    score -= 15;
    findings.push({
      type: "issue",
      message: "Caption is too long for TikTok — keep on-screen text minimal.",
    });
    suggestions.push("Move detail to the video voiceover and keep the caption as a short hook.");
  }

  if (config.hashtagRecommended && !hasHashtag(input.caption)) {
    score -= 8;
    findings.push({
      type: "info",
      message: "No hashtags detected — Instagram posts typically include 3–5 relevant tags.",
    });
    suggestions.push("Add branded and category hashtags such as #EverydayOutsiders.");
  } else if (hasHashtag(input.caption)) {
    findings.push({
      type: "strength",
      message: "Hashtags present and discoverable.",
    });
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

  const finalScore = clampScore(score);
  return {
    score: finalScore,
    status: statusFromScore(finalScore),
    findings,
    suggestions: [...new Set(suggestions)],
  };
}

export async function evaluateBrandTone(
  input: EvaluationInput
): Promise<CheckResult> {
  await delay(STEP_DELAYS.brand_tone);

  const captionLower = input.caption.toLowerCase();
  const findings: Finding[] = [];
  const suggestions: string[] = [];
  let score = 70;

  const matchedPrefer = BRAND_VOICE.preferPhrases.filter((phrase) =>
    captionLower.includes(phrase.toLowerCase())
  );
  const matchedAvoid = BRAND_VOICE.avoidPhrases.filter((phrase) =>
    captionLower.includes(phrase.toLowerCase())
  );

  if (matchedPrefer.length > 0) {
    score += matchedPrefer.length * 6;
    findings.push({
      type: "strength",
      message: `On-brand language detected: "${matchedPrefer.slice(0, 2).join('", "')}".`,
    });
  }

  if (matchedAvoid.length > 0) {
    score -= matchedAvoid.length * 12;
    findings.push({
      type: "issue",
      message: `Corporate jargon flagged: "${matchedAvoid.slice(0, 2).join('", "')}".`,
    });
    suggestions.push("Replace corporate language with bold, human, conversational copy.");
  }

  const emojiCount = countEmojis(input.caption);
  if (emojiCount > BRAND_VOICE.maxEmojiCount) {
    score -= 10;
    findings.push({
      type: "issue",
      message: `Too many emojis (${emojiCount}) — Citroën social stays restrained and confident.`,
    });
    suggestions.push(`Limit to ${BRAND_VOICE.maxEmojiCount} emojis or fewer.`);
  } else if (emojiCount > 0) {
    findings.push({
      type: "strength",
      message: "Emoji use is within brand guidelines.",
    });
  }

  if (/everyday outsider/i.test(input.caption) || /your way/i.test(input.caption)) {
    score += 10;
    findings.push({
      type: "strength",
      message: "Copy reflects the Everyday Outsiders audience positioning.",
    });
  }

  if (/\b(is|are|was|were)\b/i.test(input.caption) && !hasQuestionHook(input.caption)) {
    const passiveFeel = /\b(is designed|are designed|was created|is engineered)\b/i.test(input.caption);
    if (passiveFeel) {
      score -= 8;
      findings.push({
        type: "issue",
        message: "Passive, product-spec tone detected — Citroën voice is more human and direct.",
      });
      suggestions.push("Rewrite from the driver's perspective: what they'll feel, not what we built.");
    }
  }

  if (matchedPrefer.length === 0 && matchedAvoid.length === 0) {
    findings.push({
      type: "info",
      message: "Copy is neutral — could lean further into Citroën's bold, optimistic voice.",
    });
    suggestions.push("Add movement, freedom, or 'your way' motifs to strengthen brand fit.");
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
  const isCorporate = BRAND_VOICE.avoidPhrases.some((p) =>
    caption.toLowerCase().includes(p.toLowerCase())
  );
  const isEngaging = hasQuestionHook(caption) || /weekend|adventure|electric|journey/i.test(caption);

  if (isCorporate) {
    return [
      {
        persona: AUDIENCE_PERSONAS[0].name,
        quote: "This sounds like a press release, not something I'd stop scrolling for.",
        sentiment: "negative",
      },
      {
        persona: AUDIENCE_PERSONAS[1].name,
        quote: "I can't tell what this is actually offering me or my family.",
        sentiment: "negative",
      },
      {
        persona: AUDIENCE_PERSONAS[2].name,
        quote: "Too much jargon — I'd scroll past without reading the rest.",
        sentiment: "negative",
      },
    ];
  }

  if (isEngaging && score >= 75) {
    return [
      {
        persona: AUDIENCE_PERSONAS[0].name,
        quote: "Love the weekend energy — feels like it's speaking to people who actually get out and do things.",
        sentiment: "positive",
      },
      {
        persona: AUDIENCE_PERSONAS[1].name,
        quote: "Compact and electric is exactly what we need for school runs and weekend trips.",
        sentiment: "positive",
      },
      {
        persona: AUDIENCE_PERSONAS[2].name,
        quote: "The question at the end makes me want to comment — I'd engage with this.",
        sentiment: "positive",
      },
    ];
  }

  return [
    {
      persona: AUDIENCE_PERSONAS[0].name,
      quote: "It's fine but doesn't feel especially aimed at me — a bit generic.",
      sentiment: "neutral",
    },
    {
      persona: AUDIENCE_PERSONAS[1].name,
      quote: "I'd need to see more about practicality and price before this lands.",
      sentiment: "neutral",
    },
    {
      persona: AUDIENCE_PERSONAS[2].name,
      quote: "Decent message but nothing that makes me stop and think 'that's for me'.",
      sentiment: "neutral",
    },
  ];
}

function receptivenessFromScore(score: number): Receptiveness {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

export async function evaluateAudience(
  input: EvaluationInput
): Promise<AudienceResult> {
  await delay(STEP_DELAYS.audience);

  const captionLower = input.caption.toLowerCase();
  const findings: Finding[] = [];
  const suggestions: string[] = [];
  let score = 72;

  const isTooNiche = /stakeholder|paradigm|synergy|utilize/i.test(captionLower);
  const isTooGeneric = captionLower.length < 40;
  const hasAudienceSignal = /everyday|weekend|family|commute|city|adventure|electric|your way/i.test(captionLower);

  if (isTooNiche) {
    score -= 25;
    findings.push({
      type: "issue",
      message: "Copy feels too corporate for Everyday Outsiders — audience may disengage.",
    });
    suggestions.push("Reframe around real-life moments your audience recognises.");
  }

  if (isTooGeneric) {
    score -= 15;
    findings.push({
      type: "issue",
      message: "Copy is too generic — doesn't speak to a specific audience need.",
    });
    suggestions.push("Anchor the message in a relatable scenario (weekend trip, city commute, first EV).");
  }

  if (hasAudienceSignal) {
    score += 12;
    findings.push({
      type: "strength",
      message: "Messaging connects to Everyday Outsiders lifestyle signals.",
    });
  }

  if (hasQuestionHook(input.caption)) {
    score += 8;
    findings.push({
      type: "strength",
      message: "Question hook invites audience participation and comment.",
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
  audience: AudienceResult
): FullEvaluationResult {
  const aggregateScore = clampScore(
    (bestPractice.score + brandTone.score + audience.score) / 3
  );

  const statuses = [bestPractice.status, brandTone.status, audience.status];
  let overallStatus: CheckStatus = "pass";
  if (statuses.includes("fail")) overallStatus = "fail";
  else if (statuses.includes("warn")) overallStatus = "warn";

  const allSuggestions = [
    ...bestPractice.suggestions,
    ...brandTone.suggestions,
    ...audience.suggestions,
  ];

  const topActions = [...new Set(allSuggestions)].slice(0, 3);

  if (topActions.length === 0) {
    topActions.push(
      "Creative is client-ready — proceed to human sign-off.",
      "Consider A/B testing the opening hook.",
      "Monitor engagement against Everyday Outsiders benchmarks post-publish."
    );
  }

  return {
    bestPractice,
    brandTone,
    audience,
    aggregateScore,
    overallStatus,
    topActions,
  };
}

export async function runFullEvaluation(
  input: EvaluationInput,
  onStepComplete?: (result: StepEvaluationResult) => void
): Promise<FullEvaluationResult> {
  const bestPractice = await evaluateBestPractice(input);
  onStepComplete?.({ step: "best_practice", data: bestPractice });

  const brandTone = await evaluateBrandTone(input);
  onStepComplete?.({ step: "brand_tone", data: brandTone });

  const audience = await evaluateAudience(input);
  onStepComplete?.({ step: "audience", data: audience });

  return aggregateResults(bestPractice, brandTone, audience);
}

export const STEP_LABELS: Record<EvaluationStep, string> = {
  best_practice: "Platform Best Practice",
  brand_tone: "Brand Tone of Voice",
  audience: "Audience Focus Group",
};

export const STEP_DESCRIPTIONS: Record<EvaluationStep, string> = {
  best_practice: "Checking format, length, and platform trends",
  brand_tone: "Validating against Citroën voice guidelines",
  audience: "Simulating Everyday Outsiders focus group feedback",
};
