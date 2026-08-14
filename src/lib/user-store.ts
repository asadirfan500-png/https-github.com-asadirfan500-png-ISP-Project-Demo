export const USER_NAME_STORAGE_KEY = "review-desk-user-name-v1";

export function loadUserName(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(USER_NAME_STORAGE_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function saveUserName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = name.trim();
    if (!trimmed) {
      window.localStorage.removeItem(USER_NAME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(USER_NAME_STORAGE_KEY, trimmed);
    }
    window.dispatchEvent(new Event("review-desk-user-name-changed"));
  } catch {
    // Quota / private mode — ignore
  }
}

/** First word for greetings, e.g. "Elisah M." → "Elisah" */
export function greetingFirstName(fullName: string, fallback = "there"): string {
  const first = fullName.trim().split(/\s+/)[0];
  return first || fallback;
}
