"use client";

import {
  STEP_DESCRIPTIONS,
  STEP_LABELS,
} from "@/lib/evaluation/simulator";
import type {
  AudienceResult,
  CheckResult,
  FullEvaluationResult,
  PipelineState,
} from "@/lib/types";
import { CheckResultCard } from "@/components/stm/check-result-card";
import { FinalReport } from "@/components/stm/final-report";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { PipelineStepIndicators } from "@/components/react-bits/pipeline-step-indicators";
import { ClipboardList } from "lucide-react";

interface EvaluationPipelineProps {
  pipelineState: PipelineState;
  results: Partial<{
    bestPractice: CheckResult;
    brandTone: CheckResult;
    audience: AudienceResult;
    caption: CheckResult;
  }>;
  fullResult: FullEvaluationResult | null;
  isRunning: boolean;
  hasStarted: boolean;
  onApprove: () => void;
  onRevise: () => void;
}

function StepSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card/80 p-4 backdrop-blur-sm">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex gap-4 pt-2">
        <Skeleton className="size-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </div>
  );
}

const STEP_ORDER = [
  "best_practice",
  "brand_tone",
  "audience",
  "caption",
] as const;

export function EvaluationPipeline({
  pipelineState,
  results,
  fullResult,
  isRunning,
  hasStarted,
  onApprove,
  onRevise,
}: EvaluationPipelineProps) {
  if (!hasStarted) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No review in progress"
        description="Add your creative above to start a review."
        className="min-h-[280px] sm:min-h-[420px]"
      />
    );
  }

  const completedCount = STEP_ORDER.filter(
    (step) => pipelineState[step] === "complete",
  ).length;

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Review progress</h3>
          <span className="text-xs text-muted-foreground">
            {completedCount}/4 complete
          </span>
        </div>
        <PipelineStepIndicators pipelineState={pipelineState} />
      </div>

      <div className="space-y-4">
        {pipelineState.best_practice === "running" && <StepSkeleton />}
        {results.bestPractice && (
          <CheckResultCard
            title={STEP_LABELS.best_practice}
            description={STEP_DESCRIPTIONS.best_practice}
            result={results.bestPractice}
          />
        )}

        {pipelineState.brand_tone === "running" && <StepSkeleton />}
        {results.brandTone && (
          <CheckResultCard
            title={STEP_LABELS.brand_tone}
            description={STEP_DESCRIPTIONS.brand_tone}
            result={results.brandTone}
          />
        )}

        {pipelineState.audience === "running" && <StepSkeleton />}
        {results.audience && (
          <CheckResultCard
            title={STEP_LABELS.audience}
            description={STEP_DESCRIPTIONS.audience}
            result={results.audience}
          />
        )}

        {pipelineState.caption === "running" && <StepSkeleton />}
        {results.caption && (
          <CheckResultCard
            title={STEP_LABELS.caption}
            description={STEP_DESCRIPTIONS.caption}
            result={results.caption}
          />
        )}
      </div>

      {fullResult && !isRunning && (
        <FinalReport
          result={fullResult}
          onApprove={onApprove}
          onRevise={onRevise}
        />
      )}
    </div>
  );
}
