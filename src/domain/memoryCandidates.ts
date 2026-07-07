import type { CognitiveExtractionConfidence } from "./cognitiveExtraction";
import type {
  CognitiveCandidateCategory,
  CognitiveValidationRejectionReason,
  CognitiveValidationResult,
} from "./cognitiveValidation";

export type MemoryCandidateSource = "cognitive_validation";
export type MemoryCandidateStatus = "candidate";

export type MemoryCandidate = {
  id: string;
  source: MemoryCandidateSource;
  category: CognitiveCandidateCategory;
  observedText: string;
  inferredMeaning?: string;
  confidence: CognitiveExtractionConfidence | null;
  createdAt: null;
  status: MemoryCandidateStatus;
  rejectionReason: null;
  metadata: null;
};

export type SkippedMemoryCandidate = {
  category: CognitiveCandidateCategory;
  reason: "empty_observed_text" | "malformed_accepted_item";
  rejectionReason: CognitiveValidationRejectionReason | null;
};

export type MemoryCandidateResult = {
  candidates: MemoryCandidate[];
  skipped: SkippedMemoryCandidate[];
};

const CANDIDATE_CATEGORIES: CognitiveCandidateCategory[] = [
  "events",
  "goals",
  "preferences",
  "relationships",
  "recurringThemes",
  "uncertaintyMarkers",
  "safetyMarkers",
];

function createCandidateId(category: CognitiveCandidateCategory, index: number) {
  return `memory_candidate_${category}_${index}`;
}

export function prepareMemoryCandidates(validation: CognitiveValidationResult): MemoryCandidateResult {
  const candidates: MemoryCandidate[] = [];
  const skipped: SkippedMemoryCandidate[] = [];

  CANDIDATE_CATEGORIES.forEach((category) => {
    validation.accepted[category].forEach((candidate, index) => {
      if (!candidate?.evidence || candidate.evidence.kind !== "observed_text") {
        skipped.push({ category, reason: "malformed_accepted_item", rejectionReason: null });
        return;
      }

      const observedText = candidate.evidence.text.trim();
      if (!observedText) {
        skipped.push({ category, reason: "empty_observed_text", rejectionReason: null });
        return;
      }

      candidates.push({
        id: createCandidateId(category, index),
        source: "cognitive_validation",
        category,
        observedText,
        inferredMeaning: candidate.inference?.label,
        confidence: candidate.inference?.confidence ?? null,
        createdAt: null,
        status: "candidate",
        rejectionReason: null,
        metadata: null,
      });
    });
  });

  return { candidates, skipped };
}
