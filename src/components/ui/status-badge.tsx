import type { CheckStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  CheckStatus,
  { label: string; className: string }
> = {
  pass: {
    label: "Passed",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  warn: {
    label: "Needs review",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  fail: {
    label: "Not ready",
    className:
      "border-red-500/30 bg-red-500/10 text-red-300",
  },
};

interface StatusBadgeProps {
  status: CheckStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_STYLES[status];
  return (
    <Badge variant="outline" className={cn("font-medium", config.className, className)}>
      {config.label}
    </Badge>
  );
}

export function getStatusLabel(status: CheckStatus): string {
  return STATUS_STYLES[status].label;
}
