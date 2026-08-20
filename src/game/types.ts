export type EvidenceId = string;
export type DeductionId = string;
export type ConclusionId = string;

export type GamePhase = "RECONSTRUCTING" | "CONCLUSION" | "SOLVED";
export type DeductionStatus = "HYPOTHESIS" | "CONFIRMED";
export type EvidenceRelevance = "CORE" | "CONTEXT";
export type EvidenceKind =
  | "기록"
  | "사건"
  | "인물"
  | "출입 기록"
  | "대상"
  | "시스템";

export interface Point {
  x: number;
  y: number;
}

export interface EvidenceCardDefinition {
  id: EvidenceId;
  title: string;
  detail: string;
  kind: EvidenceKind;
  source: string;
  time: string;
  position: Point;
  relevance: EvidenceRelevance;
}

export interface TimelineMarker {
  id: string;
  time: string;
  label: string;
  x: number;
}

export interface DeductionRule {
  id: DeductionId;
  fromEvidenceId: EvidenceId;
  toEvidenceId: EvidenceId;
  label: string;
  labelPosition: Point;
  requiresConfirmedDeductionIds: DeductionId[];
  critical: boolean;
}

export interface ConclusionDefinition {
  id: ConclusionId;
  label: string;
}

export interface CaseDefinition {
  id: "case-01-proof-of-fun-v2";
  eyebrow: string;
  title: string;
  briefing: string;
  instruction: string;
  evidenceCards: EvidenceCardDefinition[];
  timelineMarkers: TimelineMarker[];
  deductionRules: DeductionRule[];
  conclusions: ConclusionDefinition[];
  solution: {
    correctConclusionId: ConclusionId;
  };
}

export interface RuntimeDeduction {
  id: DeductionId;
  fromEvidenceId: EvidenceId;
  toEvidenceId: EvidenceId;
  label: string;
  status: DeductionStatus;
  critical: boolean;
}

export interface ConclusionResult {
  conclusionId: ConclusionId;
  result: "INCORRECT" | "CORRECT";
}

export interface GameState {
  phase: GamePhase;
  activeHypothesis: RuntimeDeduction | null;
  confirmedDeductionIds: DeductionId[];
  lastConclusion: ConclusionResult | null;
}

export type GameCommand =
  | {
      type: "PROPOSE_DEDUCTION";
      causeEvidenceId: EvidenceId;
      resultEvidenceId: EvidenceId;
    }
  | { type: "CONFIRM_DEDUCTION" }
  | { type: "DISCARD_HYPOTHESIS" }
  | { type: "SUBMIT_CONCLUSION"; conclusionId: ConclusionId }
  | { type: "RESET" };

export type PresentationEffect =
  | {
      type: "INVALID_DEDUCTION";
      evidenceIds: [EvidenceId, EvidenceId];
    }
  | { type: "DEDUCTION_LOCKED"; deductionId: DeductionId }
  | { type: "ACTIVE_HYPOTHESIS_EXISTS"; deductionId: DeductionId }
  | { type: "HYPOTHESIS_CREATED"; deductionId: DeductionId }
  | { type: "HYPOTHESIS_ALREADY_EXISTS"; deductionId: DeductionId }
  | { type: "DEDUCTION_ALREADY_CONFIRMED"; deductionId: DeductionId }
  | { type: "HYPOTHESIS_CONFIRMED"; deductionId: DeductionId }
  | { type: "HYPOTHESIS_DISCARDED"; deductionId: DeductionId }
  | { type: "NOTHING_TO_CONFIRM" }
  | { type: "NOTHING_TO_DISCARD" }
  | { type: "RECONSTRUCTION_COMPLETE"; deductionId: DeductionId }
  | { type: "CONCLUSION_LOCKED" }
  | { type: "INVALID_CONCLUSION"; conclusionId: ConclusionId }
  | { type: "CONCLUSION_REJECTED"; conclusionId: ConclusionId }
  | { type: "CASE_SOLVED"; conclusionId: ConclusionId }
  | { type: "CASE_ALREADY_SOLVED" }
  | { type: "RESET" };

export interface TransitionResult {
  state: GameState;
  effects: PresentationEffect[];
}

export interface BoardEdge extends RuntimeDeduction {}

export interface BoardProjection {
  phase: GamePhase;
  cards: EvidenceCardDefinition[];
  timelineMarkers: TimelineMarker[];
  edges: BoardEdge[];
  confirmedCount: number;
  totalDeductionCount: number;
  criticalDeductionId: DeductionId | null;
  criticalAvailable: boolean;
  criticalCompleted: boolean;
  reconstructionComplete: boolean;
  answerRevealed: boolean;
  relevantEvidenceIds: EvidenceId[];
  contextEvidenceIds: EvidenceId[];
  dimmedEvidenceIds: EvidenceId[];
  lastConclusion: ConclusionResult | null;
}
