import type { ConversationModePreference } from "./conversationPreferences";
import { runConversationPipeline } from "./conversationPipeline";
import { composePromptContext } from "./promptComposer";
import { extractCognitiveCandidates } from "./cognitiveExtraction";
import { validateCognitiveExtraction } from "./cognitiveValidation";
import { prepareMemoryCandidates } from "./memoryCandidates";
import { evaluateMemoryEligibility } from "./memoryEligibility";
import { prepareMemoryIntakeDrafts } from "./memoryIntakeDraft";
import { validateMemoryPipeline } from "./memoryPipelineValidation";
import { prepareMemoryPersistencePlan } from "./memoryPersistencePlan";
import { prepareMemoryRepositoryInputs } from "./memoryRepositoryInput";
import { createMemoryRecords } from "./memoryRecordFactory";
import { prepareMemoryReviewGate } from "./memoryReviewGate";
import { decideMemoryStorage } from "./memoryStorageDecision";
import { prepareMemoryStorageRequests } from "./memoryStorageRequest";
import { lookupExistingThoughts } from "./thoughtLookup";
import type { Thought } from "./thoughts";

const FIXTURE_CONVERSATION_MODE: ConversationModePreference = "automatica";

const FIXTURE_THOUGHTS: Thought[] = [
  {
    id: "thought_existing_context",
    text: "Sto osservando un altro filo.",
    createdAt: "2026-07-07T10:00:00.000Z",
    source: "chat",
    tags: ["Conversazione"],
  },
];

export const promptComposerFixture = composePromptContext({
  currentUserMessage: "Non so bene cosa sto cercando di capire.",
  recentConversation: [
    {
      role: "assistant",
      text: "Scrivi pure quello che vuoi osservare.",
    },
    {
      role: "user",
      text: "Mi chiedo da dove inizi questo filo.",
    },
  ],
  conversationMode: FIXTURE_CONVERSATION_MODE,
});

export const cognitiveExtractionFixture = extractCognitiveCandidates(promptComposerFixture);

export const cognitiveValidationFixture = validateCognitiveExtraction(cognitiveExtractionFixture);

export const memoryCandidateFixture = prepareMemoryCandidates(cognitiveValidationFixture);

export const memoryReviewGateFixture = prepareMemoryReviewGate(memoryCandidateFixture);

export const thoughtLookupFixture = lookupExistingThoughts({
  reviewGate: memoryReviewGateFixture,
  thoughts: FIXTURE_THOUGHTS,
});

export const memoryIntakeDraftFixture = prepareMemoryIntakeDrafts(thoughtLookupFixture);

export const memoryEligibilityFixture = evaluateMemoryEligibility(memoryIntakeDraftFixture);

export const memoryRecordFactoryFixture = createMemoryRecords(memoryEligibilityFixture);

export const memoryStorageDecisionFixture = decideMemoryStorage(memoryRecordFactoryFixture);

export const memoryStorageRequestFixture =
  prepareMemoryStorageRequests(memoryStorageDecisionFixture);

export const memoryRepositoryInputFixture =
  prepareMemoryRepositoryInputs(memoryStorageRequestFixture);

export const memoryPersistencePlanFixture =
  prepareMemoryPersistencePlan(memoryRepositoryInputFixture);

export const memoryPipelineValidationFixture = validateMemoryPipeline({
  memoryStorageDecision: memoryStorageDecisionFixture,
  memoryStorageRequest: memoryStorageRequestFixture,
  memoryRepositoryInput: memoryRepositoryInputFixture,
  memoryPersistencePlan: memoryPersistencePlanFixture,
});

const memoryRecordFixture = memoryRecordFactoryFixture.records[0];
const memoryStorageRequestRecordFixture = memoryStorageRequestFixture.requests[0];
const memoryRepositoryInputRecordFixture = memoryRepositoryInputFixture.inputs[0];
const memoryPersistencePlanRecordFixture = memoryPersistencePlanFixture.items[0];

export const memoryPipelineEndToEndValidationFixture = {
  recordReferencePreserved:
    !!memoryRecordFixture &&
    memoryStorageRequestRecordFixture?.payload.record === memoryRecordFixture &&
    memoryRepositoryInputRecordFixture?.input.record === memoryRecordFixture &&
    memoryPersistencePlanRecordFixture?.record === memoryRecordFixture,
  decisionReasonPreserved:
    !!memoryStorageRequestRecordFixture &&
    memoryRepositoryInputRecordFixture?.input.decisionReason ===
      memoryStorageRequestRecordFixture.decisionReason &&
    memoryPersistencePlanRecordFixture?.decisionReason ===
      memoryRepositoryInputRecordFixture?.input.decisionReason,
  repositoryInputPreserved:
    !!memoryRepositoryInputRecordFixture &&
    memoryPersistencePlanRecordFixture?.repositoryInput === memoryRepositoryInputRecordFixture,
};

export const conversationPipelineFixture = runConversationPipeline({
  currentUserMessage: promptComposerFixture.currentUserMessage,
  recentMessages: promptComposerFixture.recentConversation,
  conversationMode: promptComposerFixture.conversationMode,
  thoughts: FIXTURE_THOUGHTS,
});

export const cognitivePipelineBoundaryFixture = {
  conversationPipeline: conversationPipelineFixture,
  promptContext: promptComposerFixture,
  cognitiveExtraction: cognitiveExtractionFixture,
  cognitiveValidation: cognitiveValidationFixture,
  memoryCandidates: memoryCandidateFixture,
  memoryReviewGate: memoryReviewGateFixture,
  thoughtLookup: thoughtLookupFixture,
  memoryIntakeDraft: memoryIntakeDraftFixture,
  memoryEligibility: memoryEligibilityFixture,
  memoryRecordFactory: memoryRecordFactoryFixture,
  memoryStorageDecision: memoryStorageDecisionFixture,
  memoryStorageRequest: memoryStorageRequestFixture,
  memoryRepositoryInput: memoryRepositoryInputFixture,
  memoryPersistencePlan: memoryPersistencePlanFixture,
  memoryPipelineValidation: memoryPipelineValidationFixture,
  memoryPipelineEndToEndValidation: memoryPipelineEndToEndValidationFixture,
};

export const cognitivePipelineExpectedFixture = {
  currentUserMessage: "Non so bene cosa sto cercando di capire.",
  uncertaintyMarkerCount: 1,
  memoryCandidateCount: 1,
  readyForReviewCount: 1,
  matchedCandidateCount: 0,
  unmatchedCandidateCount: 1,
  memoryIntakeDraftCount: 1,
  memoryEligibleCount: 1,
  memoryRecordCount: 1,
  memoryStorageDecisionCount: 1,
  memoryStorageRequestCount: 1,
  memoryRepositoryInputCount: 1,
  memoryPersistencePlanCount: 1,
  memoryPipelineValidationStatus: "valid",
  memoryPipelineValidationIssueCount: 0,
  memoryPipelineRecordReferencePreserved: true,
  memoryPipelineDecisionReasonPreserved: true,
  memoryPipelineRepositoryInputPreserved: true,
};
