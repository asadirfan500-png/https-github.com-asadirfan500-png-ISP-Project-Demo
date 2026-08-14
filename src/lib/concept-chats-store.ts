import { formatReviewDateShort } from "@/lib/reviews-store";

export const CONCEPT_CHATS_STORAGE_KEY = "review-desk-concept-chats-v1";
export const ACTIVE_CONCEPT_CHAT_KEY = "review-desk-concept-chat-active-v1";
export const CONCEPT_CHATS_CHANGED_EVENT = "review-desk-concept-chats-changed";

export type ConceptChatRole = "user" | "assistant";

export type ConceptChatMessage = {
  id: string;
  role: ConceptChatRole;
  content: string;
  seed?: boolean;
};

export type ConceptChatHistoryItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  titlePreview: string;
  messageCount: number;
  messages: ConceptChatMessage[];
};

export type ActiveConceptChat = {
  id: string;
  messages: ConceptChatMessage[];
  updatedAt: string;
};

function makeChatId() {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function durableMessages(messages: ConceptChatMessage[]): ConceptChatMessage[] {
  return messages
    .filter((m) => !m.seed && m.content.trim())
    .map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    }));
}

function titleFromMessages(messages: ConceptChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user" && m.content.trim());
  const text = firstUser?.content.trim() || "Concept check";
  return text.length > 72 ? `${text.slice(0, 72)}…` : text;
}

export function loadConceptChats(): ConceptChatHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CONCEPT_CHATS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as ConceptChatHistoryItem[];
  } catch {
    return [];
  }
}

export function saveConceptChats(chats: ConceptChatHistoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CONCEPT_CHATS_STORAGE_KEY,
      JSON.stringify(chats),
    );
    window.dispatchEvent(new Event(CONCEPT_CHATS_CHANGED_EVENT));
  } catch {
    // ignore quota / private mode
  }
}

export function getConceptChatById(
  id: string,
): ConceptChatHistoryItem | undefined {
  return loadConceptChats().find((c) => c.id === id);
}

/** Upsert a chat into history after it has at least one user message. */
export function upsertConceptChat(input: {
  id?: string;
  messages: ConceptChatMessage[];
}): ConceptChatHistoryItem | null {
  const messages = durableMessages(input.messages);
  if (messages.length === 0) return null;

  const now = new Date().toISOString();
  const existing = input.id
    ? loadConceptChats().find((c) => c.id === input.id)
    : undefined;
  const id = existing?.id ?? input.id ?? makeChatId();

  const item: ConceptChatHistoryItem = {
    id,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    titlePreview: titleFromMessages(messages),
    messageCount: messages.length,
    messages,
  };

  const others = loadConceptChats().filter((c) => c.id !== id);
  saveConceptChats([item, ...others]);
  return item;
}

export function loadActiveConceptChat(): ActiveConceptChat | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACTIVE_CONCEPT_CHAT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveConceptChat;
    if (!parsed?.id || !Array.isArray(parsed.messages)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveActiveConceptChat(
  active: ActiveConceptChat | null,
): void {
  if (typeof window === "undefined") return;
  try {
    if (!active) {
      window.localStorage.removeItem(ACTIVE_CONCEPT_CHAT_KEY);
    } else {
      window.localStorage.setItem(
        ACTIVE_CONCEPT_CHAT_KEY,
        JSON.stringify(active),
      );
    }
  } catch {
    // ignore
  }
}

export function clearActiveConceptChat(): void {
  saveActiveConceptChat(null);
}

export function formatConceptChatDay(iso: string): string {
  return formatReviewDateShort(iso);
}

export function formatConceptChatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function groupConceptChatsByDay(
  chats: ConceptChatHistoryItem[],
): { dayLabel: string; dayKey: string; chats: ConceptChatHistoryItem[] }[] {
  const map = new Map<string, ConceptChatHistoryItem[]>();
  for (const chat of chats) {
    const d = new Date(chat.updatedAt);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const list = map.get(key) ?? [];
    list.push(chat);
    map.set(key, list);
  }
  return Array.from(map.entries()).map(([dayKey, dayChats]) => ({
    dayKey,
    dayLabel: formatConceptChatDay(dayChats[0].updatedAt),
    chats: dayChats,
  }));
}
