import type { MemoryIntakeDraft, MemoryIntakeDraftResult } from "./memoryIntakeDraft";

export type MemoryIneligibilityReason =
  | "malformed_draft"
  | "invalid_status"
  | "duplicate_draft_id"
  | "empty_observed_text";

export type IneligibleMemoryDraft = {
  draft: unknown;
  reason: MemoryIneligibilityReason;
};

export type MemoryEligibilityResult = {
  eligible: MemoryIntakeDraft[];
  ineligible: IneligibleMemoryDraft[];
};

function isMemoryIntakeDraft(draft: unknown): draft is MemoryIntakeDraft {
  if (!draft || typeof draft !== "object") return false;

  const value = draft as Partial<MemoryIntakeDraft>;
  return (
    !!value.candidate &&
    typeof value.candidate === "object" &&
    typeof value.candidate.id === "string" &&
    typeof value.candidate.observedText === "string" &&
    value.reason === "unmatched_review_ready_candidate" &&
    value.createdAt === null &&
    value.metadata === null
  );
}

function validateDraft(params: {
  draft: unknown;
  seenDraftIds: Set<string>;
}): MemoryIntakeDraft | MemoryIneligibilityReason {
  if (!isMemoryIntakeDraft(params.draft)) return "malformed_draft";
  if (params.draft.status !== "draft") return "invalid_status";

  const draftId = params.draft.candidate.id;
  if (params.seenDraftIds.has(draftId)) return "duplicate_draft_id";

  if (!params.draft.candidate.observedText.trim()) return "empty_observed_text";

  params.seenDraftIds.add(draftId);
  return params.draft;
}

export function evaluateMemoryEligibility(
  intakeDraft: MemoryIntakeDraftResult,
): MemoryEligibilityResult {
  const eligible: MemoryIntakeDraft[] = [];
  const ineligible: IneligibleMemoryDraft[] = [];
  const seenDraftIds = new Set<string>();

  intakeDraft.drafts.forEach((draft) => {
    const validation = validateDraft({ draft, seenDraftIds });

    if (typeof validation === "string") {
      ineligible.push({ draft, reason: validation });
      return;
    }

    eligible.push(validation);
  });

  return { eligible, ineligible };
}
