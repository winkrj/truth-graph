import { describe, expect, it } from "vitest";

import { case01 } from "../src/cases/case01";
import { createInitialState, getLocksOpened, transition } from "../src/game/engine";
import { projectCase } from "../src/game/projection";
import type { GameCommand, GameState, TransitionResult } from "../src/game/types";

function run(state: GameState, command: GameCommand): TransitionResult {
  return transition(case01, state, command);
}

function solveThermal(state = createInitialState()): GameState {
  let next = run(state, { type: "OPEN_PUZZLE", puzzleId: "thermal-scan" }).state;
  next = run(next, {
    type: "SCAN_THERMAL_CELL",
    puzzleId: "thermal-scan",
    cellId: "b3"
  }).state;
  return run(next, {
    type: "SUBMIT_THERMAL",
    puzzleId: "thermal-scan",
    cellId: "b3"
  }).state;
}

function solveMessage(state = createInitialState()): GameState {
  let next = run(state, { type: "OPEN_PUZZLE", puzzleId: "message-recovery" }).state;
  return run(next, {
    type: "SUBMIT_MESSAGE_ORDER",
    puzzleId: "message-recovery",
    fragmentIds: ["fragment-warning", "fragment-red", "fragment-seven"]
  }).state;
}

function solveFirstClues(state = createInitialState()): GameState {
  return solveMessage(solveThermal(state));
}

function solveProtocol(state = solveFirstClues()): GameState {
  let next = run(state, { type: "OPEN_PUZZLE", puzzleId: "protocol-overlay" }).state;
  return run(next, {
    type: "SUBMIT_PROTOCOL",
    puzzleId: "protocol-overlay",
    rule: 7,
    threshold: 80
  }).state;
}

function solveCase(state = solveProtocol()): GameState {
  let next = run(state, { type: "OPEN_PUZZLE", puzzleId: "route-trace" }).state;
  return run(next, {
    type: "SUBMIT_ROUTE",
    puzzleId: "route-trace",
    nodeIds: ["team-table", "west-reader", "b3"]
  }).state;
}

describe("Core Fun Candidate 03 deterministic escape chain", () => {
  it("starts with two available objects, two locked objects, hidden readings, and three closed locks", () => {
    const projection = projectCase(case01, createInitialState());

    expect(projection.phase).toBe("SEARCHING");
    expect(projection.locksOpened).toBe(0);
    expect(projection.lockerOpen).toBe(false);
    expect(projection.rewards).toEqual([]);
    expect(projection.conclusion).toBeNull();
    expect(projection.puzzles.map((puzzle) => [puzzle.id, puzzle.status])).toEqual([
      ["thermal-scan", "AVAILABLE"],
      ["message-recovery", "AVAILABLE"],
      ["protocol-overlay", "LOCKED"],
      ["route-trace", "LOCKED"]
    ]);
    const thermal = projection.puzzles[0];
    expect(thermal.kind).toBe("THERMAL_SCAN");
    if (thermal.kind === "THERMAL_SCAN") {
      expect(thermal.cells.every((cell) => cell.reading === null)).toBe(true);
    }
    const protocol = projection.puzzles.find((puzzle) => puzzle.id === "protocol-overlay");
    const route = projection.puzzles.find((puzzle) => puzzle.id === "route-trace");
    if (protocol?.kind === "PROTOCOL_DIAL") {
      expect(protocol.ruleOptions).toEqual([]);
      expect(protocol.thresholdOptions).toEqual([]);
    }
    if (route?.kind === "ROUTE_TRACE") {
      expect(route.nodes).toEqual([]);
      expect(route.connections).toEqual([]);
    }
  });

  it("rejects an unknown puzzle without changing state", () => {
    const initial = createInitialState();
    const result = run(initial, { type: "OPEN_PUZZLE", puzzleId: "missing" });

    expect(result.state).toBe(initial);
    expect(result.effects).toEqual([{ type: "INVALID_PUZZLE", puzzleId: "missing" }]);
  });

  it("locks the protocol puzzle until both source clues are solved", () => {
    const initial = createInitialState();
    const result = run(initial, { type: "OPEN_PUZZLE", puzzleId: "protocol-overlay" });

    expect(result.state).toBe(initial);
    expect(result.effects).toEqual([
      {
        type: "PUZZLE_LOCKED",
        puzzleId: "protocol-overlay",
        missingPuzzleIds: ["thermal-scan", "message-recovery"]
      }
    ]);
  });

  it("opens and closes a puzzle without changing solved progress", () => {
    const initial = createInitialState();
    const opened = run(initial, { type: "OPEN_PUZZLE", puzzleId: "thermal-scan" });
    const closed = run(opened.state, { type: "CLOSE_PUZZLE" });

    expect(opened.state.activePuzzleId).toBe("thermal-scan");
    expect(closed.state).toEqual(initial);
    expect(closed.effects).toEqual([{ type: "PUZZLE_CLOSED", puzzleId: "thermal-scan" }]);
  });

  it("prevents opening another object while a puzzle is active", () => {
    const opened = run(createInitialState(), {
      type: "OPEN_PUZZLE",
      puzzleId: "thermal-scan"
    });
    const result = run(opened.state, {
      type: "OPEN_PUZZLE",
      puzzleId: "message-recovery"
    });

    expect(result.state).toBe(opened.state);
    expect(result.effects).toEqual([
      { type: "ANOTHER_PUZZLE_OPEN", puzzleId: "thermal-scan" }
    ]);
  });

  it("reveals only thermal cells that the player scanned", () => {
    let state = run(createInitialState(), {
      type: "OPEN_PUZZLE",
      puzzleId: "thermal-scan"
    }).state;
    state = run(state, {
      type: "SCAN_THERMAL_CELL",
      puzzleId: "thermal-scan",
      cellId: "a2"
    }).state;
    const projection = projectCase(case01, state);
    const thermal = projection.activePuzzle;

    expect(thermal?.kind).toBe("THERMAL_SCAN");
    if (thermal?.kind === "THERMAL_SCAN") {
      expect(thermal.cells.find((cell) => cell.id === "a2")?.reading).toBe(63);
      expect(thermal.cells.find((cell) => cell.id === "b3")?.reading).toBeNull();
    }
  });

  it("does not accept an unscanned thermal cell", () => {
    const state = run(createInitialState(), {
      type: "OPEN_PUZZLE",
      puzzleId: "thermal-scan"
    }).state;
    const result = run(state, {
      type: "SUBMIT_THERMAL",
      puzzleId: "thermal-scan",
      cellId: "b3"
    });

    expect(result.state).toBe(state);
    expect(result.effects).toEqual([{ type: "INVALID_ACTION", puzzleId: "thermal-scan" }]);
  });

  it("keeps progress after a wrong thermal answer and unlocks a contextual hint", () => {
    let state = run(createInitialState(), {
      type: "OPEN_PUZZLE",
      puzzleId: "thermal-scan"
    }).state;
    state = run(state, {
      type: "SCAN_THERMAL_CELL",
      puzzleId: "thermal-scan",
      cellId: "a2"
    }).state;
    const rejected = run(state, {
      type: "SUBMIT_THERMAL",
      puzzleId: "thermal-scan",
      cellId: "a2"
    });
    const hinted = run(rejected.state, { type: "REQUEST_HINT" });

    expect(rejected.state.scannedThermalCellIds).toEqual(["a2"]);
    expect(rejected.state.wrongAttempts["thermal-scan"]).toBe(1);
    expect(projectCase(case01, rejected.state).activePuzzle?.hintAvailable).toBe(true);
    expect(hinted.effects).toEqual([
      { type: "HINT_REVEALED", puzzleId: "thermal-scan", level: 1 }
    ]);
    expect(projectCase(case01, hinted.state).activePuzzle?.hintText).toContain("오른쪽");
  });

  it("does not reveal a hint before the player has attempted an answer", () => {
    const state = run(createInitialState(), {
      type: "OPEN_PUZZLE",
      puzzleId: "message-recovery"
    }).state;
    const result = run(state, { type: "REQUEST_HINT" });

    expect(result.state).toBe(state);
    expect(result.effects).toEqual([
      { type: "HINT_LOCKED", puzzleId: "message-recovery" }
    ]);
  });

  it("reveals the stronger second hint on another request without forcing another wrong answer", () => {
    let state = run(createInitialState(), {
      type: "OPEN_PUZZLE",
      puzzleId: "message-recovery"
    }).state;
    state = run(state, {
      type: "SUBMIT_MESSAGE_ORDER",
      puzzleId: "message-recovery",
      fragmentIds: ["fragment-red", "fragment-warning", "fragment-seven"]
    }).state;
    state = run(state, { type: "REQUEST_HINT" }).state;

    expect(projectCase(case01, state).activePuzzle?.hintAvailable).toBe(true);
    const secondHint = run(state, { type: "REQUEST_HINT" });
    expect(secondHint.effects).toEqual([
      { type: "HINT_REVEALED", puzzleId: "message-recovery", level: 2 }
    ]);
    expect(secondHint.state.wrongAttempts["message-recovery"]).toBe(1);
    expect(projectCase(case01, secondHint.state).activePuzzle?.hintLevel).toBe(2);
  });

  it("solves the thermal puzzle and exposes only its authored reward", () => {
    const state = solveThermal();
    const projection = projectCase(case01, state);

    expect(state.solvedPuzzleIds).toEqual(["thermal-scan"]);
    expect(projection.rewards).toEqual([
      {
        label: "최고 온도",
        value: "82°C",
        detail: "14:17 · 배터리 안전 종료 직전"
      }
    ]);
    expect(projection.puzzles.find((puzzle) => puzzle.id === "message-recovery")?.reward).toBeNull();
    expect(getLocksOpened(state)).toBe(0);
  });

  it("rejects malformed message orders without counting a reasoning attempt", () => {
    const state = run(createInitialState(), {
      type: "OPEN_PUZZLE",
      puzzleId: "message-recovery"
    }).state;
    const result = run(state, {
      type: "SUBMIT_MESSAGE_ORDER",
      puzzleId: "message-recovery",
      fragmentIds: ["fragment-warning", "fragment-warning", "fragment-seven"]
    });

    expect(result.state).toBe(state);
    expect(result.effects).toEqual([
      { type: "INVALID_ACTION", puzzleId: "message-recovery" }
    ]);
  });

  it("keeps the phone open after a plausible wrong order, then accepts the authored order", () => {
    let state = run(createInitialState(), {
      type: "OPEN_PUZZLE",
      puzzleId: "message-recovery"
    }).state;
    const rejected = run(state, {
      type: "SUBMIT_MESSAGE_ORDER",
      puzzleId: "message-recovery",
      fragmentIds: ["fragment-red", "fragment-warning", "fragment-seven"]
    });
    const solved = run(rejected.state, {
      type: "SUBMIT_MESSAGE_ORDER",
      puzzleId: "message-recovery",
      fragmentIds: ["fragment-warning", "fragment-red", "fragment-seven"]
    });

    expect(rejected.state.activePuzzleId).toBe("message-recovery");
    expect(rejected.state.wrongAttempts["message-recovery"]).toBe(1);
    expect(solved.state.solvedPuzzleIds).toEqual(["message-recovery"]);
  });

  it("allows the two source clues in either order and releases lock one only after both", () => {
    let state = solveMessage();
    expect(getLocksOpened(state)).toBe(0);
    state = solveThermal(state);

    expect(getLocksOpened(state)).toBe(1);
    expect(state.solvedPuzzleIds).toEqual(["message-recovery", "thermal-scan"]);
    expect(projectCase(case01, state).puzzles.find((puzzle) => puzzle.id === "protocol-overlay")?.status).toBe("AVAILABLE");
  });

  it("requires both clue values for the protocol and releases lock two", () => {
    let state = solveFirstClues();
    state = run(state, { type: "OPEN_PUZZLE", puzzleId: "protocol-overlay" }).state;
    const rejected = run(state, {
      type: "SUBMIT_PROTOCOL",
      puzzleId: "protocol-overlay",
      rule: 7,
      threshold: 90
    });
    const solved = run(rejected.state, {
      type: "SUBMIT_PROTOCOL",
      puzzleId: "protocol-overlay",
      rule: 7,
      threshold: 80
    });

    expect(rejected.effects).toEqual([
      { type: "ANSWER_REJECTED", puzzleId: "protocol-overlay", attempts: 1 }
    ]);
    expect(getLocksOpened(solved.state)).toBe(2);
    expect(solved.effects).toEqual([
      { type: "PUZZLE_SOLVED", puzzleId: "protocol-overlay" },
      { type: "LOCK_RELEASED", index: 2 }
    ]);
  });

  it("does not expose the route destination before the protocol is solved", () => {
    const projection = projectCase(case01, solveFirstClues());
    const route = projection.puzzles.find((puzzle) => puzzle.id === "route-trace");

    expect(route?.status).toBe("LOCKED");
    expect(route?.reward).toBeNull();
    expect(projection.rewards.some((reward) => reward.value.includes("B-3"))).toBe(false);
  });

  it("rejects a connected but incorrect route without erasing previous clues", () => {
    let state = solveProtocol();
    state = run(state, { type: "OPEN_PUZZLE", puzzleId: "route-trace" }).state;
    const rejected = run(state, {
      type: "SUBMIT_ROUTE",
      puzzleId: "route-trace",
      nodeIds: ["team-table", "east-hall", "outside-exit"]
    });

    expect(rejected.state.solvedPuzzleIds).toEqual([
      "thermal-scan",
      "message-recovery",
      "protocol-overlay"
    ]);
    expect(rejected.state.activePuzzleId).toBe("route-trace");
    expect(rejected.state.wrongAttempts["route-trace"]).toBe(1);
  });

  it("opens the locker only after the exact chronological B-3 route", () => {
    let state = solveProtocol();
    state = run(state, { type: "OPEN_PUZZLE", puzzleId: "route-trace" }).state;
    const solved = run(state, {
      type: "SUBMIT_ROUTE",
      puzzleId: "route-trace",
      nodeIds: ["team-table", "west-reader", "b3"]
    });
    const projection = projectCase(case01, solved.state);

    expect(solved.state.phase).toBe("SOLVED");
    expect(projection.locksOpened).toBe(3);
    expect(projection.lockerOpen).toBe(true);
    expect(projection.conclusion?.headline).toContain("찾았다");
    expect(solved.effects).toEqual([
      { type: "PUZZLE_SOLVED", puzzleId: "route-trace" },
      { type: "LOCK_RELEASED", index: 3 },
      { type: "LOCKER_OPENED" }
    ]);
  });

  it("keeps a solved case immutable until reset", () => {
    const solved = solveCase();
    const result = run(solved, { type: "OPEN_PUZZLE", puzzleId: "thermal-scan" });

    expect(result.state).toBe(solved);
    expect(result.effects).toEqual([{ type: "CASE_ALREADY_SOLVED" }]);
  });

  it("reset clears scans, attempts, hints, rewards, locks, and the open locker", () => {
    const solved = solveCase();
    const reset = run(solved, { type: "RESET" });

    expect(reset.state).toEqual(createInitialState());
    expect(projectCase(case01, reset.state)).toEqual(
      projectCase(case01, createInitialState())
    );
  });

  it("replays deterministically from the same case definition", () => {
    const first = solveCase();
    const second = solveCase();

    expect(first).toEqual(second);
    expect(projectCase(case01, first)).toEqual(projectCase(case01, second));
  });

  it("does not expose authored solution fields through the case projection", () => {
    const serialized = JSON.stringify(projectCase(case01, createInitialState()));

    expect(serialized).not.toContain("solutionCellId");
    expect(serialized).not.toContain("solutionFragmentIds");
    expect(serialized).not.toContain("solutionRule");
    expect(serialized).not.toContain("solutionThreshold");
    expect(serialized).not.toContain("solutionNodeIds");
  });
});
