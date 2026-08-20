import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import type {
  CaseProjection,
  MessagePuzzleProjection,
  ProtocolPuzzleProjection,
  PuzzleId,
  PuzzleProjection,
  RoutePuzzleProjection,
  ThermalPuzzleProjection
} from "../game/types";

interface EscapeDeskProps {
  projection: CaseProjection;
  onOpenPuzzle: (puzzleId: PuzzleId) => void;
  onClosePuzzle: () => void;
  onScanThermal: (puzzleId: PuzzleId, cellId: string) => void;
  onSubmitThermal: (puzzleId: PuzzleId, cellId: string) => void;
  onSubmitMessage: (puzzleId: PuzzleId, fragmentIds: string[]) => void;
  onSubmitProtocol: (puzzleId: PuzzleId, rule: number, threshold: number) => void;
  onSubmitRoute: (puzzleId: PuzzleId, nodeIds: string[]) => void;
  onRequestHint: () => void;
  onReset: () => void;
}

function TabletArt() {
  return (
    <svg viewBox="0 0 240 150" aria-hidden="true">
      <rect className="object-shadow" x="13" y="18" width="216" height="119" rx="13" />
      <rect className="object-shell" x="6" y="8" width="216" height="119" rx="13" />
      <rect className="object-screen" x="22" y="23" width="184" height="82" rx="5" />
      <path className="object-trace" d="M39 82h24l10-33h36l11 33h30l9-20h27" />
      <path className="object-detail" d="M36 38h43M36 47h26M157 93h32" />
      <circle className="object-led" cx="114" cy="117" r="5" />
    </svg>
  );
}

function PhoneArt() {
  return (
    <svg viewBox="0 0 145 205" aria-hidden="true">
      <rect className="object-shadow" x="18" y="12" width="105" height="180" rx="21" />
      <rect className="object-shell" x="9" y="4" width="105" height="180" rx="21" />
      <rect className="object-screen" x="18" y="22" width="87" height="137" rx="10" />
      <rect className="message-scrap message-scrap--one" x="27" y="42" width="56" height="22" rx="5" />
      <rect className="message-scrap message-scrap--two" x="42" y="78" width="53" height="22" rx="5" />
      <rect className="message-scrap message-scrap--three" x="27" y="114" width="64" height="25" rx="5" />
      <path className="object-detail" d="M35 51h35M51 87h31M35 123h42" />
      <circle className="object-led" cx="61" cy="171" r="6" />
    </svg>
  );
}

function LedgerArt() {
  return (
    <svg viewBox="0 0 210 185" aria-hidden="true">
      <rect className="object-shadow" x="19" y="19" width="172" height="150" rx="5" />
      <rect className="paper-sheet" x="8" y="8" width="172" height="150" rx="3" />
      <rect className="paper-clip" x="65" y="1" width="55" height="21" rx="7" />
      <path className="paper-grid" d="M28 47h132M28 75h132M28 103h132M28 131h132M73 47v84M122 47v84" />
      <path className="paper-copy" d="M28 30h67M33 60h26M82 60h25M33 88h26M82 88h25M33 116h26M82 116h25" />
      <circle className="paper-seal" cx="146" cy="116" r="15" />
    </svg>
  );
}

function BadgeArt() {
  return (
    <svg viewBox="0 0 175 190" aria-hidden="true">
      <path className="badge-lanyard" d="M42 4c3 38 20 49 45 68 25-19 42-30 45-68" />
      <rect className="object-shadow" x="35" y="66" width="112" height="109" rx="11" />
      <rect className="badge-card" x="26" y="58" width="112" height="109" rx="11" />
      <rect className="badge-photo" x="43" y="79" width="38" height="44" rx="5" />
      <circle className="badge-person" cx="62" cy="94" r="8" />
      <path className="badge-person" d="M49 118c2-13 8-18 13-18s11 5 13 18" />
      <path className="badge-copy" d="M91 86h29M91 96h23M43 139h77M43 149h54" />
      <rect className="badge-chip" x="94" y="109" width="24" height="17" rx="3" />
    </svg>
  );
}

function artFor(kind: PuzzleProjection["kind"]) {
  if (kind === "THERMAL_SCAN") return <TabletArt />;
  if (kind === "MESSAGE_ORDER") return <PhoneArt />;
  if (kind === "PROTOCOL_DIAL") return <LedgerArt />;
  return <BadgeArt />;
}

function lockReason(puzzle: PuzzleProjection): string {
  if (puzzle.id === "protocol-overlay") return "온도와 규정 번호 필요";
  if (puzzle.id === "route-trace") return "보관 위치 필요";
  return "이전 단서 필요";
}

function DeskObject({
  puzzle,
  interactionBlocked,
  onOpen
}: {
  puzzle: PuzzleProjection;
  interactionBlocked: boolean;
  onOpen: () => void;
}) {
  const stateLabel =
    puzzle.status === "SOLVED"
      ? "단서 확보"
      : puzzle.status === "LOCKED"
        ? lockReason(puzzle)
        : "조사하기";
  return (
    <button
      type="button"
      className={`desk-object desk-object--${puzzle.kind.toLowerCase()} desk-object--${puzzle.status.toLowerCase()}`}
      disabled={interactionBlocked || puzzle.status === "LOCKED" || puzzle.status === "SOLVED"}
      onClick={onOpen}
      aria-label={`${puzzle.objectLabel}. ${puzzle.prompt}. ${stateLabel}`}
    >
      <span className="desk-object__art">{artFor(puzzle.kind)}</span>
      <span className="desk-object__label">
        <small>{puzzle.eyebrow}</small>
        <strong>{puzzle.objectLabel}</strong>
        <em>{stateLabel}</em>
      </span>
      {puzzle.status === "LOCKED" ? <span className="object-lock" aria-hidden="true">⌁</span> : null}
      {puzzle.status === "SOLVED" ? <span className="object-seal" aria-hidden="true">확보</span> : null}
    </button>
  );
}

function FireLocker({ projection }: { projection: CaseProjection }) {
  const locationKnown = projection.rewards.some((reward) => reward.label === "격리 위치");
  return (
    <div className={`fire-locker ${projection.lockerOpen ? "fire-locker--open" : ""}`}>
      <div className="locker-topline">
        <span>FIRE SAFE · {locationKnown ? "B-3" : "LOCATION UNKNOWN"}</span>
        <strong>{projection.lockerOpen ? "OPEN" : "LOCKED"}</strong>
      </div>
      <div className="locker-cavity" aria-hidden={!projection.lockerOpen}>
        {projection.lockerOpen ? (
          <div className="found-laptop">
            <span className="found-laptop__screen">DEMO READY</span>
            <span className="found-laptop__base" />
            <i>발견</i>
          </div>
        ) : null}
      </div>
      <div className="locker-door locker-door--left">
        <span className="locker-wheel">✣</span>
      </div>
      <div className="locker-door locker-door--right">
        <span className="locker-plate">CASE 01</span>
      </div>
      <div className="locker-latches" aria-label={`${projection.totalLocks}개 중 ${projection.locksOpened}개 잠금 해제`}>
        {["단서", "규정", "경로"].map((label, index) => {
          const open = projection.locksOpened > index;
          return (
            <span className={open ? "locker-latch locker-latch--open" : "locker-latch"} key={label}>
              <i aria-hidden="true">{open ? "✓" : "◆"}</i>
              <small>{label}</small>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function PuzzleShell({
  puzzle,
  children,
  onClose,
  onHint
}: {
  puzzle: PuzzleProjection;
  children: React.ReactNode;
  onClose: () => void;
  onHint: () => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const dialog = dialogRef.current;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    dialog?.querySelector<HTMLElement>(focusableSelector)?.focus();

    const keepFocusInside = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog?.addEventListener("keydown", keepFocusInside);
    return () => {
      dialog?.removeEventListener("keydown", keepFocusInside);
      window.requestAnimationFrame(() => {
        const triggerStillUsable =
          previouslyFocused?.isConnected && !previouslyFocused.matches(":disabled");
        if (triggerStillUsable) {
          previouslyFocused.focus();
          return;
        }
        const fallback =
          document.querySelector<HTMLElement>(".desk-object:not(:disabled)") ??
          document.querySelector<HTMLElement>(".reset-button:not(:disabled)");
        fallback?.focus();
      });
    };
  }, [onClose]);

  return (
    <section ref={dialogRef} className={`puzzle-overlay puzzle-overlay--${puzzle.kind.toLowerCase()}`} role="dialog" aria-modal="true" aria-labelledby="puzzle-title">
      <header className="puzzle-header">
        <div>
          <p>{puzzle.eyebrow} · OBJECT PUZZLE</p>
          <h2 id="puzzle-title">{puzzle.title}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="퍼즐 닫기">×</button>
      </header>
      <div className="puzzle-body">{children}</div>
      <footer className="puzzle-footer">
        <div>
          <strong>{puzzle.prompt}</strong>
          {puzzle.wrongAttempts > 0 ? <p className="attempt-feedback">아직 맞지 않습니다. 발견한 정보를 다시 대조하세요.</p> : null}
          {puzzle.hintText ? <p className="hint-copy">힌트 · {puzzle.hintText}</p> : null}
        </div>
        {puzzle.hintAvailable ? <button type="button" className="hint-button" onClick={onHint}>힌트 열기</button> : null}
      </footer>
    </section>
  );
}

function ThermalPuzzle({
  puzzle,
  onClose,
  onHint,
  onScan,
  onSubmit
}: {
  puzzle: ThermalPuzzleProjection;
  onClose: () => void;
  onHint: () => void;
  onScan: (cellId: string) => void;
  onSubmit: (cellId: string) => void;
}) {
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const selected = puzzle.cells.find((cell) => cell.id === selectedCellId);

  return (
    <PuzzleShell puzzle={puzzle} onClose={onClose} onHint={onHint}>
      <div className="thermal-console">
        <div className="thermal-grid" aria-label="3×3 열화상 진단 구역">
          {puzzle.cells.map((cell) => (
            <button
              type="button"
              key={cell.id}
              className={selectedCellId === cell.id ? "thermal-cell thermal-cell--selected" : "thermal-cell"}
              style={{ "--cell-heat": cell.heat } as CSSProperties}
              onClick={() => {
                setSelectedCellId(cell.id);
                onScan(cell.id);
              }}
              aria-label={`열화상 구역 ${cell.label}${cell.reading === null ? ", 미판독" : `, ${cell.reading}도`}`}
            >
              <small>{cell.label}</small>
              <strong>{cell.reading === null ? "SCAN" : `${cell.reading}°`}</strong>
            </button>
          ))}
        </div>
        <aside className="thermal-readout">
          <span>BATTERY THERMAL ARRAY</span>
          <strong>{selected?.reading === null || selected?.reading === undefined ? "--°C" : `${selected.reading}°C`}</strong>
          <p>{selected ? `${selected.label} 구역 판독 완료` : "잔열이 강한 구역을 눌러 판독하세요"}</p>
          <button type="button" disabled={!selected || selected.reading === null} onClick={() => selectedCellId && onSubmit(selectedCellId)}>
            최고 온도로 확정
          </button>
        </aside>
      </div>
    </PuzzleShell>
  );
}

function MessagePuzzle({
  puzzle,
  onClose,
  onHint,
  onSubmit
}: {
  puzzle: MessagePuzzleProjection;
  onClose: () => void;
  onHint: () => void;
  onSubmit: (fragmentIds: string[]) => void;
}) {
  const [order, setOrder] = useState<string[]>([]);
  const orderedFragments = order.map((id) => puzzle.fragments.find((fragment) => fragment.id === id)!);
  return (
    <PuzzleShell puzzle={puzzle} onClose={onClose} onHint={onHint}>
      <div className="message-console">
        <div className="phone-frame">
          <span className="phone-status">14:16 · 삭제 데이터 3개</span>
          <div className="message-slots" aria-label="복원된 메시지 순서">
            {[0, 1, 2].map((index) => (
              <span className={orderedFragments[index] ? "message-slot message-slot--filled" : "message-slot"} key={index}>
                <i>{index + 1}</i>{orderedFragments[index]?.text ?? "조각 대기"}
              </span>
            ))}
          </div>
        </div>
        <div className="fragment-bank" aria-label="복원할 메시지 조각">
          {puzzle.fragments.map((fragment) => {
            const used = order.includes(fragment.id);
            return (
              <button type="button" key={fragment.id} disabled={used} onClick={() => setOrder((current) => [...current, fragment.id])}>
                {fragment.text}
              </button>
            );
          })}
          <div className="fragment-actions">
            <button type="button" disabled={order.length === 0} onClick={() => setOrder((current) => current.slice(0, -1))}>마지막 조각 빼기</button>
            <button type="button" disabled={order.length !== puzzle.fragments.length} onClick={() => onSubmit(order)}>문장 복원</button>
          </div>
        </div>
      </div>
    </PuzzleShell>
  );
}

function ProtocolPuzzle({
  puzzle,
  rewards,
  onClose,
  onHint,
  onSubmit
}: {
  puzzle: ProtocolPuzzleProjection;
  rewards: CaseProjection["rewards"];
  onClose: () => void;
  onHint: () => void;
  onSubmit: (rule: number, threshold: number) => void;
}) {
  const [ruleIndex, setRuleIndex] = useState(0);
  const [thresholdIndex, setThresholdIndex] = useState(0);
  const rule = puzzle.ruleOptions[ruleIndex];
  const threshold = puzzle.thresholdOptions[thresholdIndex];
  const cycle = (index: number, length: number, delta: number) => (index + delta + length) % length;
  return (
    <PuzzleShell puzzle={puzzle} onClose={onClose} onHint={onHint}>
      <div className="protocol-console">
        <div className="input-evidence">
          {rewards.map((reward) => (
            <span key={reward.label}><small>{reward.label}</small><strong>{reward.value}</strong></span>
          ))}
        </div>
        <div className="protocol-sheet">
          <span className="sheet-tab">긴급 안전 규정</span>
          <div className="dial-row">
            <div className="dial-control">
              <small>규정 조항</small>
              <button type="button" onClick={() => setRuleIndex((value) => cycle(value, puzzle.ruleOptions.length, -1))} aria-label="이전 규정 조항">−</button>
              <strong>{rule}조</strong>
              <button type="button" onClick={() => setRuleIndex((value) => cycle(value, puzzle.ruleOptions.length, 1))} aria-label="다음 규정 조항">＋</button>
            </div>
            <div className="dial-operator">＋</div>
            <div className="dial-control">
              <small>온도 기준</small>
              <button type="button" onClick={() => setThresholdIndex((value) => cycle(value, puzzle.thresholdOptions.length, -1))} aria-label="이전 온도 기준">−</button>
              <strong>{threshold}°C</strong>
              <button type="button" onClick={() => setThresholdIndex((value) => cycle(value, puzzle.thresholdOptions.length, 1))} aria-label="다음 온도 기준">＋</button>
            </div>
          </div>
          <div className="overlay-window"><span>정렬 결과</span><strong>{rule} / {threshold}</strong></div>
          <button type="button" className="protocol-submit" onClick={() => onSubmit(rule, threshold)}>규정표 겹치기</button>
        </div>
      </div>
    </PuzzleShell>
  );
}

function RoutePuzzle({
  puzzle,
  rewards,
  onClose,
  onHint,
  onSubmit
}: {
  puzzle: RoutePuzzleProjection;
  rewards: CaseProjection["rewards"];
  onClose: () => void;
  onHint: () => void;
  onSubmit: (nodeIds: string[]) => void;
}) {
  const [route, setRoute] = useState<string[]>([]);
  const selectedNodes = route.map((id) => puzzle.nodes.find((node) => node.id === id)!);
  const locationReward = rewards.find((reward) => reward.label === "격리 위치");
  return (
    <PuzzleShell puzzle={puzzle} onClose={onClose} onHint={onHint}>
      <div className="route-console">
        <div className="route-evidence"><small>목표 위치</small><strong>{locationReward?.value}</strong></div>
        <div className="route-map">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {puzzle.connections.map(([fromId, toId]) => {
              const from = puzzle.nodes.find((node) => node.id === fromId)!;
              const to = puzzle.nodes.find((node) => node.id === toId)!;
              return <line key={`${fromId}-${toId}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
            })}
          </svg>
          {puzzle.nodes.map((node) => {
            const order = route.indexOf(node.id);
            return (
              <button
                type="button"
                key={node.id}
                className={`route-node route-node--${node.kind.toLowerCase()} ${order >= 0 ? "route-node--selected" : ""}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                disabled={order >= 0 || route.length >= 3}
                onClick={() => setRoute((current) => [...current, node.id])}
                aria-label={`${node.label}, ${node.time}${order >= 0 ? `, 경로 ${order + 1}번째` : ""}`}
              >
                {order >= 0 ? <i>{order + 1}</i> : null}
                <strong>{node.label}</strong><small>{node.time}</small>
              </button>
            );
          })}
        </div>
        <div className="route-sequence">
          <span>{selectedNodes.length ? selectedNodes.map((node) => node.label).join(" → ") : "시작 지점부터 세 위치를 선택하세요"}</span>
          <button type="button" disabled={route.length === 0} onClick={() => setRoute([])}>경로 지우기</button>
          <button type="button" disabled={route.length !== 3} onClick={() => onSubmit(route)}>동선 확정</button>
        </div>
      </div>
    </PuzzleShell>
  );
}

function ActivePuzzle({
  puzzle,
  projection,
  onClose,
  onHint,
  onScanThermal,
  onSubmitThermal,
  onSubmitMessage,
  onSubmitProtocol,
  onSubmitRoute
}: {
  puzzle: PuzzleProjection;
  projection: CaseProjection;
  onClose: () => void;
  onHint: () => void;
  onScanThermal: EscapeDeskProps["onScanThermal"];
  onSubmitThermal: EscapeDeskProps["onSubmitThermal"];
  onSubmitMessage: EscapeDeskProps["onSubmitMessage"];
  onSubmitProtocol: EscapeDeskProps["onSubmitProtocol"];
  onSubmitRoute: EscapeDeskProps["onSubmitRoute"];
}) {
  if (puzzle.kind === "THERMAL_SCAN") {
    return <ThermalPuzzle puzzle={puzzle} onClose={onClose} onHint={onHint} onScan={(cellId) => onScanThermal(puzzle.id, cellId)} onSubmit={(cellId) => onSubmitThermal(puzzle.id, cellId)} />;
  }
  if (puzzle.kind === "MESSAGE_ORDER") {
    return <MessagePuzzle puzzle={puzzle} onClose={onClose} onHint={onHint} onSubmit={(ids) => onSubmitMessage(puzzle.id, ids)} />;
  }
  if (puzzle.kind === "PROTOCOL_DIAL") {
    return <ProtocolPuzzle puzzle={puzzle} rewards={projection.rewards} onClose={onClose} onHint={onHint} onSubmit={(rule, threshold) => onSubmitProtocol(puzzle.id, rule, threshold)} />;
  }
  return <RoutePuzzle puzzle={puzzle} rewards={projection.rewards} onClose={onClose} onHint={onHint} onSubmit={(ids) => onSubmitRoute(puzzle.id, ids)} />;
}

export function EscapeDesk(props: EscapeDeskProps) {
  const { projection, onOpenPuzzle, onReset } = props;
  const puzzleMap = useMemo(() => new Map(projection.puzzles.map((puzzle) => [puzzle.id, puzzle])), [projection.puzzles]);
  const orderedIds = ["thermal-scan", "message-recovery", "protocol-overlay", "route-trace"];
  return (
    <section className={`escape-desk ${projection.lockerOpen ? "escape-desk--solved" : ""}`} aria-label="사라진 노트북 사건 현장">
      <div className="desk-grid" aria-hidden="true" />
      <div className="desk-callout"><span>현재 목표</span><strong>{projection.lockerOpen ? "노트북 발견" : "물건을 조사해 세 개의 잠금을 풀어라"}</strong></div>
      <div className="desk-objects">
        {orderedIds.map((id) => {
          const puzzle = puzzleMap.get(id)!;
          return <DeskObject key={id} puzzle={puzzle} interactionBlocked={projection.activePuzzle !== null} onOpen={() => onOpenPuzzle(id)} />;
        })}
      </div>
      <FireLocker projection={projection} />

      {projection.activePuzzle ? (
        <ActivePuzzle
          key={projection.activePuzzle.id}
          puzzle={projection.activePuzzle}
          projection={projection}
          onClose={props.onClosePuzzle}
          onHint={props.onRequestHint}
          onScanThermal={props.onScanThermal}
          onSubmitThermal={props.onSubmitThermal}
          onSubmitMessage={props.onSubmitMessage}
          onSubmitProtocol={props.onSubmitProtocol}
          onSubmitRoute={props.onSubmitRoute}
        />
      ) : null}

      {projection.lockerOpen && projection.conclusion ? (
        <section className="locker-reveal" aria-live="assertive">
          <p>{projection.conclusion.eyebrow}</p>
          <h2>{projection.conclusion.headline}</h2>
          <span>{projection.conclusion.explanation}</span>
          <div className="reveal-timeline">
            {projection.conclusion.timeline.map((event) => <i key={event.time}><strong>{event.time}</strong>{event.label}</i>)}
          </div>
          <button type="button" onClick={onReset}>사건 다시 풀기</button>
        </section>
      ) : null}
    </section>
  );
}
