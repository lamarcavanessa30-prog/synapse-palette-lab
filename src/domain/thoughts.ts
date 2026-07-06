export type ThoughtSource = "capture" | "chat" | "import";

export type Thought = {
  id: string;
  text: string;
  createdAt: string;
  source: ThoughtSource;
  tags: string[];
};

export type NewThoughtInput = {
  text: string;
  source: ThoughtSource;
  tags?: string[];
};

export const THOUGHTS_STORAGE_KEY = "humind.thoughts.v1";

export function createThought(input: NewThoughtInput, now = new Date()): Thought {
  return {
    id: createThoughtId(now),
    text: input.text.trim(),
    createdAt: now.toISOString(),
    source: input.source,
    tags: input.tags ?? [],
  };
}

export function isValidThought(value: unknown): value is Thought {
  if (!value || typeof value !== "object") return false;
  const thought = value as Partial<Thought>;
  return (
    typeof thought.id === "string" &&
    typeof thought.text === "string" &&
    typeof thought.createdAt === "string" &&
    typeof thought.source === "string" &&
    Array.isArray(thought.tags)
  );
}

function createThoughtId(now: Date) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `thought_${now.getTime()}_${random}`;
}
