"use client";

import { usePathname } from "next/navigation";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { TopBar } from "@/components/layout/top-bar";
import { Ps5AtmosphereBackground } from "@/components/react-bits/ps5-atmosphere-background";

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs: { label: string; href?: string }[];
  subtitle?: string;
}

export function AppShell({ children, breadcrumbs, subtitle }: AppShellProps) {
  const pathname = usePathname();
  const isClientSelect = pathname === "/";

  if (isClientSelect) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-background">
        <Ps5AtmosphereBackground />
        <div className="relative z-10 h-full overflow-hidden">{children}</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="relative flex h-screen overflow-hidden bg-background">
        <Ps5AtmosphereBackground />
        <div className="relative z-10 flex min-h-0 w-full">
          <SidebarNav />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <TopBar breadcrumbs={breadcrumbs} subtitle={subtitle} />
            <main id="app-main-scroll" className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-6xl px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
