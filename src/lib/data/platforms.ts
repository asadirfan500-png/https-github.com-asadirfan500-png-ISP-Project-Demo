import type { Platform } from "@/lib/types";

export interface PlatformConfig {
  id: Platform;
  label: string;
  maxCaptionLength: number;
  idealCaptionLength: number;
  requiresImage: boolean;
  hashtagRecommended: boolean;
  tips: string[];
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: "instagram",
    label: "Instagram",
    maxCaptionLength: 2200,
    idealCaptionLength: 150,
    requiresImage: true,
    hashtagRecommended: true,
    tips: [
      "Lead with a hook in the first line",
      "Use 3–5 relevant hashtags",
      "Pair with a strong visual or carousel",
    ],
  },
  {
    id: "tiktok",
    label: "TikTok",
    maxCaptionLength: 4000,
    idealCaptionLength: 100,
    requiresImage: false,
    hashtagRecommended: true,
    tips: [
      "Keep on-screen text minimal",
      "Caption should complement the video hook",
      "Use trending sounds where appropriate",
    ],
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    maxCaptionLength: 3000,
    idealCaptionLength: 200,
    requiresImage: false,
    hashtagRecommended: false,
    tips: [
      "Open with a professional insight or question",
      "Break long copy into short paragraphs",
      "Avoid excessive emoji use",
    ],
  },
  {
    id: "facebook",
    label: "Facebook",
    maxCaptionLength: 63206,
    idealCaptionLength: 80,
    requiresImage: false,
    hashtagRecommended: false,
    tips: [
      "Keep copy concise and conversational",
      "Ask a question to drive comments",
      "Link posts perform better with a preview image",
    ],
  },
  {
    id: "x",
    label: "X (Twitter)",
    maxCaptionLength: 280,
    idealCaptionLength: 200,
    requiresImage: false,
    hashtagRecommended: false,
    tips: [
      "Stay within 280 characters",
      "One clear message per post",
      "Threads work for longer storytelling",
    ],
  },
];

export function getPlatformConfig(platform: Platform): PlatformConfig {
  return PLATFORMS.find((p) => p.id === platform)!;
}
