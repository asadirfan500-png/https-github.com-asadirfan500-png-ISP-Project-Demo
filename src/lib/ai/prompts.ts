/**
 * The four prompts. This file is the brain of the tool.
 *
 * Checks are split so caption quality is NOT double-counted:
 *  1. Best practice — platform packaging + visual format only
 *  2. Brand tone — visual identity rules only
 *  3. Audience — reaction to the visual only
 *  4. Caption — written copy only (ToV, craft, hooks)
 *
 * Client relevance gate: if the creative is not for Citroën, score MUST be 0.
 */

import type { Platform } from "@/lib/types";
import { getPlatformConfig } from "@/lib/data/platforms";
import { buildBrandToneContext } from "@/lib/data/brand";
import { buildAudienceContext } from "@/lib/data/audience";
import { CITROEN_TRAINING_POSTS } from "@/lib/data/citroen-posts-training";

const CLIENT_RELEVANCE_CLAUSE = `
CLIENT RELEVANCE GATE — Citroën only

This tool reviews creative for the Citroën client only.

LOOK AT ANY ATTACHED IMAGE / FRAMES FIRST. Visual evidence beats caption wording.

clientRelevant = true when ANY of these are visible or clearly implied:
- A Citroën vehicle (including ë-C3, C3, C4, C5 Aircross, Berlingo, Ami, etc.)
- Citroën chevrons / logo / "Citroën" lettering on the car or in the frame
- Lifestyle creative clearly shot around a Citroën product for this brief

Do NOT require the word "Citroën" in the caption. A big Citroën car with a short
or generic caption is still client-related.

clientRelevant = false ONLY when the material is clearly for someone else:
- Another car brand's product/logo with no Citroën presence
- Unrelated niche (food, meme, crypto, fashion haul) with no Citroën vehicle/logo

If clientRelevant is false: score MUST be 0, status "fail".
If the image shows a Citroën car but on-image text is sparse: still clientRelevant true.
Text overlays help brand checks but are NOT required to count as client-related.
`;

const HONESTY_CLAUSE = `
CRITICAL INSTRUCTIONS ON HONESTY

You are reviewing a concept BEFORE it is produced. Catching a problem now saves a
production budget; missing one wastes it. An inflated score is worse than useless
because it removes the only reason this tool exists.

- Identify at least TWO genuine weaknesses, even if the work is strong — unless
  you have already set score to 0 for client-irrelevance.
- Do not pad findings with compliments dressed as observations.
- Reason FIRST, score LAST.
- Scores above 85 should be rare and must be earned against the anchors below.
`;

const JSON_CONTRACT = `
Respond with ONLY a JSON object. No preamble, no explanation, no markdown fences.

{
  "reasoning": "2-4 sentences of assessment, written before you decide the score",
  "clientRelevant": true | false,
  "score": 0-100,
  "status": "pass" | "warn" | "fail",
  "findings": [
    { "type": "strength" | "issue" | "info", "message": "one specific sentence" }
  ],
  "suggestions": ["concrete, actionable rewrite or change"]
}

If clientRelevant is false, score MUST be 0 and status MUST be "fail".
Otherwise status maps to score: 75+ is pass, 55-74 is warn, below 55 is fail.
Include 3-5 findings (at least two type "issue" unless score is 0).
`;

function buildExamples(): string {
  const high = CITROEN_TRAINING_POSTS.filter((p) => p.tier === "high");
  const low = CITROEN_TRAINING_POSTS.filter((p) => p.tier === "low");

  const format = (label: string, posts: typeof CITROEN_TRAINING_POSTS) =>
    posts
      .map(
        (p) =>
          `[${label} — ${p.engagements} engagements, ${p.format}]\n"${p.caption}"\nWhy: ${p.notes}`,
      )
      .join("\n\n");

  return `
REAL CITROËN POSTS WITH KNOWN OUTCOMES (for craft reference — caption check only)

- Learn HOW strong posts are written; do not treat engagement counts as comparable
  across creator vs brand accounts.
- Weak motorsport examples fail on jargon and missing human anchor — not because
  motorsport is forbidden.

STRONGER PERFORMERS
${format("STRONG", high)}

WEAKER PERFORMERS
${format("WEAK", low)}
`;
}

/* ------------------------------------------------------------------ */
/* 1. BEST PRACTICE — visual / platform packaging (NO caption scoring) */
/* ------------------------------------------------------------------ */

export function bestPracticePrompt(
  platform: Platform,
  caption: string,
  hasVisual: boolean,
  visualKind: "image" | "video" | "none" = hasVisual ? "image" : "none",
) {
  const cfg = getPlatformConfig(platform);
  const visualLabel =
    visualKind === "video"
      ? "yes — reel/video; sampled still frames attached above in time order"
      : visualKind === "image"
        ? "yes, image attached above"
        : "no";

  return `You are a senior social media strategist at a London agency, reviewing
VISUAL / FORMAT packaging for ${cfg.label} before production.

SCOPE — WHAT YOU SCORE
- Platform fit of the visual (static vs reel, hook in first frames, scroll-stop).
- Whether a required visual is missing for this platform.
- Visual storytelling clarity from the frames/image alone.

SCOPE — WHAT YOU MUST IGNORE
- Do NOT score caption length, hooks, hashtags, emoji, CTA wording, or tone of voice.
  Those are scored in a separate Caption check. The caption is shown only so you
  can confirm client relevance and whether the visual roughly matches the brief.

PLATFORM — ${cfg.label}
Image typically required: ${cfg.requiresImage ? "yes" : "no"}.
Tips (apply to visual/format only):
${cfg.tips.map((t) => `- ${t}`).join("\n")}

CLIENT INSIGHTS
- Video massively outperforms static for this client.
- Opening visual hook matters more than polish.

SCORING ANCHORS (visual/format only)
90 — Visual stops the scroll on its own; format suits the platform; clear story.
70 — Publishable packaging; one clear visual/format weakness.
50 — Unremarkable or weak format for the platform.
30 — Wrong format, no usable visual where needed, or no reason to stop.
0  — Not a Citroën client piece (see client gate).

${CLIENT_RELEVANCE_CLAUSE}
${HONESTY_CLAUSE}

MATERIAL UNDER REVIEW
Platform: ${cfg.label}
Visual supplied: ${visualLabel}
Caption (for relevance / match only — do not score the writing):
"""
${caption}
"""

${
  visualKind === "video"
    ? "Reel frames are in time order. Decide clientRelevant from the frames (Citroën car/logo), then score the opening hook and sequence clarity. You cannot hear audio."
    : visualKind === "image"
      ? "Decide clientRelevant from what is in the image (Citroën car, chevrons, logo — text overlays are optional). Then score whether the still earns attention and suits the platform."
      : "No visual supplied. If this platform depends on one, fail that hard. Do not invent a score based on caption craft."
}

${JSON_CONTRACT}`;
}

/* ------------------------------------------------------------------ */
/* 2. BRAND TONE — visual identity only (NO caption scoring)           */
/* ------------------------------------------------------------------ */

export function brandTonePrompt(
  platform: Platform,
  caption: string,
  hasVisual: boolean,
  visualKind: "image" | "video" | "none" = hasVisual ? "image" : "none",
) {
  return `You are a brand guardian for Citroën checking VISUAL identity only.

${buildBrandToneContext()}

SCOPE — WHAT YOU SCORE
- Visual rules from the Charte (white predominance, Infra Red use, backgrounds,
  logo treatment, type weights, simplicity).
- Whether the look could belong to Citroën.

SCOPE — WHAT YOU MUST IGNORE
- Do NOT score caption wording, warmth, humour, jargon in the copy, or lower-case
  preference in text. That is the Caption check. Caption is shown for client
  relevance only.

SCORING ANCHORS (visual only)
90 — Visual fully respects guidelines; unmistakably on-brand.
70 — Mostly on-brand; one rule bent.
50 — Generic car-brand look or a clear visual rule broken.
30 — Actively off-brand visually.
0  — Not a Citroën client piece.

${CLIENT_RELEVANCE_CLAUSE}
${HONESTY_CLAUSE}

MATERIAL UNDER REVIEW
Platform: ${platform}
Caption (relevance only — do not score the writing):
"""
${caption}
"""

${
  visualKind === "video"
    ? `Frames attached in time order. First decide clientRelevant by what you SEE (Citroën car, chevrons, logo) — not by caption text. Then check visual rules. Name broken rules from what you can see. No audio.`
    : visualKind === "image"
      ? `Image attached. First decide clientRelevant by what you SEE: if this is a Citroën vehicle or clearly shows Citroën branding, clientRelevant is true even with little/no on-image text. Then check visual rules. Do not require text overlays to count as client-related.`
      : "No visual supplied. You cannot score visual brand tone — set score to 30 or below with an issue that a visual is required for this check, unless clientRelevant is false (then 0)."
}

${JSON_CONTRACT}`;
}

/* ------------------------------------------------------------------ */
/* 3. AUDIENCE — visual reaction only (NO caption scoring)             */
/* ------------------------------------------------------------------ */

export function audiencePrompt(
  platform: Platform,
  caption: string,
  hasVisual: boolean,
  visualKind: "image" | "video" | "none" = hasVisual ? "image" : "none",
) {
  const visualLabel =
    visualKind === "video"
      ? "yes — reel/video frames shown to the panel above (time order)"
      : visualKind === "image"
        ? "yes, shown to the panel above"
        : "no visual — panel reacts to the idea of a caption-only post packaging";

  return `You are running a focus group. Six Everyday Outsiders are shown the VISUAL
for a ${platform} concept. They are NOT scoring the caption writing.

${buildAudienceContext()}

SCOPE — WHAT YOU SCORE
- Would they stop for the visual / reel sequence?
- Does the image feel aimed at their lives?

SCOPE — WHAT YOU MUST IGNORE
- Do NOT critique caption wording, hooks, or brand voice in the copy. Quotes
  should react to what they SEE (or the lack of a visual), not to sentence craft.

HOW TO RUN THE PANEL
Respond AS each persona. The panel MUST disagree. Jay is hard to please.
At least ONE negative sentiment on every post.

SCORING ANCHORS (visual attention)
90 — Most stop; several would share the visual.
70 — Mild positive; some indifference.
50 — Noticed, no pull.
30 — Scrolled past or annoyed.
0  — Not a Citroën client piece.

${CLIENT_RELEVANCE_CLAUSE}
${HONESTY_CLAUSE}

MATERIAL UNDER REVIEW
Platform: ${platform}
Visual supplied: ${visualLabel}
Caption (relevance only — do not score the writing):
"""
${caption}
"""

${
  visualKind === "video"
    ? "Reel frames in time order. Decide if this is Citroën creative from the frames, then react to opening hook. No audio."
    : visualKind === "image"
      ? "React to the still. If you can see a Citroën car or branding, treat it as client content even without text overlays."
      : "No visual — most should say they would scroll past a text-only brand post."
}

Respond with ONLY a JSON object, no fences:

{
  "reasoning": "what happened in the room, including where the panel split",
  "clientRelevant": true | false,
  "score": 0-100,
  "status": "pass" | "warn" | "fail",
  "receptiveness": "high" | "medium" | "low",
  "personaQuotes": [
    {
      "persona": "Name, age, region",
      "quote": "what they said about the VISUAL, in their voice, 1-2 sentences",
      "sentiment": "positive" | "neutral" | "negative"
    }
  ],
  "findings": [
    { "type": "strength" | "issue" | "info", "message": "one specific sentence" }
  ],
  "suggestions": ["concrete visual change that would improve reception"]
}

If clientRelevant is false, score MUST be 0. Include all six personas. At least
one sentiment must be "negative". status: 75+ pass, 55-74 warn, below 55 fail.`;
}

/* ------------------------------------------------------------------ */
/* 4. CAPTION — written copy only                                      */
/* ------------------------------------------------------------------ */

export function captionPrompt(
  platform: Platform,
  caption: string,
  hasVisual: boolean,
  visualKind: "image" | "video" | "none" = hasVisual ? "image" : "none",
) {
  const cfg = getPlatformConfig(platform);

  return `You are reviewing CAPTION COPY ONLY for a Citroën ${cfg.label} post.

${buildBrandToneContext()}

${buildExamples()}

SCOPE — WHAT YOU SCORE
- Opening hook, specificity, warmth, accessibility, humour/self-awareness.
- Length vs platform norms, hashtags if relevant, CTA / reason to engage.
- Verbal ToV rules (friend in a car park, no prestige jargon, Citroën spelling).

SCOPE — WHAT YOU MUST IGNORE
- Do NOT score the image/reel packaging, logo placement, or colour rules.
  Visuals are scored in the other checks. ${
    visualKind !== "none"
      ? `A visual WAS supplied to the other checks.
  For THIS caption indicator:
  - Bad / empty / off-voice / useless copy → score 0. That is correct and expected.
  - Do not inflate the caption score because a Citroën car is in the photo.
  - Omitting the word "Citroën" alone is not an automatic fail if the copy still
    supports the moment; fail the caption when the writing itself is weak or wrong.`
      : "No visual was supplied — judge craft and relevance from the caption alone. Bad copy can score 0."
  }

PLATFORM COPY NORMS — ${cfg.label}
Max length: ${cfg.maxCaptionLength}. Typical effective: ~${cfg.idealCaptionLength}.
Hashtags: ${cfg.hashtagRecommended ? "recommended" : "not generally needed"}.

SCORING ANCHORS (caption only)
90 — Stops the scroll in the first line; warm, specific, on-voice; clear engage reason.
70 — Publishable; one clear copy weakness (soft open, generic, missing engage reason).
50 — Filler; off-length; or flat corporate.
30 — Off-voice, jargon, or nothing for the reader to do/feel.
0  — Caption fails on craft or fit: not shippable copy, actively off-voice,
     competitor-framed, empty/nonsense, or so weak it should not go live.
     Use 0 for bad writing — not only when the whole post is the wrong brand.
     You can set clientRelevant true and score 0 when the photo is for Citroën
     but the caption text itself is unusable.

${CLIENT_RELEVANCE_CLAUSE}
${HONESTY_CLAUSE}

MATERIAL UNDER REVIEW
Platform: ${cfg.label}
Caption:
"""
${caption}
"""

${JSON_CONTRACT}`;
}
