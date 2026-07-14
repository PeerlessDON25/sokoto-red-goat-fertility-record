import type { FarmInfo, FertilityRecord } from "@/types";
import { STORAGE_KEYS, readJson, uid, writeJson } from "./storage";

export const DEFAULT_FARM: FarmInfo = {
  farmName: "",
  ownerName: "",
  location: "",
  recordYear: String(new Date().getFullYear()),
  veterinarySupervisor: "",
};

export function getFarm(): FarmInfo {
  return readJson<FarmInfo>(STORAGE_KEYS.farm, DEFAULT_FARM);
}

export function saveFarm(farm: FarmInfo): void {
  writeJson(STORAGE_KEYS.farm, farm);
}

export function getRecords(): FertilityRecord[] {
  return readJson<FertilityRecord[]>(STORAGE_KEYS.records, []);
}

export function saveRecords(records: FertilityRecord[]): void {
  writeJson(STORAGE_KEYS.records, records);
}

export function upsertRecord(
  existing: FertilityRecord[],
  input: Omit<FertilityRecord, "id" | "createdAt" | "updatedAt"> & {
    id?: string;
  },
): FertilityRecord[] {
  const now = new Date().toISOString();
  if (input.id) {
    return existing.map((r) =>
      r.id === input.id ? { ...r, ...input, id: r.id, updatedAt: now } : r,
    );
  }
  const next: FertilityRecord = {
    ...input,
    id: uid(),
    createdAt: now,
    updatedAt: now,
  };
  return [next, ...existing];
}

export function deleteRecord(
  existing: FertilityRecord[],
  id: string,
): FertilityRecord[] {
  return existing.filter((r) => r.id !== id);
}