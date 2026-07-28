"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { CreativeInputForm } from "@/components/stm/creative-input-form";
import { EvaluationPipeline } from "@/components/stm/evaluation-pipeline";
import Stepper, { Step } from "@/components/react-bits/Stepper";
import { STEP_LABELS } from "@/lib/evaluation/simulator";
import { runRemoteEvaluation } from "@/lib/evaluation/run-remote-evaluation";
import { addReviewFromEvaluation, markReviewSignedOff } from "@/lib/reviews-store";
import { Badge } from "@/components/ui/badge";
import type {
  AudienceResult,
  CheckResult,
  CreativeFormData,
  EvaluationStep,
  FullEvaluationResult,
  PipelineState,
  Platform,
} from "@/lib/types";

const INITIAL_FORM: CreativeFormData = {
  platform: "",
  caption: "",
  mediaFile: null,
  mediaPreviewUrl: null,
  mediaKind: null,
};

const INITIAL_PIPELINE: PipelineState = {
  best_practice: "idle",
  brand_tone: "idle",
  audience: "idle",
  caption: "idle",
};

function stepToResultKey(step: EvaluationStep) {
  if (step === "best_practice") return "bestPractice" as const;
  if (step === "brand_tone") return "brandTone" as const;
  if (step === "audience") return "audience" as const;
  return "caption" as const;
}

export default function ReviewPage() {
  const [formData, setFormData] = useState<CreativeFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<{ platform?: string; caption?: string }>({});
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [pipelineState, setPipelineState] = useState<PipelineState>(INITIAL_PIPELINE);
  const [results, setResults] = useState<Partial<{
    bestPractice: CheckResult;
    brandTone: CheckResult;
    audience: AudienceResult;
    caption: CheckResult;
  }>>({});
  const [fullResult, setFullResult] = useState<FullEvaluationResult | null>(null);
  const [savedReviewId, setSavedReviewId] = useState<string | null>(null);

  const validate = useCallback(() => {
    const nextErrors: { platform?: string; caption?: string } = {};
    if (!formData.platform) nextErrors.platform = "Select a platform.";
    if (!formData.caption.trim()) nextErrors.caption = "Add your caption copy.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [formData.platform, formData.caption]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setHasStarted(true);
    setIsRunning(true);
    setFullResult(null);
    setSavedReviewId(null);
    setResults({});
    setPipelineState({
      best_practice: "running",
      brand_tone: "idle",
      audience: "idle",
      caption: "idle",
    });

    const input = {
      platform: formData.platform as Platform,
      caption: formData.caption,
      mediaFile: formData.mediaFile,
      mediaKind: formData.mediaKind,
    };

    if (formData.mediaKind === "video") {
      toast.message("Sampling reel frames for review…");
    }

    try {
      const { result, source } = await runRemoteEvaluation(
        input,
        ({ step, data }) => {
          const key = stepToResultKey(step);
          setResults((prev) => ({ ...prev, [key]: data }));
          setPipelineState((prev) => ({
            ...prev,
            [step]: "complete",
            ...(step === "best_practice" ? { brand_tone: "running" } : {}),
            ...(step === "brand_tone" ? { audience: "running" } : {}),
            ...(step === "audience" ? { caption: "running" } : {}),
          }));
        },
      );
      setFullResult(result);
      setPipelineState({
        best_practice: "complete",
        brand_tone: "complete",
        audience: "complete",
        caption: "complete",
      });
      const saved = addReviewFromEvaluation({
        platform: formData.platform as Platform,
        caption: formData.caption,
        result,
      });
      setSavedReviewId(saved.id);
      const mediaBit =
        formData.mediaKind === "video"
          ? " and reel frames"
          : formData.mediaKind === "image"
            ? " and image"
            : "";
      toast.success(
        source === "claude"
          ? `Claude reviewed caption${mediaBit}. Saved to history.`
          : "Reviewed with rule-based checks. Saved to history.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Review failed";
      toast.error(message);
      setHasStarted(false);
      setPipelineState(INITIAL_PIPELINE);
      setResults({});
    } finally {
      setIsRunning(false);
    }
  }, [formData, validate]);

  const handleReset = useCallback(() => {
    if (formData.mediaPreviewUrl) {
      URL.revokeObjectURL(formData.mediaPreviewUrl);
    }
    setFormData(INITIAL_FORM);
    setErrors({});
    setHasStarted(false);
    setIsRunning(false);
    setPipelineState(INITIAL_PIPELINE);
    setResults({});
    setFullResult(null);
    setSavedReviewId(null);
  }, [formData.mediaPreviewUrl]);

  const handleRevise = useCallback(() => {
    setHasStarted(false);
    setPipelineState(INITIAL_PIPELINE);
    setResults({});
    setFullResult(null);
    setSavedReviewId(null);
  }, []);

  const handleApprove = useCallback(() => {
    if (savedReviewId) {
      markReviewSignedOff(savedReviewId);
    }
    toast.success("Marked ready for client", {
      description: "Sign-off recorded. Creative can proceed to client review.",
    });
  }, [savedReviewId]);

  const statusLabel = !hasStarted
    ? "Draft"
    : isRunning
      ? "In review"
      : fullResult
        ? "Complete"
        : "Draft";

  return (
    <>
      <PageHeader
        title="Creative review"
        description="Add copy and an optional image or reel. Claude reviews both against the Citroën brief."
        actions={
          <Badge variant="outline" className="font-normal">
            {statusLabel}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-8">
        <div className="space-y-4 lg:sticky lg:top-0 lg:self-start">
          <CreativeInputForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onReset={handleReset}
            isRunning={isRunning}
            errors={errors}
          />
          {!hasStarted && (
            <>
              <details className="rounded-lg border border-border bg-card/60 backdrop-blur-sm md:hidden">
                <summary className="cursor-pointer px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  How review works
                </summary>
                <div className="border-t border-border p-4">
                  <Stepper
                    initialStep={1}
                    disableStepIndicators
                    stepCircleContainerClassName="!shadow-none bg-transparent border-0 !max-w-none"
                    stepContainerClassName="!p-4"
                    contentClassName="!px-4 !pb-2 text-sm text-muted-foreground"
                    footerClassName="!hidden"
                    className="!min-h-0 !p-0 !items-stretch !justify-start !aspect-auto"
                    nextButtonProps={{ style: { display: "none" } }}
                    backButtonProps={{ style: { display: "none" } }}
                  >
                    <Step>{STEP_LABELS.best_practice}</Step>
                    <Step>{STEP_LABELS.brand_tone}</Step>
                    <Step>{STEP_LABELS.audience}</Step>
                    <Step>{STEP_LABELS.caption}</Step>
                  </Stepper>
                </div>
              </details>
              <div className="hidden rounded-lg border border-border bg-card/60 p-4 backdrop-blur-sm md:block">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  How review works
                </p>
                <Stepper
                  initialStep={1}
                  disableStepIndicators
                  stepCircleContainerClassName="!shadow-none bg-transparent border-0 !max-w-none"
                  stepContainerClassName="!p-4"
                  contentClassName="!px-4 !pb-2 text-sm text-muted-foreground"
                  footerClassName="!hidden"
                  className="!min-h-0 !p-0 !items-stretch !justify-start !aspect-auto"
                  nextButtonProps={{ style: { display: "none" } }}
                  backButtonProps={{ style: { display: "none" } }}
                >
                  <Step>{STEP_LABELS.best_practice}</Step>
                  <Step>{STEP_LABELS.brand_tone}</Step>
                  <Step>{STEP_LABELS.audience}</Step>
                  <Step>{STEP_LABELS.caption}</Step>
                </Stepper>
              </div>
            </>
          )}
        </div>
        <EvaluationPipeline
          pipelineState={pipelineState}
          results={results}
          fullResult={fullResult}
          isRunning={isRunning}
          hasStarted={hasStarted}
          onApprove={handleApprove}
          onRevise={handleRevise}
        />
      </div>
    </>
  );
}
