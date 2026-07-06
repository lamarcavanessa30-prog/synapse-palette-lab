import type {
  CognitiveCandidate,
  CognitiveExtractionConfidence,
  CognitiveExtractionResult,
} from "./cognitiveExtraction";

export type CognitiveCandidateCategory = keyof CognitiveExtractionResult;

export type CognitiveValidationRejectionReason =
  | "empty_observation"
  | "duplicate_observation"
  | "confidence_below_threshold"
  | "malformed_candidate";

export type RejectedCognitiveCandidate = {
  category: CognitiveCandidateCategory;
  candidate: unknown;
  reason: CognitiveValidationRejectionReason;
};

export type CognitiveValidationResult = {
  accepted: CognitiveExtractionResult;
  rejected: RejectedCognitiveCandidate[];
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

const ACCEPTED_CONFIDENCE: CognitiveExtractionConfidence[] = ["medium", "high"];
const KNOWN_CONFIDENCE_VALUES = ["low", ...ACCEPTED_CONFIDENCE];

function createEmptyExtraction(): CognitiveExtractionResult {
  return {
    events: [],
    goals: [],
    preferences: [],
    relationships: [],
    recurringThemes: [],
    uncertaintyMarkers: [],
    safetyMarkers: [],
  };
}

function isCognitiveCandidate(candidate: unknown): candidate is CognitiveCandidate {
  if (!candidate || typeof candidate !== "object") return false;

  const value = candidate as CognitiveCandidate;
  return (
    !!value.evidence &&
    value.evidence.kind === "observed_text" &&
    typeof value.evidence.text === "string" &&
    (!value.inference ||
      (typeof value.inference.label === "string" &&
        KNOWN_CONFIDENCE_VALUES.includes(value.inference.confidence)))
  );
}

function getCandidateKey(candidate: CognitiveCandidate) {
  return `${candidate.evidence.kind}:${candidate.evidence.text.trim().toLowerCase()}`;
}

function validateCandidate(params: {
  candidate: unknown;
  seen: Set<string>;
}): CognitiveCandidate | CognitiveValidationRejectionReason {
  if (!isCognitiveCandidate(params.candidate)) return "malformed_candidate";

  const evidenceText = params.candidate.evidence.text.trim();
  if (!evidenceText) return "empty_observation";

  if (
    params.candidate.inference &&
    !ACCEPTED_CONFIDENCE.includes(params.candidate.inference.confidence)
  ) {
    return "confidence_below_threshold";
  }

  const candidateKey = getCandidateKey(params.candidate);
  if (params.seen.has(candidateKey)) return "duplicate_observation";

  params.seen.add(candidateKey);
  return params.candidate;
}

export function validateCognitiveExtraction(
  extraction: CognitiveExtractionResult,
): CognitiveValidationResult {
  const accepted = createEmptyExtraction();
  const rejected: RejectedCognitiveCandidate[] = [];

  CANDIDATE_CATEGORIES.forEach((category) => {
    const seen = new Set<string>();

    extraction[category].forEach((candidate) => {
      const validation = validateCandidate({ candidate, seen });

      if (typeof validation === "string") {
        rejected.push({ category, candidate, reason: validation });
        return;
      }

      accepted[category].push(validation);
    });
  });

  return { accepted, rejected };
}
