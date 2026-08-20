import type {
  CaseDefinition,
  GameCommand,
  GameState,
  PresentationEffect,
  PuzzleDefinition,
  PuzzleId,
  TransitionResult
} from "./types";

export function createInitialState(): GameState {
  return {
    phase: "SEARCHING",
    activePuzzleId: null,
    solvedPuzzleIds: [],
    scannedThermalCellIds: [],
    wrongAttempts: {},
    hintLevels: {}
  };
}

function findPuzzle(definition: CaseDefinition, puzzleId: PuzzleId): PuzzleDefinition | undefined {
  return definition.puzzles.find((puzzle) => puzzle.id === puzzleId);
}

export function arePrerequisitesMet(puzzle: PuzzleDefinition, state: GameState): boolean {
  return puzzle.unlockRequires.every((requiredId) => state.solvedPuzzleIds.includes(requiredId));
}

export function getLocksOpened(state: GameState): number {
  let locks = 0;
  if (
    state.solvedPuzzleIds.includes("thermal-scan") &&
    state.solvedPuzzleIds.includes("message-recovery")
  ) {
    locks += 1;
  }
  if (state.solvedPuzzleIds.includes("protocol-overlay")) {
    locks += 1;
  }
  if (state.solvedPuzzleIds.includes("route-trace")) {
    locks += 1;
  }
  return locks;
}

function invalidAction(state: GameState, puzzleId: PuzzleId): TransitionResult {
  return { state, effects: [{ type: "INVALID_ACTION", puzzleId }] };
}

function incrementWrongAttempt(state: GameState, puzzleId: PuzzleId): TransitionResult {
  const attempts = (state.wrongAttempts[puzzleId] ?? 0) + 1;
  return {
    state: {
      ...state,
      wrongAttempts: { ...state.wrongAttempts, [puzzleId]: attempts }
    },
    effects: [{ type: "ANSWER_REJECTED", puzzleId, attempts }]
  };
}

function solvePuzzle(state: GameState, puzzleId: PuzzleId): TransitionResult {
  const locksBefore = getLocksOpened(state);
  const solvedPuzzleIds = [...state.solvedPuzzleIds, puzzleId];
  const solvedState: GameState = {
    ...state,
    phase: puzzleId === "route-trace" ? "SOLVED" : "SEARCHING",
    activePuzzleId: null,
    solvedPuzzleIds
  };
  const locksAfter = getLocksOpened(solvedState);
  const effects: PresentationEffect[] = [{ type: "PUZZLE_SOLVED", puzzleId }];

  for (let index = locksBefore + 1; index <= locksAfter; index += 1) {
    effects.push({ type: "LOCK_RELEASED", index: index as 1 | 2 | 3 });
  }
  if (solvedState.phase === "SOLVED") {
    effects.push({ type: "LOCKER_OPENED" });
  }
  return { state: solvedState, effects };
}

function arraysEqual(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function hasUniqueKnownIds(ids: string[], knownIds: string[]): boolean {
  return ids.length === new Set(ids).size && ids.every((id) => knownIds.includes(id));
}

function activePuzzleFor(
  definition: CaseDefinition,
  state: GameState,
  puzzleId: PuzzleId
): PuzzleDefinition | null {
  if (state.activePuzzleId !== puzzleId) {
    return null;
  }
  return findPuzzle(definition, puzzleId) ?? null;
}

export function transition(
  definition: CaseDefinition,
  state: GameState,
  command: GameCommand
): TransitionResult {
  if (command.type === "RESET") {
    return { state: createInitialState(), effects: [{ type: "RESET" }] };
  }

  if (state.phase === "SOLVED") {
    return { state, effects: [{ type: "CASE_ALREADY_SOLVED" }] };
  }

  if (command.type === "OPEN_PUZZLE") {
    const puzzle = findPuzzle(definition, command.puzzleId);
    if (!puzzle) {
      return { state, effects: [{ type: "INVALID_PUZZLE", puzzleId: command.puzzleId }] };
    }
    if (state.solvedPuzzleIds.includes(puzzle.id)) {
      return { state, effects: [{ type: "PUZZLE_ALREADY_SOLVED", puzzleId: puzzle.id }] };
    }
    if (state.activePuzzleId === puzzle.id) {
      return { state, effects: [{ type: "PUZZLE_ALREADY_OPEN", puzzleId: puzzle.id }] };
    }
    if (state.activePuzzleId) {
      return { state, effects: [{ type: "ANOTHER_PUZZLE_OPEN", puzzleId: state.activePuzzleId }] };
    }
    const missingPuzzleIds = puzzle.unlockRequires.filter(
      (requiredId) => !state.solvedPuzzleIds.includes(requiredId)
    );
    if (missingPuzzleIds.length > 0) {
      return {
        state,
        effects: [{ type: "PUZZLE_LOCKED", puzzleId: puzzle.id, missingPuzzleIds }]
      };
    }
    return {
      state: { ...state, activePuzzleId: puzzle.id },
      effects: [{ type: "PUZZLE_OPENED", puzzleId: puzzle.id }]
    };
  }

  if (command.type === "CLOSE_PUZZLE") {
    if (!state.activePuzzleId) {
      return { state, effects: [{ type: "NOTHING_TO_CLOSE" }] };
    }
    const puzzleId = state.activePuzzleId;
    return {
      state: { ...state, activePuzzleId: null },
      effects: [{ type: "PUZZLE_CLOSED", puzzleId }]
    };
  }

  if (command.type === "REQUEST_HINT") {
    if (!state.activePuzzleId) {
      return invalidAction(state, "none");
    }
    const puzzleId = state.activePuzzleId;
    const currentLevel = state.hintLevels[puzzleId] ?? 0;
    if (currentLevel >= 2) {
      return { state, effects: [{ type: "NO_MORE_HINTS", puzzleId }] };
    }
    const attempts = state.wrongAttempts[puzzleId] ?? 0;
    if (currentLevel === 0 && attempts < 1) {
      return { state, effects: [{ type: "HINT_LOCKED", puzzleId }] };
    }
    const level = (currentLevel + 1) as 1 | 2;
    return {
      state: {
        ...state,
        hintLevels: { ...state.hintLevels, [puzzleId]: level }
      },
      effects: [{ type: "HINT_REVEALED", puzzleId, level }]
    };
  }

  if (command.type === "SCAN_THERMAL_CELL") {
    const puzzle = activePuzzleFor(definition, state, command.puzzleId);
    if (!puzzle || puzzle.kind !== "THERMAL_SCAN") {
      return invalidAction(state, command.puzzleId);
    }
    if (!puzzle.cells.some((cell) => cell.id === command.cellId)) {
      return invalidAction(state, command.puzzleId);
    }
    if (state.scannedThermalCellIds.includes(command.cellId)) {
      return {
        state,
        effects: [
          { type: "THERMAL_CELL_ALREADY_SCANNED", puzzleId: puzzle.id, cellId: command.cellId }
        ]
      };
    }
    return {
      state: {
        ...state,
        scannedThermalCellIds: [...state.scannedThermalCellIds, command.cellId]
      },
      effects: [{ type: "THERMAL_CELL_SCANNED", puzzleId: puzzle.id, cellId: command.cellId }]
    };
  }

  if (command.type === "SUBMIT_THERMAL") {
    const puzzle = activePuzzleFor(definition, state, command.puzzleId);
    if (!puzzle || puzzle.kind !== "THERMAL_SCAN") {
      return invalidAction(state, command.puzzleId);
    }
    if (!state.scannedThermalCellIds.includes(command.cellId)) {
      return invalidAction(state, command.puzzleId);
    }
    return command.cellId === puzzle.solutionCellId
      ? solvePuzzle(state, puzzle.id)
      : incrementWrongAttempt(state, puzzle.id);
  }

  if (command.type === "SUBMIT_MESSAGE_ORDER") {
    const puzzle = activePuzzleFor(definition, state, command.puzzleId);
    if (!puzzle || puzzle.kind !== "MESSAGE_ORDER") {
      return invalidAction(state, command.puzzleId);
    }
    const knownIds = puzzle.fragments.map((fragment) => fragment.id);
    if (
      command.fragmentIds.length !== knownIds.length ||
      !hasUniqueKnownIds(command.fragmentIds, knownIds)
    ) {
      return invalidAction(state, command.puzzleId);
    }
    return arraysEqual(command.fragmentIds, puzzle.solutionFragmentIds)
      ? solvePuzzle(state, puzzle.id)
      : incrementWrongAttempt(state, puzzle.id);
  }

  if (command.type === "SUBMIT_PROTOCOL") {
    const puzzle = activePuzzleFor(definition, state, command.puzzleId);
    if (!puzzle || puzzle.kind !== "PROTOCOL_DIAL") {
      return invalidAction(state, command.puzzleId);
    }
    if (
      !puzzle.ruleOptions.includes(command.rule) ||
      !puzzle.thresholdOptions.includes(command.threshold)
    ) {
      return invalidAction(state, command.puzzleId);
    }
    return command.rule === puzzle.solutionRule && command.threshold === puzzle.solutionThreshold
      ? solvePuzzle(state, puzzle.id)
      : incrementWrongAttempt(state, puzzle.id);
  }

  const puzzle = activePuzzleFor(definition, state, command.puzzleId);
  if (!puzzle || puzzle.kind !== "ROUTE_TRACE") {
    return invalidAction(state, command.puzzleId);
  }
  const knownNodeIds = puzzle.nodes.map((node) => node.id);
  if (!hasUniqueKnownIds(command.nodeIds, knownNodeIds)) {
    return invalidAction(state, command.puzzleId);
  }
  return arraysEqual(command.nodeIds, puzzle.solutionNodeIds)
    ? solvePuzzle(state, puzzle.id)
    : incrementWrongAttempt(state, puzzle.id);
}
