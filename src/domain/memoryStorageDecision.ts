import type { MemoryOrigin, MemoryReviewState, MemoryStatus } from "./memoryContracts";
import type {
  MemoryRecordDraft,
  MemoryRecordFactoryResult,
} from "./memoryRecordFactory";

export type MemoryStorageDecisionStatus =
  | "ready_for_future_persistence"
  | "requires_user_review"
  | "pending"
  | "skipped";

export type MemoryStorageApprovalMode =
  | "manual_review"
  | "system_structural_check"
  | "none";

export type MemoryStorageDecisionReason =
  | "valid_record_requires_user_review"
  | "malformed_record"
  | "empty_observed_text"
  | "missing_confidence"
  | "unsupported_status"
  | "unsupported_review_state"
  | "unsupported_origin"
  | "upstream_skipped_draft";

export type MemoryStorageDecision = {
  draft: MemoryRecordDraft;
  status: Exclude<MemoryStorageDecisionStatus, "skipped">;
  reason: MemoryStorageDecisionReason;
  approvalMode: Exclude<MemoryStorageApprovalMode, "none">;
};

export type SkippedMemoryStorageDecision = {
  draft: unknown;
  status: Extract<MemoryStorageDecisionStatus, "skipped">;
  reason: MemoryStorageDecisionReason;
  approvalMode: Extract<MemoryStorageApprovalMode, "none">;
};

export type MemoryStorageDecisionResult = {
  decisions: MemoryStorageDecision[];
  skipped: SkippedMemoryStorageDecision[];
};

const SUPPORTED_STATUS: MemoryStatus = "candidate";
const SUPPORTED_REVIEW_STATE: MemoryReviewState = "unreviewed";
const SUPPORTED_ORIGIN_SOURCE: MemoryOrigin["source"] = "cognitive_candidate";

function isMemoryRecordDraft(draft: unknown): draft is MemoryRecordDraft {
  if (!draft || typeof draft !== "object") return false;

  const value = draft as Partial<MemoryRecordDraft>;
  return (
    typeof value.id === "string" &&
    value.source === SUPPORTED_ORIGIN_SOURCE &&
    typeof value.category === "string" &&
    typeof value.observedText === "string" &&
    (value.confidence === "medium" ||
      value.confidence === "high" ||
      value.confidence === null) &&
    !!value.origin &&
    typeof value.origin === "object" &&
    value.createdAt === null &&
    value.updatedAt === null &&
    value.metadata === null
  );
}

function validateStorageDraft(
  draft: unknown,
): MemoryRecordDraft | MemoryStorageDecisionReason {
  if (!isMemoryRecordDraft(draft)) return "malformed_record";
  if (!draft.observedText.trim()) return "empty_observed_text";
  if (!draft.confidence) return "missing_confidence";
  if (draft.status !== SUPPORTED_STATUS) return "unsupported_status";
  if (draft.reviewState !== SUPPORTED_REVIEW_STATE) return "unsupported_review_state";
  if (
    draft.origin.source !== SUPPORTED_ORIGIN_SOURCE ||
    typeof draft.origin.sourceId !== "string"
  ) {
    return "unsupported_origin";
  }

  return draft;
}

function createRequiresReviewDecision(draft: MemoryRecordDraft): MemoryStorageDecision {
  return {
    draft,
    status: "requires_user_review",
    reason: "valid_record_requires_user_review",
    approvalMode: "manual_review",
  };
}

function createSkippedDecision(params: {
  draft: unknown;
  reason: MemoryStorageDecisionReason;
}): SkippedMemoryStorageDecision {
  return {
    draft: params.draft,
    status: "skipped",
    reason: params.reason,
    approvalMode: "none",
  };
}

export function decideMemoryStorage(
  factory: MemoryRecordFactoryResult,
): MemoryStorageDecisionResult {
  const decisions: MemoryStorageDecision[] = [];
  const skipped: SkippedMemoryStorageDecision[] = factory.skipped.map(({ draft }) =>
    createSkippedDecision({ draft, reason: "upstream_skipped_draft" }),
  );

  factory.records.forEach((draft) => {
    const validation = validateStorageDraft(draft);

    if (typeof validation === "string") {
      skipped.push(createSkippedDecision({ draft, reason: validation }));
      return;
    }

    decisions.push(createRequiresReviewDecision(validation));
  });

  return { decisions, skipped };
}
