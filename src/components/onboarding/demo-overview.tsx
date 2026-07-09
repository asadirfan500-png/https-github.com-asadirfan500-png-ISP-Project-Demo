"use client";

import Link from "next/link";
import StarBorder from "@/components/react-bits/StarBorder";
import { PageHeader } from "@/components/layout/page-header";
import {
  DEMO_IS_ISNT,
  DUMMY_DATA_BANNER,
  GLOSSARY,
  PAGE_GUIDES,
  WHAT_IS_THIS,
  WHY_EXISTS,
  WORKFLOW_STEPS,
} from "@/components/onboarding/demo-guide-content";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  History,
  LayoutDashboard,
  Sparkles,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STEP_ICONS: Record<number, LucideIcon> = {
  1: Sparkles,
  2: LayoutDashboard,
  3: ClipboardList,
  4: CheckCircle2,
  5: UserCheck,
  6: History,
};

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export function DemoOverview() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="How this demo works"
        description="Read this before exploring — written for the whole team"
        actions={
          <StarBorder as={Link} href="/dashboard" color="#EB4D4B" speed="5s" className="rounded-lg">
            <span className="flex items-center gap-1.5 px-1 py-0.5 text-sm font-medium">
              <LayoutDashboard className="size-4" />
              Go to Dashboard
            </span>
          </StarBorder>
        }
      />

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-sm">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-400" aria-hidden />
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {DUMMY_DATA_BANNER.title}
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
              {DUMMY_DATA_BANNER.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <SectionCard title={WHAT_IS_THIS.title}>
        {WHAT_IS_THIS.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </SectionCard>

      <SectionCard title={WHY_EXISTS.title}>
        {WHY_EXISTS.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </SectionCard>

      <SectionCard title="Words you will see on screen">
        <dl className="space-y-3">
          {GLOSSARY.map(({ term, meaning }) => (
            <div key={term}>
              <dt className="font-medium text-foreground">{term}</dt>
              <dd className="mt-0.5">{meaning}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      <section>
        <h2 className="mb-4 text-sm font-semibold">How the demo works — step by step</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {WORKFLOW_STEPS.map(({ step, title, description }) => {
            const Icon = STEP_ICONS[step] ?? Sparkles;
            return (
              <div
                key={step}
                className="rounded-lg border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-sm font-semibold text-primary">
                    {step}
                  </div>
                  <Icon className="size-4 text-muted-foreground" aria-hidden />
                </div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold">Every page explained</h2>
        <div className="space-y-4">
          {PAGE_GUIDES.map((page) => (
            <div
              key={page.id}
              className="rounded-lg border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-3 flex flex-wrap items-baseline gap-2">
                <h3 className="text-sm font-semibold">{page.menuLabel}</h3>
                {page.route && (
                  <span className="text-xs text-muted-foreground">({page.route})</span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{page.whatItIs}</p>
              <div className="mt-4 space-y-4">
                {page.sections.map((section) => (
                  <div key={section.heading}>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                      {section.heading}
                    </h4>
                    <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">What&apos;s fake: </span>
                {page.whatsFake}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-lg border border-dashed border-border bg-card/40 p-5 backdrop-blur-sm">
        <h2 className="text-sm font-semibold">{DEMO_IS_ISNT.title}</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">It is</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
              {DEMO_IS_ISNT.isItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
              It isn&apos;t
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
              {DEMO_IS_ISNT.isntItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 border-t border-border pt-4 text-sm font-medium text-foreground">
          {DEMO_IS_ISNT.reminder}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pb-1">
        <StarBorder as={Link} href="/dashboard" color="#EB4D4B" speed="5s" className="rounded-lg">
          <span className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium">
            <LayoutDashboard className="size-4" />
            Go to Dashboard
          </span>
        </StarBorder>
        <Link
          href="/review"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
        >
          <ClipboardList className="size-4" />
          Try a review
        </Link>
        <Link
          href="/client"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
        >
          <BookOpen className="size-4" />
          View Citroën brief
        </Link>
      </div>
    </div>
  );
}
