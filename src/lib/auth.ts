import type { Credentials } from "@/types";
import { STORAGE_KEYS, readJson, removeKey, writeJson } from "./storage";

/**
 * Default credentials for the MVP. They can be changed from the Settings
 * page and the update is persisted to localStorage. There is intentionally
 * NO registration or password-reset flow (per project scope).
 */
export const DEFAULT_CREDENTIALS: Credentials = {
  username: "admin",
  password: "goat2026",
};

export function getCredentials(): Credentials {
  return readJson<Credentials>(STORAGE_KEYS.credentials, DEFAULT_CREDENTIALS);
}

export function setCredentials(next: Credentials): void {
  writeJson(STORAGE_KEYS.credentials, next);
}

export function isAuthenticated(): boolean {
  return readJson<boolean>(STORAGE_KEYS.session, false) === true;
}

export function login(username: string, password: string): boolean {
  const creds = getCredentials();
  if (username.trim() === creds.username && password === creds.password) {
    writeJson(STORAGE_KEYS.session, true);
    return true;
  }
  return false;
}

export function logout(): void {
  removeKey(STORAGE_KEYS.session);
}