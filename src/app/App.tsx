import { useCallback, useMemo, useReducer } from "react";

import { case01 } from "../cases/case01";
import { createInitialState, transition } from "../game/engine";
import { projectCase } from "../game/projection";
import type { GameCommand, GameState, PuzzleId } from "../game/types";
import { EscapeDesk } from "../ui/EscapeDesk";

function gameReducer(state: GameState, command: GameCommand): GameState {
  return transition(case01, state, command).state;
}

function LockStatus({ opened, index, label }: { opened: number; index: number; label: string }) {
  const isOpen = opened >= index;
  return (
    <li className={isOpen ? "status-lock status-lock--open" : "status-lock"}>
      <span>{isOpen ? "✓" : index}</span>
      <div><strong>{label}</strong><small>{isOpen ? "해제" : "잠김"}</small></div>
    </li>
  );
}

export function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const projection = useMemo(() => projectCase(case01, state), [state]);

  const open = (puzzleId: PuzzleId) => dispatch({ type: "OPEN_PUZZLE", puzzleId });
  const closePuzzle = useCallback(() => dispatch({ type: "CLOSE_PUZZLE" }), []);

  return (
    <main className="game-scene">
      <header className="game-header">
        <div className="game-brand">
          <span className="deadline-pulse" aria-hidden="true" />
          <div><strong>{case01.title}</strong><small>MICRO ESCAPE CASE</small></div>
        </div>
        <div className="game-phase"><span>{case01.eyebrow}</span><strong>{projection.lockerOpen ? "사건 해결" : `${projection.locksOpened} / 3 잠금 해제`}</strong></div>
        <button type="button" className="reset-button" disabled={Boolean(projection.activePuzzle)} onClick={() => dispatch({ type: "RESET" })}><span aria-hidden="true">↻</span> 처음부터</button>
      </header>

      <div className="game-layout">
        <aside className="incident-brief" aria-labelledby="case-hook">
          <p>심사 시작까지 <strong>03:00</strong></p>
          <h1 id="case-hook">{case01.hook}</h1>
          <div className="mission-card"><small>당신의 목표</small><strong>{case01.mission}</strong></div>
          <ul className="known-facts">
            {case01.knownFacts.map((fact) => <li key={fact.id}><span>{fact.label}</span><strong>{fact.value}</strong></li>)}
          </ul>
          <p className="brief-instruction">{case01.instruction}</p>
        </aside>

        <EscapeDesk
          projection={projection}
          onOpenPuzzle={open}
          onClosePuzzle={closePuzzle}
          onScanThermal={(puzzleId, cellId) => dispatch({ type: "SCAN_THERMAL_CELL", puzzleId, cellId })}
          onSubmitThermal={(puzzleId, cellId) => dispatch({ type: "SUBMIT_THERMAL", puzzleId, cellId })}
          onSubmitMessage={(puzzleId, fragmentIds) => dispatch({ type: "SUBMIT_MESSAGE_ORDER", puzzleId, fragmentIds })}
          onSubmitProtocol={(puzzleId, rule, threshold) => dispatch({ type: "SUBMIT_PROTOCOL", puzzleId, rule, threshold })}
          onSubmitRoute={(puzzleId, nodeIds) => dispatch({ type: "SUBMIT_ROUTE", puzzleId, nodeIds })}
          onRequestHint={() => dispatch({ type: "REQUEST_HINT" })}
          onReset={() => dispatch({ type: "RESET" })}
        />

        <aside className="case-status" aria-label="사건 진행 상황">
          <section className="lock-progress">
            <div className="status-heading"><span>방화 보관함</span><strong>{projection.locksOpened} / 3</strong></div>
            <ol>
              <LockStatus opened={projection.locksOpened} index={1} label="상태 단서" />
              <LockStatus opened={projection.locksOpened} index={2} label="보관 규정" />
              <LockStatus opened={projection.locksOpened} index={3} label="출입 경로" />
            </ol>
          </section>
          <section className="clue-wallet">
            <div className="status-heading"><span>발견한 정보</span><strong>{projection.rewards.length} / 4</strong></div>
            <div className="clue-stack">
              {projection.rewards.length ? projection.rewards.map((reward, index) => (
                <article className="clue-ticket" key={reward.label}><span>{index + 1}</span><div><small>{reward.label}</small><strong>{reward.value}</strong><p>{reward.detail}</p></div></article>
              )) : <p className="empty-clues">물건을 조사하면 발견한 정보가 이곳에 쌓입니다.</p>}
            </div>
          </section>
          <section className="chain-preview">
            <span>해결 구조</span>
            <div><i>열화상</i><b>＋</b><i>메시지</i></div>
            <em>↓</em>
            <div><i>규정표</i><b>→</b><i>출입 경로</i></div>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default App;
