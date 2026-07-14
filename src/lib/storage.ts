/**
 * Thin localStorage wrapper with SSR-safety and JSON serialization.
 * All persistence for the MVP goes through this module so a future
 * migration to IndexedDB or a backend (Firebase, etc.) only requires
 * swapping this file's implementation.
 */

const isBrowser = typeof window !== "undefined";

export const STORAGE_KEYS = {
  session: "srg.session",
  credentials: "srg.credentials",
  farm: "srg.farm",
  records: "srg.records",
} as const;

export function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / privacy mode — silently ignore */
  }
}

export function removeKey(key: string): void {
  if (!isBrowser) return;
  window.localStorage.removeItem(key);
}

export function uid(): string {
  if (isBrowser && "crypto" in window && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}