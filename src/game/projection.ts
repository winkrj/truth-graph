import { arePrerequisitesMet, getLocksOpened } from "./engine";
import type {
  CaseDefinition,
  CaseProjection,
  GameState,
  PuzzleDefinition,
  PuzzleProjection,
  PuzzleStatus
} from "./types";

function statusFor(puzzle: PuzzleDefinition, state: GameState): PuzzleStatus {
  if (state.solvedPuzzleIds.includes(puzzle.id)) {
    return "SOLVED";
  }
  if (state.activePuzzleId === puzzle.id) {
    return "ACTIVE";
  }
  return arePrerequisitesMet(puzzle, state) ? "AVAILABLE" : "LOCKED";
}

function baseProjection(puzzle: PuzzleDefinition, state: GameState) {
  const status = statusFor(puzzle, state);
  const wrongAttempts = state.wrongAttempts[puzzle.id] ?? 0;
  const hintLevel = state.hintLevels[puzzle.id] ?? 0;
  return {
    id: puzzle.id,
    kind: puzzle.kind,
    eyebrow: puzzle.eyebrow,
    title: puzzle.title,
    objectLabel: puzzle.objectLabel,
    prompt: puzzle.prompt,
    status,
    missingPuzzleIds: puzzle.unlockRequires.filter(
      (requiredId) => !state.solvedPuzzleIds.includes(requiredId)
    ),
    reward: status === "SOLVED" ? puzzle.reward : null,
    wrongAttempts,
    hintLevel,
    hintText: hintLevel > 0 ? puzzle.hints[hintLevel - 1] : null,
    hintAvailable: status === "ACTIVE" && hintLevel < 2 && wrongAttempts >= 1
  };
}

function projectPuzzle(puzzle: PuzzleDefinition, state: GameState): PuzzleProjection {
  const base = baseProjection(puzzle, state);
  if (puzzle.kind === "THERMAL_SCAN") {
    const solved = state.solvedPuzzleIds.includes(puzzle.id);
    return {
      ...base,
      kind: "THERMAL_SCAN",
      cells: puzzle.cells.map(({ reading, ...cell }) => ({
        ...cell,
        reading:
          solved || state.scannedThermalCellIds.includes(cell.id) ? reading : null
      }))
    };
  }
  if (puzzle.kind === "MESSAGE_ORDER") {
    return { ...base, kind: "MESSAGE_ORDER", fragments: puzzle.fragments };
  }
  if (puzzle.kind === "PROTOCOL_DIAL") {
    return {
      ...base,
      kind: "PROTOCOL_DIAL",
      ruleOptions: base.status === "LOCKED" ? [] : puzzle.ruleOptions,
      thresholdOptions: base.status === "LOCKED" ? [] : puzzle.thresholdOptions
    };
  }
  return {
    ...base,
    kind: "ROUTE_TRACE",
    nodes: base.status === "LOCKED" ? [] : puzzle.nodes,
    connections: base.status === "LOCKED" ? [] : puzzle.connections
  };
}

export function projectCase(definition: CaseDefinition, state: GameState): CaseProjection {
  const puzzles = definition.puzzles.map((puzzle) => projectPuzzle(puzzle, state));
  return {
    phase: state.phase,
    puzzles,
    activePuzzle: puzzles.find((puzzle) => puzzle.id === state.activePuzzleId) ?? null,
    solvedPuzzleIds: [...state.solvedPuzzleIds],
    rewards: puzzles.flatMap((puzzle) => (puzzle.reward ? [puzzle.reward] : [])),
    locksOpened: getLocksOpened(state),
    totalLocks: 3,
    lockerOpen: state.phase === "SOLVED",
    conclusion: state.phase === "SOLVED" ? definition.conclusion : null
  };
}
