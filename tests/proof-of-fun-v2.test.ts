import { describe, expect, it } from "vitest";

import { case01 } from "../src/cases/case01";
import {
  createInitialState,
  getUnlockedDeductionIds,
  isDeductionUnlocked,
  isReconstructionComplete,
  transition
} from "../src/game/engine";
import { projectBoard } from "../src/game/graph";
import type { DeductionId, GameState } from "../src/game/types";

const progression = [
  "failure-caused-response",
  "response-led-to-access",
  "access-led-to-e17-removal",
  "emergency-caused-missed-record",
  "e17-powered-stabilization"
] as const;

function confirmDeduction(
  state: GameState,
  deductionId: DeductionId
): GameState {
  const rule = case01.deductionRules.find(
    (candidate) => candidate.id === deductionId
  );

  if (!rule) {
    throw new Error(`Unknown deduction rule: ${deductionId}`);
  }

  const proposed = transition(case01, state, {
    type: "PROPOSE_DEDUCTION",
    causeEvidenceId: rule.fromEvidenceId,
    resultEvidenceId: rule.toEvidenceId
  });
  const confirmed = transition(case01, proposed.state, {
    type: "CONFIRM_DEDUCTION"
  });

  return confirmed.state;
}

function reconstructIncident(): GameState {
  return progression.reduce<GameState>(
    (state, deductionId) => confirmDeduction(state, deductionId),
    createInitialState()
  );
}

describe("Proof of Fun v2 deterministic reconstruction", () => {
  it("starts with seven visible evidence cards and no canonical deduction", () => {
    const state = createInitialState();
    const projection = projectBoard(case01, state);

    expect(state).toEqual({
      phase: "RECONSTRUCTING",
      activeHypothesis: null,
      confirmedDeductionIds: [],
      lastConclusion: null
    });
    expect(projection.cards).toHaveLength(7);
    expect(projection.edges).toEqual([]);
    expect(projection.confirmedCount).toBe(0);
    expect(projection.totalDeductionCount).toBe(5);
    expect(projection.contextEvidenceIds).toEqual(["inventory-0850"]);
    expect(projection.dimmedEvidenceIds).toEqual([]);
    expect(
      projection.cards.find((card) => card.id === "e17-missing")
    ).toMatchObject({
      title: "E-17 보관 이탈",
      time: "09:42 이후"
    });
  });

  it("creates a dotted hypothesis for a valid ordered causal deduction", () => {
    const result = transition(case01, createInitialState(), {
      type: "PROPOSE_DEDUCTION",
      causeEvidenceId: "generator-failure-0937",
      resultEvidenceId: "jun-emergency-response"
    });

    expect(result.state.activeHypothesis).toEqual({
      id: "failure-caused-response",
      fromEvidenceId: "generator-failure-0937",
      toEvidenceId: "jun-emergency-response",
      label: "긴급 대응 유발",
      status: "HYPOTHESIS",
      critical: false
    });
    expect(result.state.confirmedDeductionIds).toEqual([]);
    expect(projectBoard(case01, result.state).edges).toEqual([
      expect.objectContaining({
        id: "failure-caused-response",
        status: "HYPOTHESIS"
      })
    ]);
  });

  it("rejects a plausible theft deduction without mutating state", () => {
    const state = createInitialState();
    const result = transition(case01, state, {
      type: "PROPOSE_DEDUCTION",
      causeEvidenceId: "jun-emergency-response",
      resultEvidenceId: "e17-missing"
    });

    expect(result.state).toBe(state);
    expect(result.effects).toEqual([
      {
        type: "INVALID_DEDUCTION",
        evidenceIds: ["jun-emergency-response", "e17-missing"]
      }
    ]);
    expect(projectBoard(case01, result.state).edges).toEqual([]);
  });

  it("does not silently reverse an otherwise valid causal pair", () => {
    const state = createInitialState();
    const result = transition(case01, state, {
      type: "PROPOSE_DEDUCTION",
      causeEvidenceId: "jun-emergency-response",
      resultEvidenceId: "generator-failure-0937"
    });

    expect(result.state).toBe(state);
    expect(result.effects).toEqual([
      {
        type: "INVALID_DEDUCTION",
        evidenceIds: [
          "jun-emergency-response",
          "generator-failure-0937"
        ]
      }
    ]);
  });

  it("keeps duplicate proposed and confirmed deductions idempotent", () => {
    const first = transition(case01, createInitialState(), {
      type: "PROPOSE_DEDUCTION",
      causeEvidenceId: "generator-failure-0937",
      resultEvidenceId: "jun-emergency-response"
    });
    const duplicateHypothesis = transition(case01, first.state, {
      type: "PROPOSE_DEDUCTION",
      causeEvidenceId: "generator-failure-0937",
      resultEvidenceId: "jun-emergency-response"
    });

    expect(duplicateHypothesis.state).toBe(first.state);
    expect(duplicateHypothesis.effects).toEqual([
      {
        type: "HYPOTHESIS_ALREADY_EXISTS",
        deductionId: "failure-caused-response"
      }
    ]);

    const confirmed = transition(case01, first.state, {
      type: "CONFIRM_DEDUCTION"
    });
    const duplicateConfirmed = transition(case01, confirmed.state, {
      type: "PROPOSE_DEDUCTION",
      causeEvidenceId: "generator-failure-0937",
      resultEvidenceId: "jun-emergency-response"
    });

    expect(duplicateConfirmed.state).toBe(confirmed.state);
    expect(duplicateConfirmed.state.confirmedDeductionIds).toEqual([
      "failure-caused-response"
    ]);
    expect(duplicateConfirmed.effects).toEqual([
      {
        type: "DEDUCTION_ALREADY_CONFIRMED",
        deductionId: "failure-caused-response"
      }
    ]);
  });

  it("preserves the order in which causal deductions are confirmed", () => {
    let state = createInitialState();

    for (const deductionId of progression.slice(0, 4)) {
      state = confirmDeduction(state, deductionId);
    }

    expect(state.phase).toBe("RECONSTRUCTING");
    expect(state.confirmedDeductionIds).toEqual(progression.slice(0, 4));
    expect(projectBoard(case01, state).edges.map((edge) => edge.id)).toEqual(
      progression.slice(0, 4)
    );
  });

  it("keeps the critical relationship locked until all four prior deductions", () => {
    const initial = createInitialState();
    const locked = transition(case01, initial, {
      type: "PROPOSE_DEDUCTION",
      causeEvidenceId: "e17-missing",
      resultEvidenceId: "system-stabilized-0948"
    });

    expect(locked.state).toBe(initial);
    expect(locked.effects).toEqual([
      {
        type: "DEDUCTION_LOCKED",
        deductionId: "e17-powered-stabilization"
      }
    ]);
    expect(
      isDeductionUnlocked(case01, initial, "e17-powered-stabilization")
    ).toBe(false);

    const beforeCritical = progression.slice(0, 4).reduce<GameState>(
      (state, deductionId) => confirmDeduction(state, deductionId),
      initial
    );

    expect(
      isDeductionUnlocked(
        case01,
        beforeCritical,
        "e17-powered-stabilization"
      )
    ).toBe(true);
    expect(getUnlockedDeductionIds(case01, beforeCritical)).toEqual([
      "e17-powered-stabilization"
    ]);
    expect(projectBoard(case01, beforeCritical).criticalAvailable).toBe(true);
  });

  it("enters conclusion only after the fifth critical deduction is confirmed", () => {
    const state = reconstructIncident();
    const projection = projectBoard(case01, state);

    expect(state.phase).toBe("CONCLUSION");
    expect(state.activeHypothesis).toBeNull();
    expect(state.confirmedDeductionIds).toEqual(progression);
    expect(isReconstructionComplete(case01, state)).toBe(true);
    expect(projection.confirmedCount).toBe(5);
    expect(projection.criticalCompleted).toBe(true);
    expect(projection.reconstructionComplete).toBe(true);
    expect(projection.answerRevealed).toBe(false);
    expect(projection.dimmedEvidenceIds).toEqual(["inventory-0850"]);
  });

  it("solves only after the supported conclusion is submitted", () => {
    const reconstructed = reconstructIncident();
    const solved = transition(case01, reconstructed, {
      type: "SUBMIT_CONCLUSION",
      conclusionId: "conclusion-emergency-use"
    });

    expect(solved.state.phase).toBe("SOLVED");
    expect(solved.state.lastConclusion).toEqual({
      conclusionId: "conclusion-emergency-use",
      result: "CORRECT"
    });
    expect(solved.effects).toEqual([
      {
        type: "CASE_SOLVED",
        conclusionId: "conclusion-emergency-use"
      }
    ]);
    expect(projectBoard(case01, solved.state).answerRevealed).toBe(true);
  });

  it("keeps an incorrect conclusion in conclusion phase without revealing the answer", () => {
    const reconstructed = reconstructIncident();
    const incorrect = transition(case01, reconstructed, {
      type: "SUBMIT_CONCLUSION",
      conclusionId: "conclusion-theft"
    });
    const projection = projectBoard(case01, incorrect.state);

    expect(incorrect.state.phase).toBe("CONCLUSION");
    expect(incorrect.state.lastConclusion).toEqual({
      conclusionId: "conclusion-theft",
      result: "INCORRECT"
    });
    expect(incorrect.effects).toEqual([
      { type: "CONCLUSION_REJECTED", conclusionId: "conclusion-theft" }
    ]);
    expect(projection.reconstructionComplete).toBe(true);
    expect(projection.answerRevealed).toBe(false);
  });

  it("blocks a premature conclusion without mutating reconstruction state", () => {
    const state = createInitialState();
    const result = transition(case01, state, {
      type: "SUBMIT_CONCLUSION",
      conclusionId: "conclusion-emergency-use"
    });

    expect(result.state).toBe(state);
    expect(result.effects).toEqual([{ type: "CONCLUSION_LOCKED" }]);
  });

  it("resets solved play to the same fresh deterministic state", () => {
    const reconstructed = reconstructIncident();
    const solved = transition(case01, reconstructed, {
      type: "SUBMIT_CONCLUSION",
      conclusionId: "conclusion-emergency-use"
    });
    const firstReset = transition(case01, solved.state, { type: "RESET" });
    const secondReset = transition(case01, solved.state, { type: "RESET" });

    expect(firstReset.state).toEqual(createInitialState());
    expect(firstReset.state).toEqual(secondReset.state);
    expect(firstReset.state).not.toBe(secondReset.state);
    expect(firstReset.state.confirmedDeductionIds).not.toBe(
      secondReset.state.confirmedDeductionIds
    );
    expect(firstReset.effects).toEqual([{ type: "RESET" }]);
  });

  it("isolates presentation mutations from authored data and canonical state", () => {
    const proposed = transition(case01, createInitialState(), {
      type: "PROPOSE_DEDUCTION",
      causeEvidenceId: "generator-failure-0937",
      resultEvidenceId: "jun-emergency-response"
    });
    const projection = projectBoard(case01, proposed.state);

    projection.cards[0].title = "변조됨";
    projection.cards[0].position.x = -1;
    projection.timelineMarkers[0].label = "변조됨";
    projection.edges[0].status = "CONFIRMED";
    projection.relevantEvidenceIds.length = 0;
    projection.contextEvidenceIds.length = 0;

    expect(case01.evidenceCards[0].title).toBe("08:50 재고 확인");
    expect(case01.evidenceCards[0].position.x).toBe(60);
    expect(case01.timelineMarkers[0].label).toBe("재고 확인");
    expect(proposed.state.activeHypothesis?.status).toBe("HYPOTHESIS");
    expect(projectBoard(case01, proposed.state)).toMatchObject({
      confirmedCount: 0,
      relevantEvidenceIds: expect.arrayContaining(["generator-failure-0937"]),
      contextEvidenceIds: ["inventory-0850"],
      edges: [expect.objectContaining({ status: "HYPOTHESIS" })]
    });
  });
});
