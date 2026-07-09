import type { ReviewHistoryItem } from "@/lib/types";

export const MOCK_REVIEWS: ReviewHistoryItem[] = [
  {
    id: "rev-001",
    date: "2026-07-09T14:32:00",
    platform: "instagram",
    captionPreview: "Weekends weren't made for sitting still. The new ë-C3 is ready...",
    caption:
      "Weekends weren't made for sitting still. The new ë-C3 is ready when you are — compact, electric, and unmistakably Citroën. Where are you heading first? #EverydayOutsiders",
    score: 86,
    status: "pass",
    reviewer: "Elisah M.",
    checks: {
      bestPractice: { score: 88, status: "pass", summary: "Strong hook and hashtag use. Image attached." },
      brandTone: { score: 84, status: "pass", summary: "Conversational tone fits Everyday Outsiders." },
      audience: { score: 86, status: "pass", summary: "High receptiveness across all three personas." },
    },
  },
  {
    id: "rev-002",
    date: "2026-07-08T11:15:00",
    platform: "tiktok",
    captionPreview: "POV: you finally find a car that matches your weekend energy...",
    caption:
      "POV: you finally find a car that matches your weekend energy ⚡ The ë-C3 — small footprint, big personality. #Citroen #EverydayOutsiders",
    score: 79,
    status: "pass",
    reviewer: "Tom C.",
    checks: {
      bestPractice: { score: 82, status: "pass", summary: "Short caption suits TikTok format." },
      brandTone: { score: 76, status: "pass", summary: "On-brand energy, slightly informal but acceptable." },
      audience: { score: 78, status: "pass", summary: "Strong appeal with urban creative persona." },
    },
  },
  {
    id: "rev-003",
    date: "2026-07-07T16:48:00",
    platform: "linkedin",
    captionPreview: "Citroën leverages best-in-class synergy to deliver a premium...",
    caption:
      "Citroën leverages best-in-class synergy to deliver a premium exclusive automotive experience for discerning stakeholders.",
    score: 42,
    status: "fail",
    reviewer: "Elisah M.",
    checks: {
      bestPractice: { score: 55, status: "warn", summary: "No hook or CTA in opening line." },
      brandTone: { score: 28, status: "fail", summary: "Corporate jargon flagged — off-brand for Citroën." },
      audience: { score: 43, status: "fail", summary: "Low receptiveness. Reads like a press release." },
    },
  },
  {
    id: "rev-004",
    date: "2026-07-06T09:22:00",
    platform: "instagram",
    captionPreview: "Your commute, reimagined. The ë-C3 makes every day feel like...",
    caption:
      "Your commute, reimagined. The ë-C3 makes every day feel like a small adventure — quiet, electric, and entirely your way. #EverydayOutsiders",
    score: 74,
    status: "warn",
    reviewer: "Ling N.",
    checks: {
      bestPractice: { score: 70, status: "warn", summary: "No image attached — Instagram strongly recommends visual." },
      brandTone: { score: 82, status: "pass", summary: "Good use of movement and freedom motifs." },
      audience: { score: 71, status: "warn", summary: "Moderate receptiveness — copy slightly generic." },
    },
  },
  {
    id: "rev-005",
    date: "2026-07-05T13:05:00",
    platform: "facebook",
    captionPreview: "School run in the morning, coast road by afternoon. One car...",
    caption:
      "School run in the morning, coast road by afternoon. One car, every part of your day covered. Meet the ë-C3.",
    score: 81,
    status: "pass",
    reviewer: "Tom C.",
    checks: {
      bestPractice: { score: 84, status: "pass", summary: "Concise copy suited to Facebook engagement." },
      brandTone: { score: 80, status: "pass", summary: "Relatable family scenario, human tone." },
      audience: { score: 79, status: "pass", summary: "Strong resonance with suburban adventurer persona." },
    },
  },
  {
    id: "rev-006",
    date: "2026-07-04T10:30:00",
    platform: "x",
    captionPreview: "Compact. Electric. Unmistakably Citroën. The ë-C3 is here.",
    caption: "Compact. Electric. Unmistakably Citroën. The ë-C3 is here.",
    score: 77,
    status: "pass",
    reviewer: "Elisah M.",
    checks: {
      bestPractice: { score: 85, status: "pass", summary: "Within character limit, clear single message." },
      brandTone: { score: 74, status: "warn", summary: "Functional but could be more conversational." },
      audience: { score: 72, status: "warn", summary: "Adequate but lacks engagement hook." },
    },
  },
  {
    id: "rev-007",
    date: "2026-07-03T15:18:00",
    platform: "instagram",
    captionPreview: "Not all heroes wear capes. Some drive an ë-C3 to the beach...",
    caption:
      "Not all heroes wear capes. Some drive an ë-C3 to the beach with a boot full of surfboards. 🏄 #EverydayOutsiders #WeekendMode",
    score: 68,
    status: "warn",
    reviewer: "Ling N.",
    checks: {
      bestPractice: { score: 72, status: "warn", summary: "Good hashtags but opening line is a cliché." },
      brandTone: { score: 65, status: "warn", summary: "Playful but 'heroes' trope feels off-brand." },
      audience: { score: 67, status: "warn", summary: "Mixed focus group — urban creative liked it, family persona didn't." },
    },
  },
  {
    id: "rev-008",
    date: "2026-07-02T08:45:00",
    platform: "tiktok",
    captionPreview: "First time driving electric? The ë-C3 makes the switch feel easy.",
    caption: "First time driving electric? The ë-C3 makes the switch feel easy.",
    score: 83,
    status: "pass",
    reviewer: "Tom C.",
    checks: {
      bestPractice: { score: 86, status: "pass", summary: "Question hook works well for TikTok." },
      brandTone: { score: 81, status: "pass", summary: "Reassuring, human tone for EV-curious audience." },
      audience: { score: 82, status: "pass", summary: "High receptiveness with first-time EV persona." },
    },
  },
  {
    id: "rev-009",
    date: "2026-07-01T12:00:00",
    platform: "linkedin",
    captionPreview: "Electric doesn't have to mean compromise. The ë-C3 proves...",
    caption:
      "Electric doesn't have to mean compromise. The ë-C3 proves you can have style, space, and sustainability in one package. What's holding you back from going electric?",
    score: 76,
    status: "pass",
    reviewer: "Elisah M.",
    checks: {
      bestPractice: { score: 78, status: "pass", summary: "Professional opening with engagement question." },
      brandTone: { score: 75, status: "pass", summary: "Appropriate LinkedIn register, still on-brand." },
      audience: { score: 75, status: "pass", summary: "Good fit for EV-curious professional audience." },
    },
  },
  {
    id: "rev-010",
    date: "2026-06-30T17:30:00",
    platform: "instagram",
    captionPreview: "Summer plans loading... All you need is a full charge and...",
    caption:
      "Summer plans loading... All you need is a full charge and an open road. The ë-C3 is ready. ☀️ #EverydayOutsiders",
    score: 71,
    status: "warn",
    reviewer: "Ling N.",
    checks: {
      bestPractice: { score: 68, status: "warn", summary: "No image — carousel recommended for Instagram." },
      brandTone: { score: 78, status: "pass", summary: "Seasonal, optimistic tone on-brand." },
      audience: { score: 67, status: "warn", summary: "Moderate — feels seasonal but lacks specificity." },
    },
  },
];

export const DASHBOARD_STATS = {
  reviewsThisWeek: 12,
  avgScore: 78,
  pendingSignOff: 2,
  client: "Citroën",
};

export function formatReviewDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatReviewDateShort(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    instagram: "Instagram",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
    facebook: "Facebook",
    x: "X",
  };
  return labels[platform] ?? platform;
}
