"use client";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { TopBar } from "@/components/layout/top-bar";
import { DarkVeilBackground } from "@/components/react-bits/dark-veil-background";

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs: { label: string; href?: string }[];
  subtitle?: string;
}

export function AppShell({ children, breadcrumbs, subtitle }: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="relative flex h-screen overflow-hidden bg-background">
        <DarkVeilBackground />
        <div className="relative z-10 flex min-h-0 w-full">
          <SidebarNav />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <TopBar breadcrumbs={breadcrumbs} subtitle={subtitle} />
            <main className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
