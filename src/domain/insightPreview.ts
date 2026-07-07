import type { Thought } from "./thoughts";

export type InsightPreviewStatus = "empty" | "collecting" | "ready";

export type InsightPreviewResult = {
  totalThoughts: number;
  latestThoughtDate: string | null;
  hasEnoughThoughtsForFutureInsights: boolean;
  status: InsightPreviewStatus;
  message: string;
};

const MIN_THOUGHTS_FOR_FUTURE_INSIGHTS = 3;

export function createInsightPreview(thoughts: Thought[]): InsightPreviewResult {
  const totalThoughts = thoughts.length;
  const latestThoughtDate = getLatestThoughtDate(thoughts);
  const hasEnoughThoughtsForFutureInsights = totalThoughts >= MIN_THOUGHTS_FOR_FUTURE_INSIGHTS;

  if (totalThoughts === 0) {
    return {
      totalThoughts,
      latestThoughtDate,
      hasEnoughThoughtsForFutureInsights,
      status: "empty",
      message: "Quando inizierai a conservare pensieri, Hu-Mind potra mostrarti una prima anteprima neutra del materiale raccolto.",
    };
  }

  if (!hasEnoughThoughtsForFutureInsights) {
    return {
      totalThoughts,
      latestThoughtDate,
      hasEnoughThoughtsForFutureInsights,
      status: "collecting",
      message: "Continua a scrivere: pochi pensieri alla volta costruiscono una base piu leggibile nel tempo.",
    };
  }

  return {
    totalThoughts,
    latestThoughtDate,
    hasEnoughThoughtsForFutureInsights,
    status: "ready",
    message: "Hai abbastanza pensieri salvati per preparare, in futuro, anteprime piu ricche sempre basate sui tuoi dati reali.",
  };
}

function getLatestThoughtDate(thoughts: Thought[]) {
  const latestThought = thoughts
    .filter((thought) => thought.createdAt)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  return latestThought?.createdAt ?? null;
}
