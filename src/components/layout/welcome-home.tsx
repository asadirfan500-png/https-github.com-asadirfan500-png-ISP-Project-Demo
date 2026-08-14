"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { CITROEN_CLIENT } from "@/lib/data/citroen";
import {
  DEFAULT_CITROEN_CLIENT,
  loadClientsFromStorage,
  loadFocusedClientId,
  normalizeClients,
  saveClientsToStorage,
  saveFocusedClientId,
  type StoredClient,
} from "@/lib/clients-store";
import {
  greetingFirstName,
  loadUserName,
  saveUserName,
} from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  History,
  ImagePlus,
  LayoutDashboard,
  Plus,
  Trash2,
  X,
} from "lucide-react";

const DESTINATIONS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Stats and recent reviews",
    icon: LayoutDashboard,
  },
  {
    href: "/review",
    label: "Start a review",
    description: "Check a post before client sign-off",
    icon: ClipboardList,
  },
  {
    href: "/history",
    label: "History",
    description: "Browse past review sessions",
    icon: History,
  },
  {
    href: "/client",
    label: "Client brief",
    description: "Brand voice, audience, and platform tips",
    icon: BookOpen,
  },
] as const;

const CLIENT_COLORS = [
  "from-[#EB4D4B] to-[#9a1f1c]",
  "from-[#3b82f6] to-[#1e3a8a]",
  "from-[#10b981] to-[#065f46]",
  "from-[#f59e0b] to-[#92400e]",
  "from-[#8b5cf6] to-[#4c1d95]",
];

type ClientProfile = StoredClient;

function clientInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function clientColor(name: string) {
  if (name === CITROEN_CLIENT.name) return CLIENT_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CLIENT_COLORS[Math.abs(hash) % CLIENT_COLORS.length];
}

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function WelcomeHome() {
  const reducedMotion = useReducedMotion();
  const [clients, setClients] = useState<ClientProfile[]>([
    DEFAULT_CITROEN_CLIENT,
  ]);
  const [focusedId, setFocusedId] = useState("citroen");
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<"name" | "select" | "workspace">("name");
  const [userName, setUserName] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [dataDisclosureOpen, setDataDisclosureOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientImage, setNewClientImage] = useState<string | undefined>();
  const [entered, setEntered] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const addLogoInputRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  useEffect(() => {
    const stored = loadClientsFromStorage();
    setClients(stored);
    const focus = loadFocusedClientId(stored[0]?.id ?? "citroen");
    setFocusedId(
      stored.some((c) => c.id === focus) ? focus : (stored[0]?.id ?? "citroen"),
    );
    const savedName = loadUserName();
    setUserName(savedName);
    setNameDraft(savedName);
    setPhase(savedName ? "select" : "name");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveClientsToStorage(clients);
  }, [clients, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveFocusedClientId(focusedId);
  }, [focusedId, hydrated]);

  const focused = clients.find((c) => c.id === focusedId) ?? clients[0];
  const greetName = greetingFirstName(userName);

  useEffect(() => {
    setEntered(false);
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, [phase]);

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    const name = newClientName.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const next = normalizeClients([
      ...clients,
      {
        id,
        name,
        imageUrl: newClientImage,
        imageFit: newClientImage ? "contain" : "cover",
      },
    ]);
    setClients(next);
    setFocusedId(id);
    setNewClientName("");
    setNewClientImage(undefined);
    setAddOpen(false);
    setOptionsOpen(false);
  }

  function handleRemoveClient(id: string) {
    if (clients.length <= 1) return;
    const next = normalizeClients(clients.filter((c) => c.id !== id));
    setClients(next);
    setFocusedId(next[0]?.id ?? "citroen");
    setOptionsOpen(false);
  }

  async function handleLogoUpload(clientId: string, file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const imageUrl = await readImageAsDataUrl(file);
    setClients((prev) =>
      normalizeClients(
        prev.map((c) =>
          c.id === clientId
            ? { ...c, imageUrl, imageFit: "contain" as const }
            : c,
        ),
      ),
    );
    setOptionsOpen(false);
  }

  async function handleNewClientLogo(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setNewClientImage(await readImageAsDataUrl(file));
  }

  function handleNameContinue(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = nameDraft.trim();
    if (!trimmed) return;
    saveUserName(trimmed);
    setUserName(trimmed);
    setPhase("select");
  }

  function enterWorkspace() {
    setOptionsOpen(false);
    setPhase("workspace");
    setDataDisclosureOpen(true);
  }

  function goBackToSelect() {
    setPhase("select");
    setOptionsOpen(false);
    setDataDisclosureOpen(false);
  }

  if (!hydrated) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-4" />
    );
  }

  if (phase === "name") {
    return (
      <div className="relative flex h-full flex-col items-center justify-center overflow-y-auto px-4 select-none">
        <div
          className={cn(
            "relative z-10 w-full max-w-md text-center transition-all duration-700",
            entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase">
            Review Desk
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What&apos;s your name?
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            We&apos;ll use it to greet you before you pick a client.
          </p>
          <form
            onSubmit={handleNameContinue}
            className="mt-10 space-y-4 text-left select-text"
          >
            <Input
              autoFocus
              placeholder="Your name"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              className="h-11 border-border bg-foreground/5 text-center text-base text-foreground placeholder:text-muted-foreground/80"
              aria-label="Your name"
            />
            <Button
              type="submit"
              disabled={!nameDraft.trim()}
              className="h-11 w-full"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (phase === "workspace") {
    return (
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-4 select-none">
        <FloatyBackButton onClick={goBackToSelect} label="Clients" />
        <div
          className={cn(
            "relative z-10 w-full max-w-2xl text-center transition-all duration-700",
            entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase">
            Review Desk · {focused.name}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Welcome back, {greetName}
          </h1>

          <div className="mt-12 grid gap-3 text-left sm:grid-cols-2">
            {DESTINATIONS.map(({ href, label, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-2xl border border-border bg-foreground/5 p-4 backdrop-blur-md transition-all hover:border-foreground/20 hover:bg-foreground/10"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-foreground/5 text-muted-foreground transition-colors group-hover:border-foreground/35 group-hover:text-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {dataDisclosureOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-black/70"
            role="dialog"
            aria-modal="true"
            aria-labelledby="data-disclosure-title"
            onClick={() => setDataDisclosureOpen(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl border border-border bg-popover p-5 shadow-2xl select-text"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <h2
                  id="data-disclosure-title"
                  className="pr-8 text-base font-semibold text-foreground"
                >
                  About the data in this demo
                </h2>
                <button
                  type="button"
                  onClick={() => setDataDisclosureOpen(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                All the numbers and reference data shown in this model were
                provided by Citroën. The data is real client data from Citroën,
                and Review Desk answers on that basis.
              </p>
              <div className="mt-5 flex justify-end">
                <Button type="button" onClick={() => setDataDisclosureOpen(false)}>
                  Got it
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-4 select-none">
      <div
        className={cn(
          "relative z-10 flex w-full max-w-5xl flex-col items-center transition-all duration-700",
          entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        )}
      >
        <h1 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Welcome back, {greetName}
        </h1>
        <p className="mt-3 text-center text-base text-muted-foreground sm:text-lg">
          Who&apos;s the client today?
        </p>

        <div className="mt-14 flex w-full items-center justify-center gap-10 overflow-visible px-2 sm:gap-14">
          {clients.map((client) => {
            const isFocused = focusedId === client.id;
            return (
              <div
                key={client.id}
                className={cn(
                  "relative flex shrink-0 flex-col items-center will-change-transform",
                  "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isFocused
                    ? "z-20 scale-110 opacity-100"
                    : "z-10 scale-90 opacity-55",
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (isFocused) {
                      enterWorkspace();
                    } else {
                      setFocusedId(client.id);
                      setOptionsOpen(false);
                    }
                  }}
                  className="group relative focus:outline-none"
                  aria-label={
                    isFocused
                      ? `Continue with ${client.name}`
                      : `Select ${client.name}`
                  }
                >
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -inset-3 rounded-full border-2 border-foreground transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isFocused
                        ? "scale-100 opacity-90"
                        : "scale-90 opacity-0",
                      isFocused &&
                        !reducedMotion &&
                        "animate-[ps5-ring_2.4s_ease-in-out_infinite]",
                    )}
                  />
                  <ClientAvatar
                    name={client.name}
                    imageUrl={client.imageUrl}
                    imageFit={client.imageFit}
                    size="lg"
                  />
                </button>

                <p
                  className={cn(
                    "mt-3 max-w-[7.5rem] truncate text-center text-sm font-medium transition-colors duration-500",
                    isFocused ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {client.name}
                </p>

                <div
                  className={cn(
                    "relative mt-1.5 flex flex-col items-center transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isFocused
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-1 opacity-0",
                  )}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOptionsOpen((o) => !o);
                    }}
                    className="text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Options
                  </button>

                  {optionsOpen && isFocused && (
                    <div className="absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-48 -translate-x-1/2 rounded-xl border border-border bg-popover/95 p-1.5 shadow-2xl backdrop-blur-xl">
                      <button
                        type="button"
                        onClick={enterWorkspace}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-foreground/10"
                      >
                        Continue
                      </button>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-foreground/10"
                      >
                        <ImagePlus className="size-3.5" />
                        {client.imageUrl ? "Change logo" : "Upload logo"}
                      </button>
                      <button
                        type="button"
                        disabled={clients.length <= 1}
                        onClick={() => handleRemoveClient(client.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-foreground/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="size-3.5" />
                        Remove client
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <input
            ref={logoInputRef}
            id={`${uid}-logo`}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              void handleLogoUpload(focusedId, e.target.files?.[0]);
              e.target.value = "";
            }}
          />

          <div className="flex shrink-0 flex-col items-center">
            <button
              type="button"
              onClick={() => {
                setAddOpen(true);
                setOptionsOpen(false);
              }}
              aria-label="Add client"
              className="group relative flex size-[4.5rem] items-center justify-center focus:outline-none sm:size-24"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 rounded-full bg-foreground/5",
                  !reducedMotion &&
                    "animate-[ps5-plus-pulse_2.8s_ease-in-out_infinite]",
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "absolute -inset-3 rounded-full border border-border",
                  !reducedMotion &&
                    "animate-[ps5-plus-ring_2.8s_ease-in-out_infinite]",
                )}
              />
              <span className="relative flex size-full items-center justify-center rounded-full border border-foreground/20 bg-foreground/5 text-muted-foreground shadow-[0_0_50px_-10px_rgba(0,0,0,0.2)] transition-all duration-300 group-hover:scale-105 group-hover:border-foreground/40 group-hover:bg-foreground/10 group-hover:text-foreground dark:shadow-[0_0_50px_-10px_rgba(255,255,255,0.25)]">
                <Plus
                  className={cn(
                    "size-8 sm:size-10",
                    !reducedMotion &&
                      "animate-[ps5-plus-icon_2.8s_ease-in-out_infinite]",
                  )}
                  strokeWidth={1.75}
                />
              </span>
            </button>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              Add Client
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-1.5 text-center">
          <p className="text-sm text-muted-foreground sm:text-base">
            Select a client to continue
          </p>
          <p className="text-xs text-muted-foreground/80 sm:text-sm">
            Click + to add a client
          </p>
        </div>
      </div>

      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-black/70"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-client-title"
          onClick={() => setAddOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-popover p-5 shadow-2xl select-text"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id="add-client-title"
                className="text-base font-semibold text-foreground"
              >
                Add client
              </h2>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Name the brand and optionally upload a logo — it will be cropped
              to a circle and centred.
            </p>
            <form onSubmit={handleAddClient} className="mt-4 space-y-4">
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => addLogoInputRef.current?.click()}
                  className="group relative"
                  aria-label="Upload brand logo"
                >
                  {newClientImage ? (
                    <ClientAvatar
                      name={newClientName || "Preview"}
                      imageUrl={newClientImage}
                      imageFit="contain"
                      size="md"
                    />
                  ) : (
                    <span className="flex size-20 items-center justify-center rounded-full border border-dashed border-foreground/25 bg-foreground/5 text-muted-foreground transition-colors group-hover:border-foreground/40 group-hover:text-foreground">
                      <ImagePlus className="size-6" />
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => addLogoInputRef.current?.click()}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {newClientImage ? "Change logo" : "Upload brand logo"}
                </button>
                <input
                  ref={addLogoInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    void handleNewClientLogo(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
              <Input
                autoFocus
                placeholder="Client name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground/80"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAddOpen(false)}
                  className="text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!newClientName.trim()}>
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ClientAvatar({
  name,
  imageUrl,
  imageFit = "cover",
  size,
}: {
  name: string;
  imageUrl?: string;
  imageFit?: "cover" | "contain";
  size: "md" | "lg";
}) {
  const isLogo = imageFit === "contain";

  return (
    <span
      className={cn(
        "relative block overflow-hidden rounded-full shadow-[0_0_40px_-8px_rgba(93,31,35,0.55)] transition-[box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        size === "lg"
          ? "size-[5.5rem] sm:size-28"
          : "size-[4.5rem] sm:size-24",
        imageUrl
          ? isLogo
            ? "bg-white"
            : "bg-muted"
          : `bg-gradient-to-br ${clientColor(name)}`,
      )}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className={cn(
            "absolute inset-0 size-full object-center",
            isLogo ? "object-contain p-[18%] sm:p-[20%]" : "object-cover",
          )}
        />
      ) : (
        <span
          className={cn(
            "flex size-full items-center justify-center font-bold text-foreground",
            size === "lg" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
          )}
        >
          {clientInitial(name)}
        </span>
      )}
    </span>
  );
}

function FloatyBackButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute top-1/2 left-4 z-30 flex -translate-y-1/2 items-center gap-3 rounded-full border border-foreground/20 bg-card/80 px-5 py-3.5 text-foreground shadow-[0_0_40px_-8px_rgba(232,77,154,0.35)] backdrop-blur-md transition-all hover:border-foreground/35 hover:bg-card sm:left-8 sm:px-6 sm:py-4 dark:shadow-[0_0_40px_-8px_rgba(93,31,35,0.65)]",
        !reducedMotion && "animate-[ps5-float_4s_ease-in-out_infinite]",
      )}
      aria-label={`Go back to ${label}`}
    >
      <ArrowLeft className="size-6 sm:size-7" strokeWidth={2} />
      <span className="text-base font-medium sm:text-lg">Back</span>
    </button>
  );
}
