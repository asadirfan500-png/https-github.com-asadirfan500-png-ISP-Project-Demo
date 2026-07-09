"use client";

import AnimatedContent from "@/components/react-bits/AnimatedContent";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <AnimatedContent distance={24} duration={0.5} className={cn("w-full", className)}>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/40 px-6 py-12 text-center backdrop-blur-sm">
        {Icon && (
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted/60">
            <Icon className="size-6 text-muted-foreground" />
          </div>
        )}
        <h3 className="text-base font-medium">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </AnimatedContent>
  );
}
