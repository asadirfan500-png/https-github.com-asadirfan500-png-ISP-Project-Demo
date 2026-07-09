"use client";

import BlurText from "@/components/react-bits/BlurText";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  animateTitle?: boolean;
}

export function PageHeader({
  title,
  description,
  actions,
  animateTitle = true,
}: PageHeaderProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {animateTitle && !reducedMotion ? (
          <BlurText
            text={title}
            className="text-xl font-semibold tracking-tight text-foreground"
            delay={40}
            direction="bottom"
          />
        ) : (
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        )}
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
