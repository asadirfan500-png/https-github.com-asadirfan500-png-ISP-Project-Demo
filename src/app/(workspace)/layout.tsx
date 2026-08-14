"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

const PAGE_META: Record<
  string,
  { breadcrumbs: { label: string }[]; subtitle?: string }
> = {
  "/": {
    breadcrumbs: [{ label: "Workspace" }, { label: "Home" }],
    subtitle: "Welcome back to Review Desk",
  },
  "/dashboard": {
    breadcrumbs: [{ label: "Workspace" }, { label: "Dashboard" }],
    subtitle: "Overview of recent creative reviews",
  },
  "/review": {
    breadcrumbs: [{ label: "Workspace" }, { label: "Review" }],
    subtitle: "Submit creative for pre-client sign-off checks",
  },
  "/concept": {
    breadcrumbs: [{ label: "Workspace" }, { label: "Concept Check" }],
    subtitle: "Pressure-test an idea before you produce it",
  },
  "/history": {
    breadcrumbs: [{ label: "Workspace" }, { label: "History" }],
    subtitle: "Past review sessions",
  },
  "/client": {
    breadcrumbs: [{ label: "Client" }, { label: "Client brief" }],
    subtitle: "Brand voice, audience, and platform reference",
  },
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const meta = PAGE_META[pathname] ?? {
    breadcrumbs: [{ label: "Workspace" }],
  };

  return (
    <AppShell breadcrumbs={meta.breadcrumbs} subtitle={meta.subtitle}>
      {children}
    </AppShell>
  );
}
