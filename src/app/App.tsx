import {
  useMemo,
  useReducer,
  useState,
  type CSSProperties
} from "react";

import { case01 } from "../cases/case01";
import { createInitialState, transition } from "../game/engine";
import { projectBoard } from "../game/graph";
import type {
  GameCommand,
  GameState,
  PresentationEffect
} from "../game/types";
import { InvestigationBoard } from "../graph/TruthGraph";

interface AppMachine {
  game: GameState;
  effects: PresentationEffect[];
  eventSequence: number;
}

const initialMachine: AppMachine = {
  game: createInitialState(),
  effects: [],
  eventSequence: 0
};

function appReducer(machine: AppMachine, command: GameCommand): AppMachine {
  const result = transition(case01, machine.game, command);

  return {
    game: result.state,
    effects: result.effects,
    eventSequence: machine.eventSequence + 1
  };
}

function latestEffect(effects: PresentationEffect[]) {
  return effects.at(-1) ?? null;
}

function phaseItemClass(
  state: "pending" | "active" | "complete"
): string {
  return [
    "phase-track__item",
    state === "active" ? "phase-track__item--active" : null,
    state === "complete" ? "phase-track__item--complete" : null
  ]
    .filter(Boolean)
    .join(" ");
}

export function App() {
  const [machine, dispatch] = useReducer(appReducer, initialMachine);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(
    null
  );
  const projection = useMemo(
    () => projectBoard(case01, machine.game),
    [machine.game]
  );
  const cardsById = useMemo(
    () => new Map(case01.evidenceCards.map((card) => [card.id, card])),
    []
  );

  const activeHypothesis = machine.game.activeHypothesis;
  const latest = latestEffect(machine.effects);
  const effectType = (latest as { type: string } | null)?.type ?? "";
  const reconstructionComplete = projection.reconstructionComplete;
  const solved = machine.game.phase === "SOLVED";
  const boardDisabled =
    Boolean(activeHypothesis) || machine.game.phase !== "RECONSTRUCTING";
  const progress =
    projection.totalDeductionCount === 0
      ? 0
      : (projection.confirmedCount / projection.totalDeductionCount) * 100;

  function handleEvidenceSelection(evidenceId: string) {
    if (boardDisabled) {
      return;
    }

    if (selectedEvidenceId === evidenceId) {
      setSelectedEvidenceId(null);
      return;
    }

    if (!selectedEvidenceId) {
      setSelectedEvidenceId(evidenceId);
      return;
    }

    dispatch({
      type: "PROPOSE_DEDUCTION",
      causeEvidenceId: selectedEvidenceId,
      resultEvidenceId: evidenceId
    });
    setSelectedEvidenceId(null);
  }

  function handleReset() {
    setSelectedEvidenceId(null);
    dispatch({ type: "RESET" });
  }

  function handleDiscard() {
    setSelectedEvidenceId(null);
    dispatch({ type: "DISCARD_HYPOTHESIS" });
  }

  const selectedCard = selectedEvidenceId
    ? cardsById.get(selectedEvidenceId)
    : null;
  const hypothesisCause = activeHypothesis
    ? cardsById.get(activeHypothesis.fromEvidenceId)
    : null;
  const hypothesisResult = activeHypothesis
    ? cardsById.get(activeHypothesis.toEvidenceId)
    : null;

  const invalidEffect = [
    "INVALID_DEDUCTION",
    "DEDUCTION_LOCKED",
    "ACTIVE_HYPOTHESIS_EXISTS"
  ].includes(effectType);
  const duplicateEffect = [
    "DUPLICATE_DEDUCTION",
    "HYPOTHESIS_ALREADY_EXISTS",
    "DEDUCTION_ALREADY_CONFIRMED"
  ].includes(effectType);

  const statusCopy = (() => {
    if (reconstructionComplete) {
      return {
        label: solved ? "사건 해결" : "재구성 완료",
        prompt: solved
          ? "선택한 결론이 모든 인과관계와 일치합니다."
          : "완성된 사건 흐름을 읽고 실제로 일어난 일을 판단하세요.",
        warning: false
      };
    }

    if (activeHypothesis) {
      return {
        label: "가설 확인",
        prompt:
          "두 증거 사이의 인과관계를 검토한 뒤 추론을 확정하거나 다시 선택하세요.",
        warning: false
      };
    }

    if (selectedCard) {
      return {
        label: "원인 증거 선택됨",
        prompt: `‘${selectedCard.title}’을 원인으로 선택했습니다. 이어지는 결과 증거를 고르세요.`,
        warning: false
      };
    }

    if (invalidEffect) {
      return {
        label: "뒷받침되지 않는 추론",
        prompt:
          "현재 증거만으로는 이 관계를 뒷받침할 수 없습니다. 시간과 인과 순서를 다시 살펴보세요.",
        warning: true
      };
    }

    if (duplicateEffect) {
      return {
        label: "이미 확인한 관계",
        prompt: "이 인과관계는 이미 보드에 반영되어 있습니다.",
        warning: false
      };
    }

    return {
      label: "인과관계 재구성",
      prompt:
        "먼저 원인이 된 증거를 선택하고, 그 결과로 이어진 증거를 선택하세요.",
      warning: false
    };
  })();

  return (
    <main className="game-shell">
      <header className="topbar">
        <a className="brand" href="#case-board" aria-label="사건 재구성 수사 보드">
          <span className="brand__mark" aria-hidden="true">
            01
          </span>
          <span>
            <strong>사건 재구성</strong>
            <small>증거를 연결해 실제 흐름을 밝히세요</small>
          </span>
        </a>

        <button className="reset-button" type="button" onClick={handleReset}>
          <span aria-hidden="true">↻</span>
          처음부터
        </button>
      </header>

      <section className="case-intro" aria-labelledby="case-title">
        <div>
          <p className="eyebrow">{case01.eyebrow}</p>
          <h1 id="case-title">
            {case01.title}
            <span> 도난이었을까?</span>
          </h1>
        </div>

        <div className="case-intro__brief">
          <strong>수사 목표</strong>
          <p>{case01.briefing}</p>
          <div className="phase-track" aria-label="수사 진행 단계">
            <div className={phaseItemClass("complete")}>
              <span>1</span>
              증거 확인
            </div>
            <div
              className={phaseItemClass(
                machine.game.phase === "RECONSTRUCTING" ? "active" : "complete"
              )}
            >
              <span>2</span>
              흐름 재구성
            </div>
            <div
              className={phaseItemClass(
                machine.game.phase === "SOLVED"
                  ? "complete"
                  : machine.game.phase === "CONCLUSION"
                    ? "active"
                    : "pending"
              )}
            >
              <span>3</span>
              결론
            </div>
          </div>
        </div>
      </section>

      <section
        className={
          "case-board" + (reconstructionComplete ? " case-board--complete" : "")
        }
        id="case-board"
        aria-label="E-17 분실 사건 수사 보드"
      >
        <div className="board-toolbar">
          <div>
            <p className="eyebrow">수사 보드</p>
            <h2>증거의 원인과 결과를 연결하세요</h2>
          </div>

          <div className="case-progress" aria-label="확정된 추론 진행도">
            <span className="case-progress__copy">
              확정된 추론
              <strong>
                {projection.confirmedCount} / {projection.totalDeductionCount}
              </strong>
            </span>
            <span className="case-progress__bar" aria-hidden="true">
              <span style={{ "--progress": `${progress}%` } as CSSProperties} />
            </span>
          </div>
        </div>

        {reconstructionComplete ? (
          <div
            className="reconstruction-reveal"
            key={"reveal-" + machine.eventSequence}
            role="status"
            aria-live="assertive"
          >
            <p>
              {projection.answerRevealed
                ? "결론이 확정되었습니다"
                : "사건의 흐름이 연결되었습니다"}
            </p>
            <strong>
              {projection.answerRevealed
                ? "E-17은 도난당한 것이 아니었습니다."
                : "고장 대응과 E-17 분실이 하나의 흐름으로 이어집니다."}
            </strong>
            <span>
              {projection.answerRevealed
                ? "긴급 전원으로 사용된 뒤 출고 기록이 누락됐습니다."
                : "완성된 인과관계를 읽고 가장 타당한 결론을 선택하세요."}
            </span>
          </div>
        ) : null}

        <div className="board-stage">
          <InvestigationBoard
            definition={case01}
            projection={projection}
            selectedEvidenceId={selectedEvidenceId}
            disabled={boardDisabled}
            reveal={reconstructionComplete}
            onSelectEvidence={handleEvidenceSelection}
          />

        </div>

        <div className="deduction-workbench">
          <div className="deduction-status">
            <p className="deduction-status__label">{statusCopy.label}</p>
            <p
              className={
                "deduction-status__prompt" +
                (statusCopy.warning
                  ? " deduction-status__prompt--warning"
                  : "")
              }
              role="status"
              aria-live="polite"
            >
              {statusCopy.prompt}
            </p>
            {!reconstructionComplete && !activeHypothesis ? (
              <div className="selection-readout" aria-hidden="true">
                <span>1</span>
                원인
                <span>2</span>
                결과
              </div>
            ) : null}
          </div>

          {activeHypothesis && hypothesisCause && hypothesisResult ? (
            <div className="hypothesis-composer">
              <div className="hypothesis-composer__copy">
                <p className="hypothesis-composer__eyebrow">검토 중인 가설</p>
                <p className="hypothesis-composer__sentence">
                  <span>{hypothesisCause.title}</span>
                  <strong>→ {activeHypothesis.label} →</strong>
                  <span>{hypothesisResult.title}</span>
                </p>
              </div>
              <div className="hypothesis-composer__actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={handleDiscard}
                >
                  다시 선택
                </button>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => dispatch({ type: "CONFIRM_DEDUCTION" })}
                >
                  추론 확정
                </button>
              </div>
            </div>
          ) : (
            <p className="deduction-status__prompt">
              {reconstructionComplete
                ? "인과 흐름을 바탕으로 아래에서 최종 결론을 선택하세요."
                : case01.instruction}
            </p>
          )}
        </div>
      </section>

      {reconstructionComplete ? (
        <section
          className="conclusion-panel"
          aria-labelledby="conclusion-title"
        >
          <div className="conclusion-panel__intro">
            <p className="eyebrow">최종 판단</p>
            <h2 id="conclusion-title">실제로 무슨 일이 있었을까요?</h2>
            <p>
              완성된 인과관계가 가장 자연스럽게 설명하는 결론을 선택하세요.
            </p>
          </div>

          {solved ? (
            <div className="case-solved" role="status" aria-live="polite">
              <strong>사건 해결</strong>
              <p>
                산소 발생기 고장에 대응하는 과정에서 E-17이 긴급 전원으로
                사용됐고, 긴급 정비 중 출고 기록이 누락됐습니다.
              </p>
            </div>
          ) : (
            <div>
              <div className="conclusion-options">
                {case01.conclusions.map((conclusion) => (
                  <button
                    className="conclusion-option"
                    key={conclusion.id}
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "SUBMIT_CONCLUSION",
                        conclusionId: conclusion.id
                      })
                    }
                  >
                    {conclusion.label}
                  </button>
                ))}
              </div>
              {projection.lastConclusion?.result === "INCORRECT" ? (
                <p
                  className="conclusion-feedback"
                  role="status"
                  aria-live="polite"
                >
                  이 결론은 완성된 사건 흐름과 맞지 않습니다. 연결된 원인과
                  결과를 다시 확인하세요.
                </p>
              ) : null}
            </div>
          )}
        </section>
      ) : null}

      <footer className="game-footer">
        <p>정답은 화면 연출이 아니라 확정된 인과관계로 결정됩니다.</p>
        <p>추리 실험 02 · E-17 분실 사건</p>
      </footer>
    </main>
  );
}
