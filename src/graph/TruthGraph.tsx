import { useId } from "react";

import type {
  BoardEdge,
  BoardProjection,
  CaseDefinition,
  EvidenceCardDefinition
} from "../game/types";

type EvidenceId = EvidenceCardDefinition["id"];

interface InvestigationBoardProps {
  definition: CaseDefinition;
  projection: BoardProjection;
  selectedEvidenceId: EvidenceId | null;
  disabled?: boolean;
  reveal?: boolean;
  onSelectEvidence: (evidenceId: EvidenceId) => void;
}

interface BoardPoint {
  x: number;
  y: number;
}

interface EdgeGeometry {
  start: BoardPoint;
  end: BoardPoint;
}

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 660;
const TIMELINE_Y = 78;
const CARD_WIDTH = 220;
const CARD_HEIGHT = 126;
const EDGE_GAP = 9;

const KIND_LABELS: Record<string, string> = {
  TESTIMONY: "증언",
  ACCESS_LOG: "출입 기록",
  PHOTO: "사진",
  SYSTEM_RECORD: "시스템 기록",
  PERSON: "인물",
  OBJECT: "물증",
  INCIDENT: "사건",
  TIMESTAMP: "시각 기록",
  MAINTENANCE_REPORT: "정비 보고서",
  INVENTORY_RECORD: "재고 기록",
  기록: "시스템 기록",
  사건: "사건 기록",
  인물: "인물",
  "출입 기록": "출입 기록",
  대상: "물품",
  시스템: "시스템 기록"
};

const KIND_CLASS_TOKENS: Record<string, string> = {
  기록: "record",
  사건: "incident",
  인물: "person",
  "출입 기록": "access-log",
  대상: "object",
  시스템: "system"
};

function classToken(value: string): string {
  const fallback = value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return KIND_CLASS_TOKENS[value] ?? (fallback || "evidence");
}

function cardCenter(card: EvidenceCardDefinition): BoardPoint {
  return {
    x: card.position.x + CARD_WIDTH / 2,
    y: card.position.y + CARD_HEIGHT / 2
  };
}

function boundaryDistance(dx: number, dy: number): number {
  const horizontal = dx === 0 ? Number.POSITIVE_INFINITY : CARD_WIDTH / 2 / Math.abs(dx);
  const vertical = dy === 0 ? Number.POSITIVE_INFINITY : CARD_HEIGHT / 2 / Math.abs(dy);

  return Math.min(horizontal, vertical);
}

function edgeGeometry(
  from: EvidenceCardDefinition,
  to: EvidenceCardDefinition,
  waypoint: BoardPoint
): EdgeGeometry {
  const fromCenter = cardCenter(from);
  const toCenter = cardCenter(to);
  const fromDx = waypoint.x - fromCenter.x;
  const fromDy = waypoint.y - fromCenter.y;
  const fromLength = Math.hypot(fromDx, fromDy) || 1;
  const fromRatio =
    boundaryDistance(fromDx, fromDy) + EDGE_GAP / fromLength;
  const toDx = waypoint.x - toCenter.x;
  const toDy = waypoint.y - toCenter.y;
  const toLength = Math.hypot(toDx, toDy) || 1;
  const toRatio = boundaryDistance(toDx, toDy) + EDGE_GAP / toLength;

  return {
    start: {
      x: fromCenter.x + fromDx * fromRatio,
      y: fromCenter.y + fromDy * fromRatio
    },
    end: {
      x: toCenter.x + toDx * toRatio,
      y: toCenter.y + toDy * toRatio
    }
  };
}

function evidenceKindLabel(kind: string): string {
  const normalizedKind = kind.toUpperCase().replace(/-/g, "_");
  return KIND_LABELS[kind] ?? KIND_LABELS[normalizedKind] ?? kind;
}

function includesEvidence(ids: readonly EvidenceId[], evidenceId: EvidenceId) {
  return ids.includes(evidenceId);
}

interface EvidenceCardProps {
  card: EvidenceCardDefinition;
  selected: boolean;
  disabled: boolean;
  hypothesis: boolean;
  confirmed: boolean;
  critical: boolean;
  relevant: boolean;
  context: boolean;
  dimmed: boolean;
  reveal: boolean;
  onSelect: (evidenceId: EvidenceId) => void;
}

function EvidenceCard({
  card,
  selected,
  disabled,
  hypothesis,
  confirmed,
  critical,
  relevant,
  context,
  dimmed,
  reveal,
  onSelect
}: EvidenceCardProps) {
  const kindLabel = evidenceKindLabel(card.kind);
  const className = [
    "evidence-card",
    `evidence-card--${classToken(card.kind)}`,
    selected ? "evidence-card--selected" : null,
    disabled ? "evidence-card--disabled" : null,
    hypothesis ? "evidence-card--hypothesis" : null,
    confirmed ? "evidence-card--confirmed" : null,
    critical ? "evidence-card--critical" : null,
    relevant ? "evidence-card--relevant" : null,
    context ? "evidence-card--context" : null,
    dimmed ? "evidence-card--dimmed" : null,
    reveal && relevant ? "evidence-card--reveal" : null
  ]
    .filter(Boolean)
    .join(" ");
  const accessibilityLabel = [
    kindLabel,
    card.title,
    card.detail,
    `출처 ${card.source}`,
    card.time ? `시각 ${card.time}` : null,
    selected ? "선택됨" : null,
    hypothesis ? "검토 중인 가설에 포함됨" : null,
    confirmed ? "확인된 인과관계에 포함됨" : null,
    context ? "맥락 증거" : null
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <foreignObject
      className="evidence-card-wrap"
      x={card.position.x}
      y={card.position.y}
      width={CARD_WIDTH}
      height={CARD_HEIGHT}
      data-evidence-id={card.id}
    >
      <button
        className={className}
        type="button"
        aria-label={accessibilityLabel}
        aria-pressed={selected}
        disabled={disabled}
        data-evidence-kind={card.kind}
        onClick={() => onSelect(card.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(card.id);
          }
        }}
      >
        <span className="evidence-card__meta">
          <span className="evidence-card__kind">{kindLabel}</span>
          {card.time ? (
            <time className="evidence-card__time">{card.time}</time>
          ) : null}
        </span>
        <strong className="evidence-card__title">{card.title}</strong>
        <span className="evidence-card__detail">{card.detail}</span>
        <span className="evidence-card__source">출처 · {card.source}</span>
        {hypothesis ? (
          <span className="evidence-card__state">가설 검토</span>
        ) : confirmed ? (
          <span className="evidence-card__state">연결 확인</span>
        ) : null}
      </button>
    </foreignObject>
  );
}

interface CausalEdgeProps {
  edge: BoardEdge;
  from: EvidenceCardDefinition;
  to: EvidenceCardDefinition;
  labelPosition: BoardPoint;
  arrowId: string;
  reconstructionComplete: boolean;
  reveal: boolean;
}

function CausalEdge({
  edge,
  from,
  to,
  labelPosition,
  arrowId,
  reconstructionComplete,
  reveal
}: CausalEdgeProps) {
  const geometry = edgeGeometry(from, to, labelPosition);
  const stateLabel = edge.status === "HYPOTHESIS" ? "가설" : "확인";
  const className = [
    "causal-edge",
    `causal-edge--${edge.status.toLowerCase()}`,
    edge.critical ? "causal-edge--critical" : null,
    reconstructionComplete && edge.status === "CONFIRMED"
      ? "causal-edge--reconstruction"
      : null,
    reveal && edge.critical ? "causal-edge--reveal" : null
  ]
    .filter(Boolean)
    .join(" ");
  const labelClassName = [
    "edge-label",
    `edge-label--${edge.status.toLowerCase()}`,
    edge.critical ? "edge-label--critical" : null
  ]
    .filter(Boolean)
    .join(" ");
  const label = `${stateLabel} · ${edge.label}`;
  const labelWidth = Math.max(88, Array.from(label).length * 11 + 24);

  return (
    <g
      className="causal-edge-group"
      role="img"
      aria-label={`${stateLabel} 인과관계. ${from.title}에서 ${to.title}로. ${edge.label}.`}
      data-edge-id={edge.id}
      data-status={edge.status}
    >
      <title>
        {stateLabel} 인과관계: {from.title} → {edge.label} → {to.title}
      </title>
      <path
        className={className}
        d={`M ${geometry.start.x} ${geometry.start.y} L ${labelPosition.x} ${labelPosition.y} L ${geometry.end.x} ${geometry.end.y}`}
        markerEnd={`url(#${arrowId})`}
        strokeDasharray={edge.status === "HYPOTHESIS" ? "9 8" : undefined}
        vectorEffect="non-scaling-stroke"
      />
      <g
        className={labelClassName}
        transform={`translate(${labelPosition.x} ${labelPosition.y})`}
        aria-hidden="true"
      >
        <rect
          className="edge-label__backdrop"
          x={-labelWidth / 2}
          y={-14}
          width={labelWidth}
          height={28}
          rx={8}
        />
        <text className="edge-label__text" textAnchor="middle" y={4}>
          {label}
        </text>
      </g>
    </g>
  );
}

export function InvestigationBoard({
  definition,
  projection,
  selectedEvidenceId,
  disabled = false,
  reveal = false,
  onSelectEvidence
}: InvestigationBoardProps) {
  const idPrefix = useId().replace(/:/g, "");
  const titleId = `${idPrefix}-board-title`;
  const descriptionId = `${idPrefix}-board-description`;
  const arrowId = `${idPrefix}-causal-arrow`;
  const cardsById = new Map(
    projection.cards.map((card) => [card.id, card] as const)
  );
  const rulesById = new Map(
    definition.deductionRules.map((rule) => [rule.id, rule] as const)
  );
  const confirmedEvidenceIds = new Set<EvidenceId>();
  const hypothesisEvidenceIds = new Set<EvidenceId>();
  const criticalEvidenceIds = new Set<EvidenceId>();

  for (const edge of projection.edges) {
    if (edge.status === "CONFIRMED") {
      confirmedEvidenceIds.add(edge.fromEvidenceId);
      confirmedEvidenceIds.add(edge.toEvidenceId);
    } else {
      hypothesisEvidenceIds.add(edge.fromEvidenceId);
      hypothesisEvidenceIds.add(edge.toEvidenceId);
    }

    if (edge.critical) {
      criticalEvidenceIds.add(edge.fromEvidenceId);
      criticalEvidenceIds.add(edge.toEvidenceId);
    }
  }

  const boardClassName = [
    "investigation-board",
    projection.reconstructionComplete
      ? "investigation-board--reconstructed"
      : null,
    reveal ? "investigation-board--reveal" : null
  ]
    .filter(Boolean)
    .join(" ");
  const boardDescription = projection.reconstructionComplete
    ? "확인된 인과관계가 하나의 사건 흐름으로 재구성되었습니다. 맥락 증거는 흐리게 표시됩니다."
    : "증거 카드를 두 장 선택해 현재 증거가 뒷받침하는 인과관계를 재구성하세요.";
  const timelineDescription = projection.timelineMarkers
    .map((marker) => `${marker.time} ${marker.label}`)
    .join(", ");

  return (
    <svg
      className={boardClassName}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      role="group"
      aria-labelledby={`${titleId} ${descriptionId}`}
      preserveAspectRatio="xMidYMid meet"
      data-phase={projection.phase.toLowerCase()}
    >
      <title id={titleId}>{definition.title} 사건 재구성 보드</title>
      <desc id={descriptionId}>{boardDescription}</desc>

      <defs>
        <marker
          id={arrowId}
          className="causal-edge__marker"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path
            className="causal-edge__arrow"
            d="M 0 0 L 10 5 L 0 10 z"
            fill="context-stroke"
          />
        </marker>
      </defs>

      <g
        className="board-timeline"
        role="img"
        aria-label={`사건 시간축. ${timelineDescription}`}
      >
        <title>사건 시간축</title>
        {projection.timelineMarkers.length > 1 ? (
          <line
            className="board-timeline__line"
            x1={projection.timelineMarkers[0]?.x}
            y1={TIMELINE_Y}
            x2={projection.timelineMarkers.at(-1)?.x}
            y2={TIMELINE_Y}
          />
        ) : null}
        {projection.timelineMarkers.map((marker) => (
          <g
            className="board-timeline__marker"
            key={marker.id}
            transform={`translate(${marker.x} ${TIMELINE_Y})`}
          >
            <circle className="board-timeline__dot" r={5} />
            <text
              className="board-timeline__time"
              textAnchor="middle"
              y={-22}
            >
              {marker.time}
            </text>
            <text
              className="board-timeline__label"
              textAnchor="middle"
              y={27}
            >
              {marker.label}
            </text>
          </g>
        ))}
      </g>

      <g
        className="board-progress"
        role="status"
        aria-label={`확인된 인과 추론 ${projection.confirmedCount}개, 전체 ${projection.totalDeductionCount}개`}
        transform="translate(1136 24)"
      >
        <text className="board-progress__label" textAnchor="end" y={0}>
          확인된 인과 추론
        </text>
        <text className="board-progress__value" textAnchor="end" y={25}>
          {projection.confirmedCount} / {projection.totalDeductionCount}
        </text>
      </g>

      <g className="causal-edges">
        {projection.edges.map((edge) => {
          const from = cardsById.get(edge.fromEvidenceId);
          const to = cardsById.get(edge.toEvidenceId);
          const rule = rulesById.get(edge.id);

          if (!from || !to || !rule) {
            return null;
          }

          return (
            <CausalEdge
              key={edge.id}
              edge={edge}
              from={from}
              to={to}
              labelPosition={rule.labelPosition}
              arrowId={arrowId}
              reconstructionComplete={projection.reconstructionComplete}
              reveal={reveal}
            />
          );
        })}
      </g>

      <g className="evidence-cards">
        {projection.cards.map((card) => (
          <EvidenceCard
            key={card.id}
            card={card}
            selected={selectedEvidenceId === card.id}
            disabled={disabled}
            hypothesis={hypothesisEvidenceIds.has(card.id)}
            confirmed={confirmedEvidenceIds.has(card.id)}
            critical={criticalEvidenceIds.has(card.id)}
            relevant={includesEvidence(
              projection.relevantEvidenceIds,
              card.id
            )}
            context={includesEvidence(projection.contextEvidenceIds, card.id)}
            dimmed={includesEvidence(projection.dimmedEvidenceIds, card.id)}
            reveal={reveal}
            onSelect={onSelectEvidence}
          />
        ))}
      </g>
    </svg>
  );
}
