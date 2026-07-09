import type { CheckStatus, Finding } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { AudienceResult, CheckResult } from "@/lib/types";

const RING_COLORS: Record<CheckStatus, string> = {
  pass: "text-emerald-600",
  warn: "text-amber-600",
  fail: "text-red-600",
};

function ScoreRing({ score, status }: { score: number; status: CheckStatus }) {
  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex size-16 shrink-0 items-center justify-center">
      <svg className="size-16 -rotate-90" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-muted/50"
        />
        <circle
          cx="36"
          cy="36"
          r="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-700", RING_COLORS[status])}
        />
      </svg>
      <span className="absolute text-base font-semibold">{score}</span>
    </div>
  );
}

function FindingRow({ finding }: { finding: Finding }) {
  const config = {
    strength: {
      icon: CheckCircle2,
      label: "Strength",
      className: "text-emerald-700",
    },
    issue: {
      icon: AlertCircle,
      label: "Issue",
      className: "text-amber-700",
    },
    info: {
      icon: Info,
      label: "Note",
      className: "text-muted-foreground",
    },
  }[finding.type];

  const Icon = config.icon;

  return (
    <div className="flex gap-3 border-b border-border/60 py-2.5 last:border-0">
      <Icon className={cn("mt-0.5 size-4 shrink-0", config.className)} />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {config.label}
        </p>
        <p className="mt-0.5 text-sm">{finding.message}</p>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(/[\s—-]+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface CheckResultCardProps {
  title: string;
  description: string;
  result: CheckResult | AudienceResult;
  className?: string;
}

export function CheckResultCard({
  title,
  description,
  result,
  className,
}: CheckResultCardProps) {
  const audienceResult = "personaQuotes" in result ? result : null;

  return (
    <SpotlightCard
      className={cn(
        "animate-in fade-in slide-in-from-bottom-1 rounded-lg border-border bg-card/90 p-0 duration-300",
        className
      )}
      spotlightColor="rgba(235, 77, 75, 0.2)"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <StatusBadge status={result.status} />
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-center gap-4">
          <ScoreRing score={result.score} status={result.status} />
          <div className="text-sm">
            <p className="font-medium">{result.score} out of 100</p>
            {audienceResult && (
              <p className="text-muted-foreground capitalize">
                Receptiveness: {audienceResult.receptiveness}
              </p>
            )}
          </div>
        </div>

        {result.findings.length > 0 && (
          <div className="mb-4 rounded-md border border-border/60 bg-muted/20 px-3">
            {result.findings.map((finding, i) => (
              <FindingRow key={i} finding={finding} />
            ))}
          </div>
        )}

        {result.suggestions.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Recommended edits
            </p>
            <ul className="space-y-1.5">
              {result.suggestions.map((suggestion, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="font-medium text-muted-foreground">{i + 1}.</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {audienceResult && audienceResult.personaQuotes.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Focus group read
            </p>
            <div className="space-y-3">
              {audienceResult.personaQuotes.map((pq, i) => (
                <div key={i} className="flex gap-2.5">
                  <Avatar className="size-7 shrink-0">
                    <AvatarFallback className="bg-muted text-[10px] font-medium">
                      {getInitials(pq.persona)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {pq.persona}
                    </p>
                    <p className="mt-0.5 rounded-md bg-muted/40 px-3 py-2 text-sm">
                      {pq.quote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
