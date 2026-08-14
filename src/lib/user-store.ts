export const USER_NAME_STORAGE_KEY = "review-desk-user-name-v1";
export const USER_PROFILE_STORAGE_KEY = "review-desk-user-profile-v1";
export const USER_PROFILE_CHANGED_EVENT = "review-desk-user-profile-changed";

export type UserProfile = {
  name: string;
  jobTitle: string;
  imageUrl?: string;
};

function emitProfileChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(USER_PROFILE_CHANGED_EVENT));
  // Back-compat for listeners that only watch the old name event
  window.dispatchEvent(new Event("review-desk-user-name-changed"));
}

function readLegacyName(): string {
  try {
    return window.localStorage.getItem(USER_NAME_STORAGE_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function loadUserProfile(): UserProfile {
  if (typeof window === "undefined") {
    return { name: "", jobTitle: "" };
  }
  try {
    const raw = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UserProfile>;
      return {
        name: typeof parsed.name === "string" ? parsed.name.trim() : "",
        jobTitle:
          typeof parsed.jobTitle === "string" ? parsed.jobTitle.trim() : "",
        imageUrl:
          typeof parsed.imageUrl === "string" && parsed.imageUrl
            ? parsed.imageUrl
            : undefined,
      };
    }

    // Migrate old name-only key once
    const legacy = readLegacyName();
    if (legacy) {
      const migrated: UserProfile = { name: legacy, jobTitle: "" };
      window.localStorage.setItem(
        USER_PROFILE_STORAGE_KEY,
        JSON.stringify(migrated),
      );
      return migrated;
    }
  } catch {
    // ignore
  }
  return { name: "", jobTitle: "" };
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    const next: UserProfile = {
      name: profile.name.trim(),
      jobTitle: profile.jobTitle.trim(),
      imageUrl: profile.imageUrl?.trim() || undefined,
    };
    if (!next.name && !next.jobTitle && !next.imageUrl) {
      window.localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
      window.localStorage.removeItem(USER_NAME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(
        USER_PROFILE_STORAGE_KEY,
        JSON.stringify(next),
      );
      // Keep legacy key in sync for older call sites
      if (next.name) {
        window.localStorage.setItem(USER_NAME_STORAGE_KEY, next.name);
      } else {
        window.localStorage.removeItem(USER_NAME_STORAGE_KEY);
      }
    }
    emitProfileChanged();
  } catch {
    // Quota / private mode — ignore
  }
}

export function loadUserName(): string {
  return loadUserProfile().name;
}

export function saveUserName(name: string): void {
  const current = loadUserProfile();
  saveUserProfile({ ...current, name });
}

export function isProfileComplete(profile: UserProfile = loadUserProfile()): boolean {
  return Boolean(profile.name.trim() && profile.jobTitle.trim());
}

/** First word for greetings, e.g. "Elisah M." → "Elisah" */
export function greetingFirstName(fullName: string, fallback = "there"): string {
  const first = fullName.trim().split(/\s+/)[0];
  return first || fallback;
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}
