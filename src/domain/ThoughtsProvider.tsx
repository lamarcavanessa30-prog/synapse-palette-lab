import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { loadStoredThoughts, saveStoredThoughts } from "./thoughtStorage";
import { THOUGHTS_STORAGE_KEY, createThought, type NewThoughtInput, type Thought } from "./thoughts";

type ThoughtsContextValue = {
  thoughts: Thought[];
  addThought: (input: NewThoughtInput) => Thought | null;
};

const ThoughtsContext = createContext<ThoughtsContextValue | null>(null);

export function ThoughtsProvider({ children }: { children: ReactNode }) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  useEffect(() => {
    setThoughts(loadStoredThoughts());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THOUGHTS_STORAGE_KEY) {
        setThoughts(loadStoredThoughts());
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
        saveStoredThoughts(next);
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
