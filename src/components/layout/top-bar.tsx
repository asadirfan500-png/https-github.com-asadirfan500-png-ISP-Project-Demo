"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/layout/sidebar-context";
import {
  initialsFromName,
  loadUserProfile,
  saveUserProfile,
  USER_PROFILE_CHANGED_EVENT,
  type UserProfile,
} from "@/lib/user-store";
import { cn } from "@/lib/utils";
import { ChevronRight, PanelLeft, UserRound, X } from "lucide-react";

interface TopBarProps {
  breadcrumbs: { label: string; href?: string }[];
  subtitle?: string;
}

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function UserMenu() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    jobTitle: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [jobTitleDraft, setJobTitleDraft] = useState("");
  const [photoDraft, setPhotoDraft] = useState<string | undefined>();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  useEffect(() => {
    function refresh() {
      const saved = loadUserProfile();
      setProfile(saved);
    }
    refresh();
    window.addEventListener(USER_PROFILE_CHANGED_EVENT, refresh);
    window.addEventListener("review-desk-user-name-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(USER_PROFILE_CHANGED_EVENT, refresh);
      window.removeEventListener("review-desk-user-name-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function openEdit() {
    setNameDraft(profile.name);
    setJobTitleDraft(profile.jobTitle);
    setPhotoDraft(profile.imageUrl);
    setEditOpen(true);
  }

  async function handlePhoto(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setPhotoDraft(await readImageAsDataUrl(file));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const name = nameDraft.trim();
    const jobTitle = jobTitleDraft.trim();
    if (!name || !jobTitle) return;
    const next: UserProfile = {
      name,
      jobTitle,
      imageUrl: photoDraft,
    };
    saveUserProfile(next);
    setProfile(next);
    setEditOpen(false);
  }

  const displayName = profile.name.trim() || "Guest";
  const displayTitle = profile.jobTitle.trim() || "—";

  return (
    <>
      <button
        type="button"
        onClick={openEdit}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Edit profile"
      >
        <Avatar className="size-8">
          {profile.imageUrl ? (
            <AvatarImage src={profile.imageUrl} alt="" className="object-cover" />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
            {initialsFromName(displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden min-w-0 text-left sm:block">
          <p className="truncate text-sm font-medium leading-none">
            {displayName}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {displayTitle}
          </p>
        </div>
      </button>

      {editOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-black/70"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${uid}-edit-title`}
          onClick={() => setEditOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-border bg-popover p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id={`${uid}-edit-title`}
                className="text-base font-semibold text-foreground"
              >
                Edit profile
              </h2>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your name, job title, or photo.
            </p>
            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="group relative"
                  aria-label="Change profile photo"
                >
                  {photoDraft ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoDraft}
                      alt=""
                      className="size-20 rounded-full object-cover ring-2 ring-border"
                    />
                  ) : (
                    <span className="flex size-20 items-center justify-center rounded-full border border-dashed border-foreground/25 bg-foreground/5 text-muted-foreground transition-colors group-hover:border-foreground/40 group-hover:text-foreground">
                      <UserRound className="size-7" />
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {photoDraft ? "Change photo" : "Upload photo"}
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    void handlePhoto(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Name
                </label>
                <Input
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="Your name"
                  className="border-border bg-foreground/5"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Job title
                </label>
                <Input
                  value={jobTitleDraft}
                  onChange={(e) => setJobTitleDraft(e.target.value)}
                  placeholder="Job title"
                  className="border-border bg-foreground/5"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!nameDraft.trim() || !jobTitleDraft.trim()}
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function TopBar({ breadcrumbs, subtitle }: TopBarProps) {
  const { toggleMobile } = useSidebar();

  return (
    <header className="relative z-[100] flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/50 px-4 backdrop-blur-xl sm:px-6">
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
