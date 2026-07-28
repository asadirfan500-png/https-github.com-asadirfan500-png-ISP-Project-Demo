export type Platform = "instagram" | "tiktok" | "linkedin" | "facebook" | "x";

export type CheckStatus = "pass" | "warn" | "fail";

export type EvaluationStep =
  | "best_practice"
  | "brand_tone"
  | "audience"
  | "caption";

export type Receptiveness = "high" | "medium" | "low";

export interface Finding {
  type: "strength" | "issue" | "info";
  message: string;
}

export interface CheckResult {
  score: number;
  status: CheckStatus;
  findings: Finding[];
  suggestions: string[];
}

export interface PersonaQuote {
  persona: string;
  quote: string;
  sentiment: "positive" | "neutral" | "negative";
}

export interface AudienceResult extends CheckResult {
  receptiveness: Receptiveness;
  personaQuotes: PersonaQuote[];
}

export interface EvaluationInput {
  platform: Platform;
  caption: string;
  hasImage: boolean;
}

export interface StepEvaluationResult {
  step: EvaluationStep;
  data: CheckResult | AudienceResult;
}

export interface FullEvaluationResult {
  bestPractice: CheckResult;
  brandTone: CheckResult;
  audience: AudienceResult;
  caption: CheckResult;
  aggregateScore: number;
  overallStatus: CheckStatus;
  topActions: string[];
}

export type MediaKind = "image" | "video";

export interface CreativeFormData {
  platform: Platform | "";
  caption: string;
  /** Still image or reel/video file for pre-publish review. */
  mediaFile: File | null;
  mediaPreviewUrl: string | null;
  mediaKind: MediaKind | null;
}

export type PipelineStepState = "idle" | "running" | "complete";

export type PipelineState = Record<EvaluationStep, PipelineStepState>;

export interface SamplePost {
  id: "good";
  label: string;
  platform: Platform;
  caption: string;
}

export interface ReviewHistoryItem {
  id: string;
  date: string;
  platform: Platform;
  captionPreview: string;
  caption: string;
  score: number;
  status: CheckStatus;
  reviewer: string;
  /** Set when user marks ready for client */
  signedOff?: boolean;
  checks: {
    bestPractice: { score: number; status: CheckStatus; summary: string };
    brandTone: { score: number; status: CheckStatus; summary: string };
    audience: { score: number; status: CheckStatus; summary: string };
    caption: { score: number; status: CheckStatus; summary: string };
  };
}
