# 심사 3분 전 Repository Rules

## Instruction Order

Apply guidance in this order:

1. The human's newest explicit instruction.
2. `AGENTS.md` for persistent repository rules.
3. `GAME_DESIGN.md` for the current playable design.
4. `PROJECT_CONTEXT.md` for current implementation context.
5. `IMPLEMENTATION_PLAN.md` only as historical planning where it does not conflict with newer guidance.
6. `docs/CODEX_LOG.md` as chronological evidence, not a current specification.

Milestone 0, Proof of Fun v2, and Core Fun Candidates 01–02 are historical evidence. Do not rewrite their log entries to make them look current.

## Current Product Mission

The active build is a Korean-first, short-form micro escape game called **심사 3분 전**. The player investigates four physical desk objects, carries information from one puzzle into the next, releases three visible locker latches, and physically discovers the missing demo laptop.

Current loop:

**현장 파악 → 물건 조사 → 정보 발견 → 다른 물건에 적용 → 잠금 해제 → 보관함 개방**

The player fantasy is:

> 내가 단서를 읽은 것이 아니라, 물건을 직접 풀고 정보를 연결해 숨겨진 노트북을 찾아냈다.

The current product question is whether this connected three-minute chain is immediately understandable, lightly challenging, satisfying, and distinctive enough to retain a first-time player.

## Core Fun Candidate 03 Rules

- The first viewport must show the missing laptop incident, the three-minute deadline, the central locked fire-safe locker, two available objects, two dependency-locked objects, and three physical progress latches.
- Avoid a tutorial modal. The player should understand `물건을 조사해 세 개의 잠금을 풀어라` from layout and interaction.
- Thermal scan and message recovery are available in either order.
- Protocol overlay requires both starting rewards: `82°C` and `안전 규정 7조`.
- Route trace requires the protocol reward: `방화 보관실 B-3`.
- The exact route opens the third latch and the locker; the laptop is not rendered or named as found beforehand.
- Every puzzle uses a different semantic interaction: spatial scan, fragment ordering, two-dial alignment, and chronological route tracing.
- One insight per puzzle. No precision, timing, reflex, drag-only action, random failure, or resource-consuming wrong answer.
- Wrong submissions preserve progress. A contextual hint becomes available only after a wrong reasoning attempt; a second hint requires another wrong attempt.
- A puzzle may be closed and revisited without losing solved progress. Reset restores the exact deterministic initial state.
- Do not restore the two-film budget, weak-pair failure, comparison modal, or multiple-choice verdict as the core mechanic.
- Do not visually or semantically reveal B-3, the laptop, solution fields, or later rewards before they are earned.

## Korean-First Rule

All player-facing titles, prompts, controls, feedback, rewards, results, metadata, and accessibility text must be natural Korean. Internal TypeScript names may remain English. Do not expose graph, node, edge, state-machine, or canonical-state terminology to the player.

## Deterministic Architecture

Preserve the one-way boundary:

**Case Definition → Deterministic Game Engine → Derived Case Projection → React UI**

- Case Definition owns puzzle kinds, options, dependencies, authored solutions, rewards, hints, and conclusion.
- The engine owns availability, active puzzle, scans, wrong attempts, hint levels, exact solution validation, solved IDs, latch progress, locker completion, immutability, and reset.
- Projection masks thermal readings until scanned, rewards until solved, hints until requested, and authored solution fields entirely.
- React renders the projection, keeps only transient control arrangement locally, and dispatches typed candidate answers. CSS, animation, time, and prose do not decide correctness.

Runtime gameplay must not depend on randomness, network state, runtime prose interpretation, or AI. Engine tests must run without React, browser APIs, animation, network access, or AI.

Retain the smallest stack: React, TypeScript, Vite, semantic HTML, inline SVG/CSS, pure functions, and Vitest. Add no dependency or architecture when the existing stack can satisfy a demonstrated requirement.

## AI Scenario-Generation Boundary

Runtime gameplay does not depend on an LLM. The future interface is:

**AI-authored structured puzzle chain → validation → human review and playtest → deterministic runtime**

A future candidate case may provide four themed objects, supported interaction-template kinds, explicit dependency IDs, visible options, hidden solution values, rewards used by later puzzles, staged hints, a physical reveal, and an authored conclusion. Do not implement the teammate's generator during the Core Fun Gate or claim it exists.

## Scope Guardrails

Until the human explicitly approves the Core Fun Gate, do not add production deployment, audio, extra cases, runtime AI, generator tooling, NPC systems, generalized editors, backend, persistence, accounts, scoring, achievements, or submission materials.

Automated checks prove deterministic behavior and browser stability, not fun. Human playtest evidence controls the gate.

## Required Verification

Focused tests must cover:

1. initial availability, locked dependencies, hidden readings/rewards, and zero latches;
2. unknown, locked, duplicate, concurrent, and malformed actions;
3. open/close without losing canonical progress;
4. thermal scan masking and scanned-cell submission;
5. wrong answers without progress loss;
6. hint gating and staged reveal;
7. both starting-puzzle orders and latch-one release;
8. protocol prerequisites, exact solution, and latch-two release;
9. route rejection, exact chronological route, and locker opening;
10. terminal immutability, reset, deterministic replay, and projection solution-field isolation.

Run from the repository root:

- `npm install`
- `npm run dev`
- `npm test`
- `npm run typecheck`
- `npm run build`
- `npm run verify`

Before a checkpoint, run relevant tests, typecheck, production build, unified verification, diff checks, an independent read-only review, and a real browser playthrough. Report unverified areas honestly.

## Codex Collaboration

Inspect relevant code, execution paths, current patterns, documentation, Git state, and deployment configuration before behavior changes. Prefer the smallest coherent iteration, preserve unrelated human changes, and use explore → plan → implement → verify.

After meaningful work, append a factual entry to `docs/CODEX_LOG.md`: human feedback, alternatives, player question, prototype changes, browser problems, fixes, files, tests, review, and remaining uncertainty.
