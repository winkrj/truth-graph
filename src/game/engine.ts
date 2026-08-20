import type {
  CaseDefinition,
  DeductionRule,
  GameCommand,
  GameState,
  RuntimeDeduction,
  TransitionResult
} from "./types";

export function createInitialState(): GameState {
  return {
    phase: "RECONSTRUCTING",
    activeHypothesis: null,
    confirmedDeductionIds: [],
    lastConclusion: null
  };
}

function hasConfirmed(state: GameState, deductionId: string): boolean {
  return state.confirmedDeductionIds.includes(deductionId);
}

function hasPrerequisites(rule: DeductionRule, state: GameState): boolean {
  return rule.requiresConfirmedDeductionIds.every((deductionId) =>
    hasConfirmed(state, deductionId)
  );
}

function findOrderedRule(
  definition: CaseDefinition,
  causeEvidenceId: string,
  resultEvidenceId: string
): DeductionRule | undefined {
  return definition.deductionRules.find(
    (rule) =>
      rule.fromEvidenceId === causeEvidenceId &&
      rule.toEvidenceId === resultEvidenceId
  );
}

function hypothesisFromRule(rule: DeductionRule): RuntimeDeduction {
  return {
    id: rule.id,
    fromEvidenceId: rule.fromEvidenceId,
    toEvidenceId: rule.toEvidenceId,
    label: rule.label,
    status: "HYPOTHESIS",
    critical: rule.critical
  };
}

function activeRule(
  definition: CaseDefinition,
  state: GameState
): DeductionRule | undefined {
  const hypothesis = state.activeHypothesis;

  if (!hypothesis || hypothesis.status !== "HYPOTHESIS") {
    return undefined;
  }

  return definition.deductionRules.find(
    (rule) =>
      rule.id === hypothesis.id &&
      rule.fromEvidenceId === hypothesis.fromEvidenceId &&
      rule.toEvidenceId === hypothesis.toEvidenceId &&
      rule.label === hypothesis.label &&
      rule.critical === hypothesis.critical
  );
}

export function isDeductionUnlocked(
  definition: CaseDefinition,
  state: GameState,
  deductionId: string
): boolean {
  if (state.phase !== "RECONSTRUCTING" || hasConfirmed(state, deductionId)) {
    return false;
  }

  const rule = definition.deductionRules.find(
    (candidate) => candidate.id === deductionId
  );

  return Boolean(rule && hasPrerequisites(rule, state));
}

export function getUnlockedDeductionIds(
  definition: CaseDefinition,
  state: GameState
): string[] {
  return definition.deductionRules
    .filter((rule) => isDeductionUnlocked(definition, state, rule.id))
    .map((rule) => rule.id);
}

export function isReconstructionComplete(
  definition: CaseDefinition,
  state: GameState
): boolean {
  return definition.deductionRules.every((rule) => hasConfirmed(state, rule.id));
}

export function transition(
  definition: CaseDefinition,
  state: GameState,
  command: GameCommand
): TransitionResult {
  switch (command.type) {
    case "PROPOSE_DEDUCTION": {
      const rule = findOrderedRule(
        definition,
        command.causeEvidenceId,
        command.resultEvidenceId
      );

      if (!rule || state.phase !== "RECONSTRUCTING") {
        return {
          state,
          effects: [
            {
              type: "INVALID_DEDUCTION",
              evidenceIds: [command.causeEvidenceId, command.resultEvidenceId]
            }
          ]
        };
      }

      if (hasConfirmed(state, rule.id)) {
        return {
          state,
          effects: [
            { type: "DEDUCTION_ALREADY_CONFIRMED", deductionId: rule.id }
          ]
        };
      }

      if (state.activeHypothesis?.id === rule.id) {
        return {
          state,
          effects: [
            { type: "HYPOTHESIS_ALREADY_EXISTS", deductionId: rule.id }
          ]
        };
      }

      if (state.activeHypothesis) {
        return {
          state,
          effects: [
            {
              type: "ACTIVE_HYPOTHESIS_EXISTS",
              deductionId: state.activeHypothesis.id
            }
          ]
        };
      }

      if (!hasPrerequisites(rule, state)) {
        return {
          state,
          effects: [{ type: "DEDUCTION_LOCKED", deductionId: rule.id }]
        };
      }

      return {
        state: {
          ...state,
          activeHypothesis: hypothesisFromRule(rule)
        },
        effects: [{ type: "HYPOTHESIS_CREATED", deductionId: rule.id }]
      };
    }

    case "CONFIRM_DEDUCTION": {
      const rule = activeRule(definition, state);

      if (!rule) {
        return { state, effects: [{ type: "NOTHING_TO_CONFIRM" }] };
      }

      if (
        state.phase !== "RECONSTRUCTING" ||
        hasConfirmed(state, rule.id) ||
        !hasPrerequisites(rule, state)
      ) {
        return {
          state,
          effects: [{ type: "DEDUCTION_LOCKED", deductionId: rule.id }]
        };
      }

      const nextConfirmedDeductionIds = [
        ...state.confirmedDeductionIds,
        rule.id
      ];
      const reconstructionComplete = definition.deductionRules.every(
        (candidate) => nextConfirmedDeductionIds.includes(candidate.id)
      );

      return {
        state: {
          ...state,
          phase: reconstructionComplete ? "CONCLUSION" : "RECONSTRUCTING",
          activeHypothesis: null,
          confirmedDeductionIds: nextConfirmedDeductionIds,
          lastConclusion: null
        },
        effects: reconstructionComplete
          ? [
              { type: "HYPOTHESIS_CONFIRMED", deductionId: rule.id },
              { type: "RECONSTRUCTION_COMPLETE", deductionId: rule.id }
            ]
          : [{ type: "HYPOTHESIS_CONFIRMED", deductionId: rule.id }]
      };
    }

    case "DISCARD_HYPOTHESIS": {
      if (!state.activeHypothesis) {
        return { state, effects: [{ type: "NOTHING_TO_DISCARD" }] };
      }

      return {
        state: {
          ...state,
          activeHypothesis: null
        },
        effects: [
          {
            type: "HYPOTHESIS_DISCARDED",
            deductionId: state.activeHypothesis.id
          }
        ]
      };
    }

    case "SUBMIT_CONCLUSION": {
      if (state.phase === "SOLVED") {
        return { state, effects: [{ type: "CASE_ALREADY_SOLVED" }] };
      }

      if (
        state.phase !== "CONCLUSION" ||
        !isReconstructionComplete(definition, state)
      ) {
        return { state, effects: [{ type: "CONCLUSION_LOCKED" }] };
      }

      const conclusion = definition.conclusions.find(
        (candidate) => candidate.id === command.conclusionId
      );

      if (!conclusion) {
        return {
          state,
          effects: [
            {
              type: "INVALID_CONCLUSION",
              conclusionId: command.conclusionId
            }
          ]
        };
      }

      if (conclusion.id !== definition.solution.correctConclusionId) {
        const repeatedIncorrect =
          state.lastConclusion?.conclusionId === conclusion.id &&
          state.lastConclusion.result === "INCORRECT";

        return {
          state: repeatedIncorrect
            ? state
            : {
                ...state,
                lastConclusion: {
                  conclusionId: conclusion.id,
                  result: "INCORRECT"
                }
              },
          effects: [
            { type: "CONCLUSION_REJECTED", conclusionId: conclusion.id }
          ]
        };
      }

      return {
        state: {
          ...state,
          phase: "SOLVED",
          lastConclusion: {
            conclusionId: conclusion.id,
            result: "CORRECT"
          }
        },
        effects: [{ type: "CASE_SOLVED", conclusionId: conclusion.id }]
      };
    }

    case "RESET":
      return {
        state: createInitialState(),
        effects: [{ type: "RESET" }]
      };
  }
}
