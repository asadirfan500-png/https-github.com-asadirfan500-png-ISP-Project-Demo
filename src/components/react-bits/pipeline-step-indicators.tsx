"use client";

import { motion } from "motion/react";
import type { EvaluationStep, PipelineState } from "@/lib/types";
import { STEP_DESCRIPTIONS, STEP_LABELS } from "@/lib/evaluation/simulator";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

const STEPS: EvaluationStep[] = [
  "best_practice",
  "brand_tone",
  "audience",
  "caption",
];

function getStepStatus(
  step: EvaluationStep,
  pipelineState: PipelineState
): "inactive" | "active" | "complete" {
  const state = pipelineState[step];
  if (state === "complete") return "complete";
  if (state === "running") return "active";
  return "inactive";
}

interface PipelineStepIndicatorsProps {
  pipelineState: PipelineState;
}

export function PipelineStepIndicators({ pipelineState }: PipelineStepIndicatorsProps) {
  return (
    <div className="space-y-0">
      {STEPS.map((step, index) => {
        const status = getStepStatus(step, pipelineState);
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <motion.div
                animate={status}
                initial={false}
                className="relative flex size-8 shrink-0 items-center justify-center outline-none"
              >
                <motion.div
                  variants={{
                    inactive: {
                      scale: 1,
                      backgroundColor: "oklch(0.22 0.01 264)",
                      color: "oklch(0.55 0.01 264)",
                    },
                    active: {
                      scale: 1,
                      backgroundColor: "oklch(0.62 0.22 25)",
                      color: "oklch(0.99 0 0)",
                    },
                    complete: {
                      scale: 1,
                      backgroundColor: "oklch(0.62 0.22 25)",
                      color: "oklch(0.99 0 0)",
                    },
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex size-8 items-center justify-center rounded-full font-semibold"
                >
                  {status === "complete" ? (
                    <Check className="size-4" />
                  ) : status === "active" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </motion.div>
              </motion.div>
              {!isLast && (
                <motion.div
                  className="my-1 min-h-8 w-0.5 flex-1 rounded bg-border"
                  animate={{
                    backgroundColor:
                      status === "complete"
                        ? "oklch(0.62 0.22 25)"
                        : "oklch(1 0 0 / 12%)",
                  }}
                />
              )}
            </div>
            <div className={cn("pb-5", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-medium leading-none",
                  status === "inactive" && "text-muted-foreground"
                )}
              >
                {STEP_LABELS[step]}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {STEP_DESCRIPTIONS[step]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
