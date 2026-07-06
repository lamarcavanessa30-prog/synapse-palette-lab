import type { ConversationDepthId } from "./conversationAdaptation";

export type ConversationModePreference = "automatica" | ConversationDepthId;

export const DEFAULT_CONVERSATION_MODE: ConversationModePreference = "automatica";

const CONVERSATION_MODE_STORAGE_KEY = "humind.chat.mode";
const VALID_CONVERSATION_MODES = new Set<ConversationModePreference>([
  DEFAULT_CONVERSATION_MODE,
  "ascolto",
  "riflessione",
  "esplorazione",
  "autoanalisi",
  "specchio",
]);

type PreferenceStorage = Pick<Storage, "getItem" | "setItem">;

function getBrowserPreferenceStorage(): PreferenceStorage | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

export function isConversationModePreference(value: string | null): value is ConversationModePreference {
  return value !== null && VALID_CONVERSATION_MODES.has(value as ConversationModePreference);
}

export function loadConversationModePreference(
  storage = getBrowserPreferenceStorage(),
): ConversationModePreference {
  if (!storage) return DEFAULT_CONVERSATION_MODE;

  const savedMode = storage.getItem(CONVERSATION_MODE_STORAGE_KEY);
  return isConversationModePreference(savedMode) ? savedMode : DEFAULT_CONVERSATION_MODE;
}

export function saveConversationModePreference(
  mode: ConversationModePreference,
  storage = getBrowserPreferenceStorage(),
) {
  if (!storage) return;
  storage.setItem(CONVERSATION_MODE_STORAGE_KEY, mode);
}
