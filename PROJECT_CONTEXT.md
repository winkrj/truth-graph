# Project Context

## Current Checkpoint

The repository contains **심사 3분 전 — Core Fun Candidate 03**, a Korean-first connected micro escape game awaiting human Core Fun Gate feedback.

Candidate 02's illustrated evidence desk was retained as visual evidence, but its two-film selection, independent two-step rituals, comparison modal, and multiple-choice verdict were removed after the human requested distinct clue mini-games, escape-room immersion, light difficulty, a rewarding solve, and a much stronger opening hook.

Production deployment and submission remain blocked on human approval.

## Current Playable Experience

- Incident: the only demo laptop disappeared three minutes before judging.
- Goal: open the large central fire-safe locker.
- First interactions: diagnostic tablet and team phone, in either order.
- Thermal puzzle: scan a 3×3 array and identify the highest residual temperature.
- Message puzzle: reconstruct three damaged fragments.
- Dependency: `82°C + 안전 규정 7조` unlocks the regulation ledger.
- Protocol puzzle: align rule and temperature dials to reveal `방화 보관실 B-3`.
- Route puzzle: trace the chronological access path to B-3.
- Payoff: three visible latches release, locker doors open, and the laptop appears.
- Failure: wrong attempts preserve progress and unlock contextual hints.
- Replay: reset restores the same deterministic hidden state.

## Code Map

- `src/cases/case01.ts` — hook, concise facts, four puzzle definitions, dependencies, options, hidden solutions, rewards, hints, and conclusion.
- `src/game/types.ts` — discriminated puzzle definitions/projections, canonical state, commands, effects, and case contracts.
- `src/game/engine.ts` — pure availability, scan, answer, hint, latch, completion, terminal immutability, and reset logic.
- `src/game/projection.ts` — masked readings, status, rewards, hints, active puzzle, latch count, and locker state.
- `src/ui/EscapeDesk.tsx` — physical desk objects, locker, four semantic puzzle interfaces, hints, rewards, door animation, and conclusion reveal.
- `src/app/App.tsx` — reducer orchestration, first-screen framing, incident brief, puzzle dispatch, progress, and clue wallet.
- `src/app/styles.css` — one-screen operations desk, object/locker art, four puzzle layouts, physical feedback, responsive rules, focus, and reduced motion.
- `tests/core-fun-gate.test.ts` — pure deterministic Candidate 03 coverage independent of React, browser APIs, animation, network, and AI.

Earlier `src/ui/EvidenceDesk.tsx`, `src/ui/CaseDesk.tsx`, graph files, and older tests are historical, not active architecture.

## Canonical Flow

```text
SEARCHING
  ├→ thermal-scan ────────┐
  └→ message-recovery ────┴→ latch 1
                             ↓
                     protocol-overlay → latch 2
                             ↓
                         route-trace → latch 3 → SOLVED

Any active puzzle:
  wrong submission → attempt preserved → hint eligible
  close → SEARCHING with solved/scanned progress preserved

SOLVED → RESET → exact initial SEARCHING state
```

## Technical Baseline

- React 19 + TypeScript + Vite 7.
- Vitest 3.
- No router, state library, graphics package, backend, runtime network call, runtime AI, or countdown correctness.
- Pure `transition(definition, state, command)` is the sole canonical behavior path.
- `projectCase` masks unearned information and does not expose authored solution fields.
- Inline SVG and CSS render physical objects and animations without an additional dependency.

## Commands

Run from this repository root:

```bash
npm install
npm run dev -- --host 127.0.0.1
npm test
npm run typecheck
npm run build
npm run verify
```

Vite selects the next free local port. Use the exact `Local` URL printed in the terminal; the current development run is at `http://127.0.0.1:5175/`.

## Scope Boundary

Until explicit human Core Fun approval: one case only; no audio, additional cases, production deployment, submission documents, runtime AI, generator implementation, generalized editor, backend, persistence, accounts, scoring, or achievements.

## Open Product Risk

Automated tests and browser self-play prove the chain is reachable, deterministic, masked, and replayable. They cannot prove that first-time players notice the right starting objects, that the four puzzles are satisfyingly difficult, that the physical opening retains attention, or that another case would be desirable. The next authoritative evidence is the human playtest.
