"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CITROEN_CLIENT } from "@/lib/data/citroen";
import ShinyText from "@/components/react-bits/ShinyText";
import GlareHover from "@/components/react-bits/GlareHover";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useSidebar } from "@/components/layout/sidebar-context";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ClipboardList,
  History,
  Home,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const WORKSPACE_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/review", label: "Review", icon: ClipboardList },
  { href: "/history", label: "History", icon: History },
];

const CLIENT_LINKS = [
  { href: "/client", label: "Client brief", icon: BookOpen },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  useGlare,
  collapsed,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  useGlare: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const linkContent = (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center rounded-md text-sm font-medium transition-colors",
        collapsed ? "justify-center px-2 py-2.5" : "gap-2.5 px-2.5 py-2",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
    >
      <Icon className="size-4 shrink-0 opacity-70" />
      {!collapsed && label}
    </Link>
  );

  const wrappedLink =
    useGlare && !collapsed ? (
      <GlareHover
        width="100%"
        height="auto"
        background="transparent"
        borderRadius="0.375rem"
        borderColor="transparent"
        glareColor="#EB4D4B"
        glareOpacity={0.25}
        className="block w-full border-0"
        style={{ minHeight: "2.25rem" }}
      >
        {linkContent}
      </GlareHover>
    ) : (
      linkContent
    );

  if (!collapsed) {
    return wrappedLink;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={<span className="block w-full" />}>
        {wrappedLink}
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}


export function SidebarNav() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const { collapsed, toggle, mobileOpen, closeMobile } = useSidebar();

  const showCollapsed = isDesktop && collapsed;

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMobile();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, closeMobile]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider delay={200}>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar backdrop-blur-xl transition-[transform,width] duration-200 ease-in-out",
          "fixed inset-y-0 left-0 z-50 w-60 lg:relative lg:z-auto lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          showCollapsed ? "lg:w-16" : "lg:w-60",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 border-b border-sidebar-border px-5 py-5",
            showCollapsed && "lg:flex-col lg:items-center lg:gap-2 lg:px-2 lg:py-4",
          )}
        >
          <div
            className={cn(
              "relative shrink-0 overflow-hidden rounded-md bg-black",
              showCollapsed ? "size-9" : "h-9 w-[4.75rem]",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/33seconds-logo.png"
              alt="33Seconds"
              className="size-full object-contain object-center p-0.5"
            />
          </div>
          {!showCollapsed && (
            <div className="min-w-0 flex-1">
              {reducedMotion ? (
                <p className="truncate text-sm font-semibold text-sidebar-foreground">
                  Review Desk
                </p>
              ) : (
                <ShinyText
                  text="Review Desk"
                  speed={3}
                  className="truncate text-sm font-semibold"
                  color="oklch(0.75 0.01 264)"
                  shineColor="oklch(0.96 0.005 264)"
                />
              )}
              <p className="truncate text-xs text-muted-foreground">
                Synthetic Team Member
              </p>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            aria-label={showCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden shrink-0 text-muted-foreground hover:text-sidebar-foreground lg:inline-flex",
              !showCollapsed && "lg:ml-auto",
            )}
          >
            {showCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          <div>
            {!showCollapsed && (
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Workspace
              </p>
            )}
            <ul className="space-y-0.5">
              {WORKSPACE_LINKS.map(({ href, label, icon }) => (
                <li key={href}>
                  <NavLink
                    href={href}
                    label={label}
                    icon={icon}
                    active={isActive(href)}
                    useGlare={!reducedMotion}
                    collapsed={showCollapsed}
                    onNavigate={closeMobile}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div>
            {!showCollapsed && (
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Client
              </p>
            )}
            <ul className="space-y-0.5">
              {CLIENT_LINKS.map(({ href, label, icon }) => (
                <li key={href}>
                  <NavLink
                    href={href}
                    label={label}
                    icon={icon}
                    active={isActive(href)}
                    useGlare={!reducedMotion}
                    collapsed={showCollapsed}
                    onNavigate={closeMobile}
                  />
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="border-t border-sidebar-border p-4">
          {showCollapsed ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="mx-auto flex size-9 cursor-default items-center justify-center rounded-md border border-primary/20 bg-card/60 text-sm font-semibold shadow-[0_0_24px_-8px_oklch(0.62_0.22_25_/_0.45)] backdrop-blur-sm" />
                }
              >
                C
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-48">
                <p className="font-semibold">{CITROEN_CLIENT.name}</p>
                <p className="text-background/70">{CITROEN_CLIENT.audience}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="rounded-md border border-primary/20 bg-card/60 p-3 shadow-[0_0_24px_-8px_oklch(0.62_0.22_25_/_0.45)] backdrop-blur-sm">
              <p className="text-xs font-medium text-muted-foreground">
                Active client
              </p>
              <p className="mt-0.5 text-sm font-semibold">
                {CITROEN_CLIENT.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {CITROEN_CLIENT.audience}
              </p>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
