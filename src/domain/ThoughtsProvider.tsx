import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { THOUGHTS_STORAGE_KEY, createThought, isValidThought, type NewThoughtInput, type Thought } from "./thoughts";

type ThoughtsContextValue = {
  thoughts: Thought[];
  addThought: (input: NewThoughtInput) => Thought | null;
};

const ThoughtsContext = createContext<ThoughtsContextValue | null>(null);

export function ThoughtsProvider({ children }: { children: ReactNode }) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  useEffect(() => {
    setThoughts(readStoredThoughts());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THOUGHTS_STORAGE_KEY) {
        setThoughts(readStoredThoughts());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addThought = useCallback(
    (input: NewThoughtInput) => {
      if (typeof window === "undefined") return null;

      const text = input.text.trim();
      if (!text) return null;

      const thought = createThought({ ...input, text });
      setThoughts((current) => {
        const next = [thought, ...current];
        window.localStorage.setItem(THOUGHTS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      return thought;
    },
    [],
  );

  const value = useMemo(() => ({ thoughts, addThought }), [addThought, thoughts]);

  return <ThoughtsContext.Provider value={value}>{children}</ThoughtsContext.Provider>;
}

export function useThoughts() {
  const value = useContext(ThoughtsContext);
  if (!value) {
    throw new Error("useThoughts must be used inside ThoughtsProvider");
  }
  return value;
}

function readStoredThoughts() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(THOUGHTS_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidThought).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}
