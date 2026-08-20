# Proof of Fun v2 — Game Design

## Status and Precedence

This document is the current playable-design source of truth for Proof of Fun v2. The human's newest explicit instruction and `AGENTS.md` take precedence. `IMPLEMENTATION_PLAN.md` describes the earlier constellation-oriented plan and remains historical where it conflicts with this document.

## Design Thesis

The game tests whether players feel that they reconstructed an incident, not whether they can operate a graph editor.

Core loop:

**INVESTIGATE → DISCOVER → CONNECT → RECONSTRUCT → SOLVE**

Player fantasy:

> 흩어진 증거가 어떻게 이어지는지 내가 알아냈다.

The investigation board is the player's reasoning interface. Every accepted connection must express an authored deduction about what caused what. Completing the board should answer:

> 그래서 실제로 무슨 일이 있었던 거지?

## Product Direction

- The star/constellation/space direction is historical and may be removed.
- ASTER-9 and the Memory Investigator setting are not required product identity.
- The current visual metaphor is a modern investigation board / case board.
- Evidence appears as concise, recognizable cards rather than abstract stars.
- The presentation favors clarity, causality, readable Korean, and restrained motion over decorative realism.
- Do not build a photorealistic corkboard or a free-form node editor.

All player-facing copy is Korean. Stable internal identifiers and TypeScript names remain English where appropriate.

## CASE 01 Truth

The story is temporary; avoid expensive narrative expansion. Its approximate authored truth is:

1. 08:50 — E-17 is confirmed in storage.
2. 09:37 — Oxygen Generator #2 fails.
3. Jun begins an emergency response.
4. 09:42 — Jun accesses storage with maintenance authorization and removes E-17.
5. E-17 is used as auxiliary emergency power.
6. 09:48 — the oxygen system stabilizes.
7. During the emergency response, the withdrawal record is missed.
8. 10:05 — E-17 is reported missing.

The apparent interpretation is that E-17 was stolen. The actual interpretation is that E-17 was used during emergency maintenance and its withdrawal was not recorded.

## Playable Slice

Proof of Fun v2 has three phases: evidence, reconstruction, and conclusion. It is one clean evolution of the existing prototype, not a second application.

### Phase 1 — Evidence

Show exactly seven immediately readable cards. Initially, do not show their complete causal structure.

| Internal ID | Korean card title | Concise visible meaning | Role |
|---|---|---|---|
| `inventory-0850` | `08:50 재고 확인` | E-17 보관 확인 | Context |
| `generator-failure-0937` | `산소 발생기 2번 고장` | 09:37 고장 경보 | Core |
| `jun-emergency-response` | `준의 긴급 대응` | 고장 직후 정비 출동 | Core |
| `storage-access-0942` | `09:42 창고 출입` | 정비 권한으로 출입 | Core |
| `e17-missing` | `E-17 보관 이탈` | 09:42 출입 직후 보관 위치에서 사라짐 | Core |
| `system-stabilized-0948` | `09:48 시스템 안정화` | 보조 전원 연결 후 정상화 | Core |
| `no-withdrawal-record` | `출고 기록 없음` | 재고 반출 내역 없음 | Core |

Use a lightweight chronology cue for 08:50 → 09:37 → 09:42 → 09:48 → 10:05 when it helps comparison. The board remains primary if the timeline competes with it.

Each card should communicate an evidence type such as system record, access log, person/response, object state, or incident. Keep text short enough to scan without opening a detail view.

### Phase 2 — Reconstruction

The smallest interaction is ordered two-card deduction:

1. Select the evidence that represents a cause.
2. Select the evidence that represents its result.
3. Let the deterministic engine evaluate the ordered pair.
4. If supported and currently available, preview the authored Korean relationship sentence.
5. Confirm the deduction; otherwise recover immediately from lightweight feedback.

Selection order means `cause → result`. Do not silently normalize the reverse order. The UI may offer cancel/reselect, but it must not offer arbitrary edge drawing or a general relationship palette. A relationship-type chooser is unnecessary in this slice because the authored contextual label carries the meaning.

The five accepted deductions are:

| Order | Cause → Result | Korean relationship | Prerequisite | Purpose |
|---:|---|---|---|---|
| 1 | `generator-failure-0937` → `jun-emergency-response` | `긴급 대응 유발` | None | Failure causes the response |
| 2 | `jun-emergency-response` → `storage-access-0942` | `창고 접근으로 이어짐` | None | Emergency work explains the access |
| 3 | `storage-access-0942` → `e17-missing` | `E-17 반출로 이어짐` | None | Access explains the object's disappearance |
| 4 | `jun-emergency-response` → `no-withdrawal-record` | `기록 누락 유발` | Deductions 1 and 2 | Emergency pressure explains the missed record |
| 5 | `e17-missing` → `system-stabilized-0948` | `긴급 전원으로 사용` | Deductions 1–4 | Critical link: E-17 explains stabilization |

Only one supported deduction is pending at a time. It appears visibly uncertain/dotted until the player confirms it, and the player may discard it to choose again. A confirmed authored deduction is solid. Canonical causal progression comes only from confirmed authored rules; CSS, animation, and line geometry cannot advance it.

The intended reconstructed shape is conceptually:

```text
산소 발생기 2번 고장
  → 준의 긴급 대응
      → 09:42 창고 출입
          → E-17 반출/분실
              → 09:48 시스템 안정화
      → 출고 기록 누락
```

`08:50 재고 확인` establishes context but is not required in the causal chain. After reconstruction, it may be visually de-emphasized while remaining readable.

The board does not need to render this as one literal vertical chain. Layout may bend or branch if the causal order remains immediately legible.

#### Wrong Deductions

At least one plausible wrong interpretation must be selectable. The canonical example is:

`jun-emergency-response` → `e17-missing`

This represents the tempting theft reading. It is unsupported and must not create a confirmed link, unlock progression, or mutate any other canonical state.

Use clear, lightweight Korean feedback such as:

> 현재 증거만으로는 이 관계를 뒷받침할 수 없습니다.

Do not say only `틀렸습니다`, reveal the correct pair, impose a penalty, or create a dead end. The player can immediately reconsider and select another pair. Duplicate accepted deductions are idempotent.

### Critical Reconstruction Reveal

The fifth deduction is the critical comprehension moment. When confirmed:

1. complete and emphasize the causal chain;
2. reduce visual noise from the context card;
3. make the failure → response → access → E-17 → stabilization path easy to read;
4. retain the record-omission branch as part of the explanation;
5. show `사건의 흐름이 연결되었습니다`;
6. unlock the conclusion choices.

This reveal communicates that a coherent explanation now exists, but it does not disclose which conclusion is correct. It is not a topology counter, constellation merge, or decorative success animation.

### Phase 3 — Conclusion

After reconstruction, present exactly three concise Korean conclusions:

1. `준이 E-17을 훔쳤다.`
2. `재고 시스템 오류로 E-17이 사라졌다.`
3. `E-17은 긴급 정비에 사용됐고 출고 기록이 누락됐다.`

The third conclusion is correct. A correct submission naturally follows from the reconstructed board, solves the case, and may state the answer-level reveal:

> E-17은 도난당한 것이 아니었습니다.

An incorrect conclusion gives bounded Korean feedback, keeps the reconstruction intact, does not disclose the correct answer, and allows another choice. There is no score.

### Reset

Reset restores exactly the same seven-card initial evidence state, clears selections, pending/confirmed deductions, feedback, reconstruction emphasis, conclusion attempts, and solved state. It must be deterministic and immediately replayable.

## Deterministic Product Boundary

Runtime data flows in one direction:

```text
Case Definition
  → Deterministic Game Engine
    → Derived Board/Graph Projection
      → React UI
```

- Case Definition owns the seven evidence cards, canonical truth, five ordered deduction rules, prerequisites, conclusion rules, and presentation metadata.
- The engine owns valid/invalid/duplicate evaluation, causal prerequisites, critical unlock, reconstruction completion, conclusions, solved state, and reset.
- Projection derives visible links, relationship status, emphasis, and conclusion availability.
- React owns input collection and presentation only.
- Animation never decides when a deduction, reconstruction, or solution is complete.

No runtime AI is needed. AI scenario generation is a possible future offline authoring tool only; candidate content would require deterministic validation, human editorial approval, and playtesting before runtime import.

## Proof-of-Fun Questions

Primary question:

> 증거를 직접 연결해 사건의 인과관계를 재구성하는 행동이 실제로 추리하는 느낌을 주는가?

Secondary questions:

1. Is the goal understandable without explanation?
2. Does ordered cause/result selection promote thought instead of random clicking?
3. Does wrong-deduction feedback help without giving away the solution?
4. Does chronology improve comprehension?
5. Does the completed causal structure create an Aha moment?
6. Is this stronger than Milestone 0's constellation/pair-matching prototype?

Observe first-time players to answer these. Automated tests prove determinism, not fun.

## Required Deterministic Coverage

Tests independent from React and presentation cover at least:

1. exact initial seven-card evidence state;
2. valid ordered deduction;
3. invalid deduction with unchanged canonical state;
4. duplicate deduction idempotence;
5. prerequisite-based causal progression;
6. critical relationship unlock only after prior deductions;
7. final reconstructed state;
8. correct conclusion after reconstruction;
9. incorrect conclusion recovery;
10. deterministic reset.

## Explicitly Out of Scope

- CASE 02 and CASE 03;
- NPC investigation systems;
- procedural generation;
- runtime AI;
- production scenario-generation tooling;
- generalized case editing;
- backend, persistence, or accounts;
- scoring or achievements;
- complex animation;
- drag-and-drop graph editing;
- arbitrary relationship authoring.

Stop when this v2 evidence → reconstruction → conclusion loop is playable and verified.

## Historical Note

Milestone 0 displayed two space-themed Fact constellations and tested one obvious E-17 → `USED_FOR` → Oxygen Generator #2 bridge. Its deterministic separation of Case Definition, engine, projection, and React remains valuable. Its star identity, constellation merge, English player copy, one-pair proof, and `HIDDEN CONNECTION DISCOVERED` presentation are not current requirements.

See `docs/CODEX_LOG.md` for the factual record and `IMPLEMENTATION_PLAN.md` for the original plan. Do not retrofit those historical documents to make them appear to describe v2.
