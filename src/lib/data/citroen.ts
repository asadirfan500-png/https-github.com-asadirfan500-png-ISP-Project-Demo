import type { SamplePost } from "@/lib/types";
import {
  HIGH_ENGAGEMENT_SIGNALS,
  LOW_ENGAGEMENT_SIGNALS,
  TRAINING_INSIGHTS,
} from "@/lib/data/citroen-posts-training";

export const CITROEN_CLIENT = {
  name: "Citroën",
  audience: "Everyday Outsiders",
  tagline: "People who live life on their own terms",
};

/**
 * Brand voice calibrated from top vs lowest performing @citroenuk / UGC posts
 * (see citroen-posts-training.ts). Prefer phrases mirror high-engagement
 * lifestyle UGC; avoid phrases mirror low-engagement motorsport/generic copy.
 */
export const BRAND_VOICE = {
  traits: [
    "bold",
    "human",
    "optimistic",
    "conversational",
    "inclusive",
    "humorous",
    "relatable",
  ],
  preferPhrases: [
    ...new Set([
      "weekend",
      "adventure",
      "family",
      "kids",
      "parent",
      "road trip",
      "comfy",
      "comfortable",
      "reliable",
      "electric",
      "fresh car",
      "day out",
      "camper",
      "holidays",
      "aircross",
      "berlingo",
      "everyday",
      "your way",
      "freedom",
      "discover",
      "journey",
      "outsider",
      "compact",
      "renovation",
      "diy",
      "surfing",
      "ocean",
      "charity",
      "partner",
      "drive",
    ]),
  ],
  avoidPhrases: [
    ...new Set([
      "synergy",
      "leverage",
      "premium exclusive",
      "best-in-class",
      "paradigm",
      "utilize",
      "utilise",
      "stakeholders",
      "disruptive innovation",
      "luxury lifestyle",
      "pole position",
      "racecraft",
      "energy management",
      "speed reborn",
      "formula e",
      "trajectory has been recalibrated",
      "recalibrated",
      "dark waters",
      "swipe right",
      "whatever your job",
      "abb fia",
      "world championship",
    ]),
  ],
  highEngagementSignals: HIGH_ENGAGEMENT_SIGNALS,
  lowEngagementSignals: LOW_ENGAGEMENT_SIGNALS,
  trainingInsights: TRAINING_INSIGHTS,
  maxEmojiCount: 5,
};

export const AUDIENCE_PERSONAS = [
  {
    id: "urban_creative",
    name: "Maya — Urban Creative",
    description: "28, city-based designer who values style and sustainability",
  },
  {
    id: "family_adventurer",
    name: "James — Suburban Adventurer",
    description: "35, family of four, weekend explorers on a practical budget",
  },
  {
    id: "ev_curious",
    name: "Priya — First-time EV Curious",
    description: "32, commuting professional exploring her first electric car",
  },
];

/** Sample captions adapted from real high vs low engagement posts */
export const SAMPLE_POSTS: SamplePost[] = [
  {
    id: "good",
    label: "Strong post (high-engagement style)",
    platform: "instagram",
    caption:
      "Becoming a parent changes how you drive — from speed to safety, and from passenger princess to terrified snack butler. Having a comfy and reliable car like this C5 Aircross helps you navigate every bump and detour. You'll still be covered in snacks and nursery rhymes, but life feels better on the road. AD @citroenuk #c5aircross #citroenuk #EverydayOutsiders",
  },
  {
    id: "weak",
    label: "Needs work (low-engagement style)",
    platform: "instagram",
    caption:
      "Madrid was a stall. The crew is back on set. The trajectory has been recalibrated. We are ready to fly. Copy that, Berlin. Pole position. Energy management. Pure racecraft. #CitroënRacing #SpeedReborn #FormulaE",
  },
];
