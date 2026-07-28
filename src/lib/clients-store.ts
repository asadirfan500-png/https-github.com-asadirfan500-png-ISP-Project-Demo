import { CITROEN_CLIENT } from "@/lib/data/citroen";

export const CLIENTS_STORAGE_KEY = "review-desk-clients-v1";
export const FOCUSED_CLIENT_STORAGE_KEY = "review-desk-focused-client-v1";

export interface StoredClient {
  id: string;
  name: string;
  imageUrl?: string;
  imageFit?: "cover" | "contain";
}

export const DEFAULT_CITROEN_CLIENT: StoredClient = {
  id: "citroen",
  name: CITROEN_CLIENT.name,
  imageUrl: CITROEN_CLIENT.logoUrl,
  imageFit: "contain",
};

export function isCitroenClient(
  client: Pick<StoredClient, "id" | "name">,
): boolean {
  return (
    client.id === "citroen" ||
    client.name === CITROEN_CLIENT.name ||
    /^citro[eë]n$/i.test(client.name.trim())
  );
}

/** Keep Citroën on the official logo path even if storage was edited. */
export function normalizeClients(clients: StoredClient[]): StoredClient[] {
  const list = clients.length > 0 ? clients : [DEFAULT_CITROEN_CLIENT];
  return list.map((c) => {
    if (isCitroenClient(c)) {
      return {
        ...c,
        id: c.id || "citroen",
        name: CITROEN_CLIENT.name,
        imageUrl: CITROEN_CLIENT.logoUrl,
        imageFit: "contain",
      };
    }
    return c;
  });
}

export function loadClientsFromStorage(): StoredClient[] {
  if (typeof window === "undefined") return [DEFAULT_CITROEN_CLIENT];
  try {
    const raw = window.localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!raw) return [DEFAULT_CITROEN_CLIENT];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [DEFAULT_CITROEN_CLIENT];
    }
    return normalizeClients(parsed as StoredClient[]);
  } catch {
    return [DEFAULT_CITROEN_CLIENT];
  }
}

export function saveClientsToStorage(clients: StoredClient[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CLIENTS_STORAGE_KEY,
      JSON.stringify(normalizeClients(clients)),
    );
    window.dispatchEvent(new Event("review-desk-clients-changed"));
  } catch {
    // Quota / private mode — ignore
  }
}

export function loadFocusedClientId(fallback = "citroen"): string {
  if (typeof window === "undefined") return fallback;
  try {
    return window.localStorage.getItem(FOCUSED_CLIENT_STORAGE_KEY) || fallback;
  } catch {
    return fallback;
  }
}

export function saveFocusedClientId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FOCUSED_CLIENT_STORAGE_KEY, id);
  } catch {
    // ignore
  }
}
