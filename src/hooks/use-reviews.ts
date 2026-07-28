"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReviewHistoryItem } from "@/lib/types";
import {
  computeDashboardStats,
  loadReviews,
  markReviewSignedOff,
} from "@/lib/reviews-store";

export function useReviews() {
  const [reviews, setReviews] = useState<ReviewHistoryItem[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setReviews(loadReviews());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("review-desk-reviews-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("review-desk-reviews-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const stats = computeDashboardStats(reviews);

  const signOff = useCallback(
    (id: string) => {
      markReviewSignedOff(id);
      refresh();
    },
    [refresh],
  );

  return { reviews, stats, ready, refresh, signOff };
}
