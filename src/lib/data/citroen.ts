import type { SamplePost } from "@/lib/types";
import { citroen } from "@/lib/data/brand";
import { EVERYDAY_OUTSIDERS } from "@/lib/data/audience";
import {
  HIGH_ENGAGEMENT_SIGNALS,
  LOW_ENGAGEMENT_SIGNALS,
  TRAINING_INSIGHTS,
} from "@/lib/data/citroen-posts-training";

export const CITROEN_CLIENT = {
  name: citroen.brand,
  audience: "Everyday Outsiders",
  /** [CHARTE] brand signature */
  tagline: citroen.signature,
  logoUrl: "/clients/citroen-logo.png",
};

/**
 * Compatibility shape for the rules simulator + client brief UI.
 * Prefer / avoid language now comes from the ToV-backed brand profile.
 */
export const BRAND_VOICE = {
  traits: citroen.voiceTraits.map((t) => t.trait.toLowerCase()),
  preferPhrases: citroen.useLanguage,
  avoidPhrases: [
    ...citroen.avoidLanguage,
    // Keep a few motorsport jargon signals for the offline simulator
    "pole position",
    "racecraft",
    "energy management",
    "formula e",
  ],
  highEngagementSignals: HIGH_ENGAGEMENT_SIGNALS,
  lowEngagementSignals: LOW_ENGAGEMENT_SIGNALS,
  trainingInsights: TRAINING_INSIGHTS,
  maxEmojiCount: 5,
  personality: citroen.personality,
  dna: citroen.dna,
  verbalRules: citroen.verbalRules,
  visualRules: citroen.visualRules,
  knownTensions: citroen.knownTensions,
};

/** Six Everyday Outsiders personas — same panel Claude uses. */
export const AUDIENCE_PERSONAS = EVERYDAY_OUTSIDERS.map((p) => ({
  id: p.id,
  name: `${p.name}, ${p.age} — ${p.segment}`,
  description: `${p.region}. ${p.household}. Responds to: ${p.respondsTo[0]}`,
  persona: p,
}));

/** Sample caption adapted from a high-engagement post */
export const SAMPLE_POSTS: SamplePost[] = [
  {
    id: "good",
    label: "Load sample caption",
    platform: "instagram",
    caption:
      "Becoming a parent changes how you drive — from speed to safety, and from passenger princess to terrified snack butler. Having a comfy and reliable car like this C5 Aircross helps you navigate every bump and detour. You'll still be covered in snacks and nursery rhymes, but life feels better on the road. AD @citroenuk #c5aircross #citroenuk #EverydayOutsiders",
  },
];
