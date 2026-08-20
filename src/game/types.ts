export type PuzzleId = string;
export type GamePhase = "SEARCHING" | "SOLVED";
export type PuzzleKind =
  | "THERMAL_SCAN"
  | "MESSAGE_ORDER"
  | "PROTOCOL_DIAL"
  | "ROUTE_TRACE";

export interface KnownFactDefinition {
  id: string;
  label: string;
  value: string;
}

export interface PuzzleRewardDefinition {
  label: string;
  value: string;
  detail: string;
}

interface PuzzleBaseDefinition {
  id: PuzzleId;
  kind: PuzzleKind;
  eyebrow: string;
  title: string;
  objectLabel: string;
  prompt: string;
  unlockRequires: PuzzleId[];
  reward: PuzzleRewardDefinition;
  hints: [string, string];
}

export interface ThermalCellDefinition {
  id: string;
  label: string;
  reading: number;
  heat: number;
}

export interface ThermalPuzzleDefinition extends PuzzleBaseDefinition {
  kind: "THERMAL_SCAN";
  cells: ThermalCellDefinition[];
  solutionCellId: string;
}

export interface MessageFragmentDefinition {
  id: string;
  text: string;
}

export interface MessagePuzzleDefinition extends PuzzleBaseDefinition {
  kind: "MESSAGE_ORDER";
  fragments: MessageFragmentDefinition[];
  solutionFragmentIds: string[];
}

export interface ProtocolPuzzleDefinition extends PuzzleBaseDefinition {
  kind: "PROTOCOL_DIAL";
  ruleOptions: number[];
  thresholdOptions: number[];
  solutionRule: number;
  solutionThreshold: number;
}

export interface RouteNodeDefinition {
  id: string;
  label: string;
  time: string;
  x: number;
  y: number;
  kind: "START" | "PATH" | "DISTRACTOR" | "DESTINATION";
}

export interface RoutePuzzleDefinition extends PuzzleBaseDefinition {
  kind: "ROUTE_TRACE";
  nodes: RouteNodeDefinition[];
  connections: Array<[string, string]>;
  solutionNodeIds: string[];
}

export type PuzzleDefinition =
  | ThermalPuzzleDefinition
  | MessagePuzzleDefinition
  | ProtocolPuzzleDefinition
  | RoutePuzzleDefinition;

export interface CaseConclusionDefinition {
  eyebrow: string;
  headline: string;
  explanation: string;
  timeline: Array<{ time: string; label: string }>;
}

export interface CaseDefinition {
  id: string;
  title: string;
  eyebrow: string;
  hook: string;
  mission: string;
  instruction: string;
  knownFacts: KnownFactDefinition[];
  puzzles: PuzzleDefinition[];
  conclusion: CaseConclusionDefinition;
}

export interface GameState {
  phase: GamePhase;
  activePuzzleId: PuzzleId | null;
  solvedPuzzleIds: PuzzleId[];
  scannedThermalCellIds: string[];
  wrongAttempts: Partial<Record<PuzzleId, number>>;
  hintLevels: Partial<Record<PuzzleId, 0 | 1 | 2>>;
}

export type GameCommand =
  | { type: "OPEN_PUZZLE"; puzzleId: PuzzleId }
  | { type: "CLOSE_PUZZLE" }
  | { type: "SCAN_THERMAL_CELL"; puzzleId: PuzzleId; cellId: string }
  | { type: "SUBMIT_THERMAL"; puzzleId: PuzzleId; cellId: string }
  | { type: "SUBMIT_MESSAGE_ORDER"; puzzleId: PuzzleId; fragmentIds: string[] }
  | { type: "SUBMIT_PROTOCOL"; puzzleId: PuzzleId; rule: number; threshold: number }
  | { type: "SUBMIT_ROUTE"; puzzleId: PuzzleId; nodeIds: string[] }
  | { type: "REQUEST_HINT" }
  | { type: "RESET" };

export type PresentationEffect =
  | { type: "CASE_ALREADY_SOLVED" }
  | { type: "INVALID_PUZZLE"; puzzleId: PuzzleId }
  | { type: "PUZZLE_LOCKED"; puzzleId: PuzzleId; missingPuzzleIds: PuzzleId[] }
  | { type: "PUZZLE_ALREADY_SOLVED"; puzzleId: PuzzleId }
  | { type: "PUZZLE_ALREADY_OPEN"; puzzleId: PuzzleId }
  | { type: "ANOTHER_PUZZLE_OPEN"; puzzleId: PuzzleId }
  | { type: "PUZZLE_OPENED"; puzzleId: PuzzleId }
  | { type: "PUZZLE_CLOSED"; puzzleId: PuzzleId }
  | { type: "NOTHING_TO_CLOSE" }
  | { type: "INVALID_ACTION"; puzzleId: PuzzleId }
  | { type: "THERMAL_CELL_SCANNED"; puzzleId: PuzzleId; cellId: string }
  | { type: "THERMAL_CELL_ALREADY_SCANNED"; puzzleId: PuzzleId; cellId: string }
  | { type: "ANSWER_REJECTED"; puzzleId: PuzzleId; attempts: number }
  | { type: "PUZZLE_SOLVED"; puzzleId: PuzzleId }
  | { type: "LOCK_RELEASED"; index: 1 | 2 | 3 }
  | { type: "LOCKER_OPENED" }
  | { type: "HINT_LOCKED"; puzzleId: PuzzleId }
  | { type: "HINT_REVEALED"; puzzleId: PuzzleId; level: 1 | 2 }
  | { type: "NO_MORE_HINTS"; puzzleId: PuzzleId }
  | { type: "RESET" };

export interface TransitionResult {
  state: GameState;
  effects: PresentationEffect[];
}

export type PuzzleStatus = "AVAILABLE" | "LOCKED" | "ACTIVE" | "SOLVED";

interface PuzzleProjectionBase {
  id: PuzzleId;
  kind: PuzzleKind;
  eyebrow: string;
  title: string;
  objectLabel: string;
  prompt: string;
  status: PuzzleStatus;
  missingPuzzleIds: PuzzleId[];
  reward: PuzzleRewardDefinition | null;
  wrongAttempts: number;
  hintLevel: 0 | 1 | 2;
  hintText: string | null;
  hintAvailable: boolean;
}

export interface ThermalPuzzleProjection extends PuzzleProjectionBase {
  kind: "THERMAL_SCAN";
  cells: Array<Omit<ThermalCellDefinition, "reading"> & { reading: number | null }>;
}

export interface MessagePuzzleProjection extends PuzzleProjectionBase {
  kind: "MESSAGE_ORDER";
  fragments: MessageFragmentDefinition[];
}

export interface ProtocolPuzzleProjection extends PuzzleProjectionBase {
  kind: "PROTOCOL_DIAL";
  ruleOptions: number[];
  thresholdOptions: number[];
}

export interface RoutePuzzleProjection extends PuzzleProjectionBase {
  kind: "ROUTE_TRACE";
  nodes: RouteNodeDefinition[];
  connections: Array<[string, string]>;
}

export type PuzzleProjection =
  | ThermalPuzzleProjection
  | MessagePuzzleProjection
  | ProtocolPuzzleProjection
  | RoutePuzzleProjection;

export interface CaseProjection {
  phase: GamePhase;
  puzzles: PuzzleProjection[];
  activePuzzle: PuzzleProjection | null;
  solvedPuzzleIds: PuzzleId[];
  rewards: PuzzleRewardDefinition[];
  locksOpened: number;
  totalLocks: 3;
  lockerOpen: boolean;
  conclusion: CaseConclusionDefinition | null;
}
