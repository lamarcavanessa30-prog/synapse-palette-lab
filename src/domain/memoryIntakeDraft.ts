import type { MemoryCandidate } from "./memoryCandidates";
import type { ThoughtLookupResult } from "./thoughtLookup";

export type MemoryIntakeDraftStatus = "draft";

export type MemoryIntakeDraftReason = "unmatched_review_ready_candidate";

export type SkippedMemoryIntakeDraftReason = "malformed_candidate";

export type MemoryIntakeDraft = {
  candidate: MemoryCandidate;
  status: MemoryIntakeDraftStatus;
  reason: MemoryIntakeDraftReason;
  createdAt: null;
  metadata: null;
};

export type SkippedMemoryIntakeDraft = {
  candidate: unknown;
  reason: SkippedMemoryIntakeDraftReason;
};

export type MemoryIntakeDraftResult = {
  drafts: MemoryIntakeDraft[];
  skipped: SkippedMemoryIntakeDraft[];
};

function isMemoryCandidate(candidate: unknown): candidate is MemoryCandidate {
  if (!candidate || typeof candidate !== "object") return false;

  const value = candidate as Partial<MemoryCandidate>;
  return (
    typeof value.id === "string" &&
    value.source === "cognitive_validation" &&
    typeof value.category === "string" &&
    typeof value.observedText === "string" &&
    value.status === "candidate"
  );
}

export function prepareMemoryIntakeDrafts(lookup: ThoughtLookupResult): MemoryIntakeDraftResult {
  const drafts: MemoryIntakeDraft[] = [];
  const skipped: SkippedMemoryIntakeDraft[] = [];

  lookup.unmatchedCandidates.forEach((candidate) => {
    if (!isMemoryCandidate(candidate)) {
      skipped.push({ candidate, reason: "malformed_candidate" });
      return;
    }

    drafts.push({
      candidate,
      status: "draft",
      reason: "unmatched_review_ready_candidate",
      createdAt: null,
      metadata: null,
    });
  });

  return { drafts, skipped };
}
