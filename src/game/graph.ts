import { isDeductionUnlocked, isReconstructionComplete } from "./engine";
import type {
  BoardEdge,
  BoardProjection,
  CaseDefinition,
  DeductionRule,
  GameState
} from "./types";

function confirmedEdge(rule: DeductionRule): BoardEdge {
  return {
    id: rule.id,
    fromEvidenceId: rule.fromEvidenceId,
    toEvidenceId: rule.toEvidenceId,
    label: rule.label,
    status: "CONFIRMED",
    critical: rule.critical
  };
}

export function projectBoard(
  definition: CaseDefinition,
  state: GameState
): BoardProjection {
  const rulesById = new Map(
    definition.deductionRules.map((rule) => [rule.id, rule] as const)
  );
  const seenConfirmedIds = new Set<string>();
  const confirmedEdges = state.confirmedDeductionIds.flatMap((deductionId) => {
    const rule = rulesById.get(deductionId);

    if (!rule || seenConfirmedIds.has(rule.id)) {
      return [];
    }

    seenConfirmedIds.add(rule.id);
    return [confirmedEdge(rule)];
  });
  const activeRule = state.activeHypothesis
    ? rulesById.get(state.activeHypothesis.id)
    : undefined;
  const activeHypothesis =
    activeRule &&
    state.activeHypothesis?.status === "HYPOTHESIS" &&
    activeRule.fromEvidenceId === state.activeHypothesis.fromEvidenceId &&
    activeRule.toEvidenceId === state.activeHypothesis.toEvidenceId
      ? {
          id: activeRule.id,
          fromEvidenceId: activeRule.fromEvidenceId,
          toEvidenceId: activeRule.toEvidenceId,
          label: activeRule.label,
          status: "HYPOTHESIS" as const,
          critical: activeRule.critical
        }
      : null;
  const criticalRule =
    definition.deductionRules.find((rule) => rule.critical) ?? null;
  const reconstructionComplete = isReconstructionComplete(definition, state);
  const relevantEvidenceIds = definition.evidenceCards
    .filter((card) => card.relevance === "CORE")
    .map((card) => card.id);
  const contextEvidenceIds = definition.evidenceCards
    .filter((card) => card.relevance === "CONTEXT")
    .map((card) => card.id);

  return {
    phase: state.phase,
    cards: definition.evidenceCards.map((card) => ({
      ...card,
      position: { ...card.position }
    })),
    timelineMarkers: definition.timelineMarkers.map((marker) => ({ ...marker })),
    edges: activeHypothesis
      ? [...confirmedEdges, activeHypothesis]
      : confirmedEdges,
    confirmedCount: confirmedEdges.length,
    totalDeductionCount: definition.deductionRules.length,
    criticalDeductionId: criticalRule?.id ?? null,
    criticalAvailable: Boolean(
      criticalRule &&
        isDeductionUnlocked(definition, state, criticalRule.id)
    ),
    criticalCompleted: Boolean(
      criticalRule && seenConfirmedIds.has(criticalRule.id)
    ),
    reconstructionComplete,
    answerRevealed:
      state.phase === "SOLVED" && state.lastConclusion?.result === "CORRECT",
    relevantEvidenceIds: [...relevantEvidenceIds],
    contextEvidenceIds: [...contextEvidenceIds],
    dimmedEvidenceIds: reconstructionComplete ? [...contextEvidenceIds] : [],
    lastConclusion: state.lastConclusion ? { ...state.lastConclusion } : null
  };
}
