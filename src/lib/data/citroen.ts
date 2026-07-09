import type { SamplePost } from "@/lib/types";

export const CITROEN_CLIENT = {
  name: "Citroën",
  audience: "Everyday Outsiders",
  tagline: "People who live life on their own terms",
};

export const BRAND_VOICE = {
  traits: ["bold", "human", "optimistic", "conversational", "inclusive"],
  preferPhrases: [
    "everyday",
    "adventure",
    "your way",
    "weekend",
    "freedom",
    "discover",
    "journey",
    "outsider",
    "electric",
    "compact",
  ],
  avoidPhrases: [
    "synergy",
    "leverage",
    "premium exclusive",
    "best-in-class",
    "paradigm",
    "utilize",
    "stakeholders",
    "disruptive innovation",
    "luxury lifestyle",
  ],
  maxEmojiCount: 3,
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

export const SAMPLE_POSTS: SamplePost[] = [
  {
    id: "good",
    label: "Strong post",
    platform: "instagram",
    caption:
      "Weekends weren't made for sitting still. The new ë-C3 is ready when you are — compact, electric, and unmistakably Citroën. Where are you heading first? #EverydayOutsiders",
  },
  {
    id: "weak",
    label: "Needs work",
    platform: "tiktok",
    caption:
      "Citroën leverages best-in-class synergy to deliver a premium exclusive automotive experience for discerning stakeholders. Our disruptive innovation paradigm utilises cutting-edge EV technology. 🚗✨🔥💯🎉",
  },
];
