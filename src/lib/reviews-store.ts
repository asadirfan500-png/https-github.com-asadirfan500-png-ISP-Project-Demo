import type {
  CheckResult,
  FullEvaluationResult,
  Platform,
  ReviewHistoryItem,
} from "@/lib/types";

export const REVIEWS_STORAGE_KEY = "review-desk-reviews-v1";

function findingSummary(check: CheckResult): string {
  const issue = check.findings.find((f) => f.type === "issue");
  if (issue) return issue.message;
  const strength = check.findings.find((f) => f.type === "strength");
  if (strength) return strength.message;
  if (check.suggestions[0]) return check.suggestions[0];
  return `Score ${check.score}/100`;
}

export function loadReviews(): ReviewHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as ReviewHistoryItem[];
  } catch {
    return [];
  }
}

export function saveReviews(reviews: ReviewHistoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new Event("review-desk-reviews-changed"));
  } catch {
    // ignore quota / private mode
  }
}

export function addReviewFromEvaluation(input: {
  platform: Platform;
  caption: string;
  result: FullEvaluationResult;
  reviewer?: string;
}): ReviewHistoryItem {
  const caption = input.caption.trim();
  const item: ReviewHistoryItem = {
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    platform: input.platform,
    captionPreview:
      caption.length > 72 ? `${caption.slice(0, 72)}...` : caption,
    caption,
    score: input.result.aggregateScore,
    status: input.result.overallStatus,
    reviewer: input.reviewer ?? "Elisah M.",
    checks: {
      bestPractice: {
        score: input.result.bestPractice.score,
        status: input.result.bestPractice.status,
        summary: findingSummary(input.result.bestPractice),
      },
      brandTone: {
        score: input.result.brandTone.score,
        status: input.result.brandTone.status,
        summary: findingSummary(input.result.brandTone),
      },
      audience: {
        score: input.result.audience.score,
        status: input.result.audience.status,
        summary: findingSummary(input.result.audience),
      },
      caption: {
        score: input.result.caption.score,
        status: input.result.caption.status,
        summary: findingSummary(input.result.caption),
      },
    },
  };

  const next = [item, ...loadReviews()];
  saveReviews(next);
  return item;
}

export function markReviewSignedOff(id: string): void {
  const next = loadReviews().map((r) =>
    r.id === id ? { ...r, signedOff: true } : r,
  );
  saveReviews(next);
}

export function computeDashboardStats(reviews: ReviewHistoryItem[]) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const thisWeek = reviews.filter((r) => new Date(r.date) >= weekAgo);
  const pending = reviews.filter((r) => !r.signedOff);

  const avgScore =
    reviews.length === 0
      ? 0
      : Math.round(
          reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length,
        );

  return {
    reviewsThisWeek: thisWeek.length,
    avgScore,
    pendingSignOff: pending.length,
    total: reviews.length,
  };
}

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
