"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/layout/sidebar-context";
import { cn } from "@/lib/utils";
import { ChevronRight, PanelLeft } from "lucide-react";

interface TopBarProps {
  breadcrumbs: { label: string; href?: string }[];
  subtitle?: string;
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const menuItems = [
    { label: "Profile", action: () => toast.message("Profile", { description: "Not available in this demo." }) },
    { label: "Settings", action: () => toast.message("Settings", { description: "Not available in this demo." }) },
    { label: "Sign out", action: () => toast.message("Sign out", { description: "Not available in this demo." }), separator: true },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="size-7">
          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
            EM
          </AvatarFallback>
        </Avatar>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-none">Elisah M.</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Head of Social</p>
        </div>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+4px)] z-50 w-48 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            33Seconds
          </p>
          <div className="my-1 h-px bg-border" />
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.separator && <div className="my-1 h-px bg-border" />}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  item.action();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full rounded-md px-2 py-1.5 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                )}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TopBar({ breadcrumbs, subtitle }: TopBarProps) {
  const { toggleMobile } = useSidebar();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/70 px-4 backdrop-blur-md sm:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground lg:hidden"
        aria-label="Open navigation menu"
        onClick={toggleMobile}
      >
        <PanelLeft className="size-4" />
      </Button>

      <div className="min-w-0 flex-1 overflow-hidden">
        <nav className="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5 shrink-0" />}
              <span
                className={cn(
                  "truncate",
                  i === breadcrumbs.length - 1
                    ? "font-medium text-foreground"
                    : undefined,
                )}
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
        {subtitle && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <UserMenu />
    </header>
  );
}
