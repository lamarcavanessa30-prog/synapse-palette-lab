import { THOUGHTS_STORAGE_KEY, isValidThought, type Thought } from "./thoughts";

type ThoughtStorage = Pick<Storage, "getItem" | "setItem">;

function getBrowserThoughtStorage(): ThoughtStorage | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

export function loadStoredThoughts(storage = getBrowserThoughtStorage()): Thought[] {
  if (!storage) return [];

  try {
    // TODO: Replace browser storage with a repository backed by authenticated server persistence.
    const raw = storage.getItem(THOUGHTS_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidThought).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export function saveStoredThoughts(thoughts: Thought[], storage = getBrowserThoughtStorage()) {
  if (!storage) return;
  storage.setItem(THOUGHTS_STORAGE_KEY, JSON.stringify(thoughts));
}
