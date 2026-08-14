"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  greetingFirstName,
  loadUserName,
} from "@/lib/user-store";
import { cn } from "@/lib/utils";
import {
  Loader2,
  MessageSquareText,
  PencilLine,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  /** UI-only greeting — not sent to the API */
  seed?: boolean;
};

const QUICK_PROMPTS = [
  {
    icon: Sparkles,
    label: "Pressure-test a weak concept",
    text: "A generic post about how premium and best-in-class our new SUV is.",
  },
  {
    icon: PencilLine,
    label: "Improve a rough caption",
    text: "Help me tighten this rough caption for Instagram — keep it human and on Citroën tone.",
  },
  {
    icon: Users,
    label: "Check Everyday Outsiders fit",
    text: "Would Everyday Outsiders care about this idea? An everyday family moment with the car showing up late in the story.",
  },
] as const;

function makeId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildGreeting(): ChatMessage {
  const name = greetingFirstName(loadUserName(), "there");
  return {
    id: makeId(),
    role: "assistant",
    content: `How may I help you, ${name}?`,
    seed: true,
  };
}

function getGreetingName() {
  return greetingFirstName(loadUserName(), "there");
}

type ComposerProps = {
  pill?: boolean;
  input: string;
  isStreaming: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
};

function Composer({
  pill,
  input,
  isStreaming,
  onInputChange,
  onSend,
  inputRef,
}: ComposerProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSend();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-center gap-2 border border-border bg-muted/40 backdrop-blur-md",
        pill
          ? "rounded-full px-3 py-2 shadow-[0_0_40px_-12px_rgba(0,0,0,0.45)]"
          : "rounded-2xl px-3 py-2.5",
      )}
    >
      <button
        type="button"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
        aria-label="Attach (coming soon)"
        title="Attachments coming soon"
        onClick={() => inputRef.current?.focus()}
      >
        <Plus className="size-4" strokeWidth={2} />
      </button>
      {pill ? (
        <input
          ref={inputRef as RefObject<HTMLInputElement | null>}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask anything"
          disabled={isStreaming}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          onKeyDown={handleKeyDown}
        />
      ) : (
        <textarea
          ref={inputRef as RefObject<HTMLTextAreaElement | null>}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Paste a concept or rough caption…"
          disabled={isStreaming}
          rows={1}
          className="max-h-32 min-h-[36px] min-w-0 flex-1 resize-none bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          onKeyDown={handleKeyDown}
        />
      )}
      <button
        type="submit"
        disabled={isStreaming || !input.trim()}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
          input.trim() && !isStreaming
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-foreground/10 text-muted-foreground",
        )}
        aria-label="Send"
      >
        {isStreaming ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
      </button>
    </form>
  );
}

export function ConceptChat() {
  // TODO: persist concept chats later
  const [messages, setMessages] = useState<ChatMessage[]>([buildGreeting()]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [greetingName, setGreetingName] = useState("there");
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pillInputRef = useRef<HTMLInputElement>(null);
  const threadInputRef = useRef<HTMLTextAreaElement>(null);

  const isEmpty =
    messages.length === 1 && Boolean(messages[0]?.seed) && !isStreaming;

  useEffect(() => {
    setGreetingName(getGreetingName());
  }, []);

  useEffect(() => {
    if (!isEmpty) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming, isEmpty]);

  function resetChat() {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    setInput("");
    setGreetingName(getGreetingName());
    setMessages([buildGreeting()]);
  }

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || isStreaming) return;

    const userMsg: ChatMessage = {
      id: makeId(),
      role: "user",
      content: text,
    };
    const assistantId = makeId();
    const nextMessages = [
      ...messages,
      userMsg,
      { id: assistantId, role: "assistant" as const, content: "" },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsStreaming(true);

    const payload = nextMessages
      .filter((m) => !m.seed && m.content.trim())
      .filter((m) => m.id !== assistantId)
      .map((m) => ({ role: m.role, content: m.content }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/concept-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(errBody?.error || `Request failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("No response stream.");
      }

      const decoder = new TextDecoder();
      let assembled = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assembled += decoder.decode(value, { stream: true });
        const snapshot = assembled;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: snapshot } : m,
          ),
        );
      }
      assembled += decoder.decode();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: assembled.trim() || m.content }
            : m,
        ),
      );
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const message =
        err instanceof Error ? err.message : "Concept chat failed";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  m.content.trim() ||
                  `I couldn't complete that check. ${message}`,
              }
            : m,
        ),
      );
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="flex min-h-[min(78vh,720px)] flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MessageSquareText className="size-4 text-muted-foreground" />
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Concept Check
            </h1>
          </div>
          {!isEmpty && (
            <p className="mt-1 text-xs text-muted-foreground">
              Early gate only — a human keeps the final call.
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetChat}
          disabled={isStreaming}
        >
          <RotateCcw className="size-3.5" />
          New concept
        </Button>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-sm">
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8">
            <h2 className="max-w-xl text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              How may I help you, {greetingName}?
            </h2>
            <div className="mt-8 w-full max-w-2xl">
              <Composer
                pill
                input={input}
                isStreaming={isStreaming}
                onInputChange={setInput}
                onSend={() => void sendMessage()}
                inputRef={pillInputRef}
              />
              <div className="mt-5 space-y-1">
                {QUICK_PROMPTS.map(({ icon: Icon, label, text }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setInput(text);
                      void sendMessage(text);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    <Icon className="size-4 shrink-0 opacity-70" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground/80">
                Pressure-test ideas before production. Grounded in Citroën brand,
                Everyday Outsiders, and craft examples — not a final verdict.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
              {messages
                .filter((m) => !m.seed)
                .map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[min(100%,36rem)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-muted/30 text-foreground",
                      )}
                    >
                      {m.content ||
                        (isStreaming ? (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Loader2 className="size-3.5 animate-spin" />
                            Thinking…
                          </span>
                        ) : (
                          ""
                        ))}
                    </div>
                  </div>
                ))}
              <div ref={bottomRef} />
            </div>
            <div className="border-t border-border p-3 sm:px-4">
              <Composer
                input={input}
                isStreaming={isStreaming}
                onInputChange={setInput}
                onSend={() => void sendMessage()}
                inputRef={threadInputRef}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
