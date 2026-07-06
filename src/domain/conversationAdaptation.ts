export type ConversationDepthId = "ascolto" | "riflessione" | "esplorazione" | "autoanalisi" | "specchio";

export type AdaptationSignals = {
  wordCount: number;
  emotionalVocabulary: number;
  reflectiveVocabulary: number;
  narrativeVocabulary: number;
  connectedIdeas: number;
  questionCount: number;
  recentMessageCount: number;
};

export type AdaptationResult = {
  suggestedDepth: ConversationDepthId;
  nextDepth: ConversationDepthId;
  signals: AdaptationSignals;
  rationale: string;
};

const DEPTH_ORDER: ConversationDepthId[] = [
  "ascolto",
  "riflessione",
  "esplorazione",
  "autoanalisi",
  "specchio",
];

const EMOTIONAL_TERMS = [
  "ansia",
  "ansiosa",
  "paura",
  "triste",
  "stanca",
  "rabbia",
  "arrabbiata",
  "sola",
  "confusa",
  "ferita",
  "giudicata",
  "sopraffatta",
  "vuota",
  "pesante",
  "tensione",
  "fragile",
  "preoccupata",
];

const REFLECTIVE_TERMS = [
  "mi accorgo",
  "mi sono accorta",
  "noto",
  "mi chiedo",
  "capisco",
  "realizzo",
  "sempre",
  "spesso",
  "tendo",
  "reagisco",
  "schema",
  "pattern",
  "forse",
  "perche",
  "perché",
  "mi sembra",
];

const NARRATIVE_TERMS = [
  "ripensandoci",
  "adolescenza",
  "infanzia",
  "passato",
  "anni",
  "fin da",
  "da quando",
  "nel tempo",
  "storia",
  "famiglia",
  "relazione",
  "ricordo",
  "prima",
  "dopo",
];

const CONNECTOR_TERMS = [
  "perche",
  "perché",
  "quando",
  "mentre",
  "quindi",
  "pero",
  "però",
  "invece",
  "anche",
  "da una parte",
  "dall'altra",
  "allo stesso tempo",
  "fin da",
];

// TODO: Enrich or replace these heuristics with the future conversation reasoning engine.
function countMatches(text: string, terms: string[]) {
  return terms.reduce((total, term) => (text.includes(term) ? total + 1 : total), 0);
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function stepTowardDepth(currentDepth: ConversationDepthId, suggestedDepth: ConversationDepthId) {
  const currentIndex = DEPTH_ORDER.indexOf(currentDepth);
  const suggestedIndex = DEPTH_ORDER.indexOf(suggestedDepth);

  if (currentIndex === -1 || suggestedIndex === -1 || currentIndex === suggestedIndex) {
    return currentDepth;
  }

  const direction = suggestedIndex > currentIndex ? 1 : -1;
  return DEPTH_ORDER[currentIndex + direction];
}

function chooseSuggestedDepth(signals: AdaptationSignals): ConversationDepthId {
  const reflectiveWeight = signals.reflectiveVocabulary + signals.questionCount;
  const narrativeWeight = signals.narrativeVocabulary + signals.connectedIdeas;

  if (signals.wordCount <= 6 && signals.emotionalVocabulary > 0 && reflectiveWeight === 0) {
    return "ascolto";
  }

  if (
    signals.wordCount >= 65 &&
    reflectiveWeight >= 3 &&
    narrativeWeight >= 4 &&
    signals.recentMessageCount >= 3
  ) {
    return "autoanalisi";
  }

  if (signals.narrativeVocabulary >= 2 || narrativeWeight >= 4 || signals.wordCount >= 42) {
    return "esplorazione";
  }

  if (signals.reflectiveVocabulary >= 1 || signals.questionCount > 0 || signals.connectedIdeas >= 2) {
    return "riflessione";
  }

  return "ascolto";
}

export function analyzeConversationDepth(params: {
  message: string;
  recentUserMessages: string[];
  currentDepth: ConversationDepthId;
}): AdaptationResult {
  const normalized = params.message.toLowerCase();
  const signals: AdaptationSignals = {
    wordCount: countWords(params.message),
    emotionalVocabulary: countMatches(normalized, EMOTIONAL_TERMS),
    reflectiveVocabulary: countMatches(normalized, REFLECTIVE_TERMS),
    narrativeVocabulary: countMatches(normalized, NARRATIVE_TERMS),
    connectedIdeas: countMatches(normalized, CONNECTOR_TERMS),
    questionCount: (params.message.match(/\?/g) ?? []).length,
    recentMessageCount: params.recentUserMessages.length,
  };

  const suggestedDepth = chooseSuggestedDepth(signals);
  const nextDepth = stepTowardDepth(params.currentDepth, suggestedDepth);

  return {
    suggestedDepth,
    nextDepth,
    signals,
    rationale:
      nextDepth === params.currentDepth
        ? "La profondità attuale è coerente con il modo in cui l'utente sta scrivendo."
        : "La conversazione si muove di un solo livello verso la profondità suggerita.",
  };
}
