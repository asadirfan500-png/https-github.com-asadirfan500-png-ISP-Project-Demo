import type { CheckStatus, FullEvaluationResult } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import AnimatedContent from "@/components/react-bits/AnimatedContent";
import { CheckCircle2, RotateCcw } from "lucide-react";

const OVERALL_MESSAGES: Record<CheckStatus, string> = {
  pass: "This creative is ready for your sign-off.",
  warn: "A few items to address before sending to the client.",
  fail: "Significant issues — revise before client delivery.",
};

interface FinalReportProps {
  result: FullEvaluationResult;
  onApprove: () => void;
  onRevise: () => void;
}

export function FinalReport({ result, onApprove, onRevise }: FinalReportProps) {
  return (
    <AnimatedContent distance={32} duration={0.6}>
      <div className="animate-in fade-in slide-in-from-bottom-1 rounded-lg border border-border bg-card/90 shadow-sm backdrop-blur-sm duration-300">
        <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">Sign-off summary</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {OVERALL_MESSAGES[result.overallStatus]}
            </p>
          </div>
          <StatusBadge status={result.overallStatus} />
        </div>

        <div className="p-4">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-3xl font-semibold tracking-tight">
                {result.aggregateScore}
              </p>
              <p className="text-xs text-muted-foreground">Overall score</p>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Best practice", score: result.bestPractice.score },
                { label: "Brand tone", score: result.brandTone.score },
                { label: "Audience", score: result.audience.score },
              ].map(({ label, score }) => (
                <div
                  key={label}
                  className="rounded-md border border-border/60 bg-muted/20 px-3 py-2 text-center"
                >
                  <p className="text-lg font-semibold">{score}</p>
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Priority actions
            </p>
            <ol className="space-y-1.5">
              {result.topActions.map((action, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="font-medium text-muted-foreground">{i + 1}.</span>
                  {action}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <Button onClick={onApprove}>
              <CheckCircle2 className="size-4" />
              Mark ready for client
            </Button>
            <Button variant="outline" onClick={onRevise}>
              <RotateCcw className="size-4" />
              Revise and re-run
            </Button>
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
}
