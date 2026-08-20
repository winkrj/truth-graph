# Investigation Reconstruction Project Context

## Purpose

This is a small browser detective game about reconstructing an incident from incomplete evidence. The player's meaningful action is to connect evidence into authored causal deductions and then decide what actually happened.

The repository may retain the historical working name "Star Testimony," but stars, constellations, space, ASTER-9, and the Memory Investigator setting are no longer required product identity.

## Current Phase

**Proof of Fun v2 — Causal Reconstruction**

Primary product question:

> 증거를 직접 연결해 사건의 인과관계를 재구성하는 행동이 실제로 추리하는 느낌을 주는가?

The current loop is:

**INVESTIGATE → DISCOVER → CONNECT → RECONSTRUCT → SOLVE**

This replaces Milestone 0's narrower test of whether connecting one obvious pair felt like deduction rather than graph editing.

## Current Deliverable

- One Korean-first CASE 01 investigation-board prototype.
- Seven concise evidence cards, including lightweight time information.
- Ordered cause/result card selection across five authored causal deductions.
- Valid, invalid, and duplicate-deduction handling without arbitrary graph editing.
- Recoverable wrong deductions that do not corrupt canonical state or disclose the solution.
- A critical reconstruction reveal that makes the innocent explanation readable.
- A small deterministic conclusion set with correct and incorrect outcomes.
- Reset for repeated playtests.

The temporary CASE 01 truth remains emergency use of E-17 for Oxygen Generator #2 followed by a missed withdrawal record, although unnecessary space-fiction wording may be removed from the visible experience.

## Current Experience Direction

- **Visual metaphor:** modern investigation board / case board, not constellations and not a realistic corkboard simulation.
- **Reasoning emphasis:** causality and chronology over generic association.
- **Player-facing language:** Korean throughout, including accessibility copy.
- **Reveal goal:** comprehension — suspicious evidence resolves into a coherent incident — rather than a decorative graph merge.
- **Interaction:** select cause, then result; the engine evaluates the ordered pair and the player confirms its authored contextual relationship without a relation palette.

## Architecture

The deterministic boundary is:

**Case Definition → Game Engine → Derived Board/Graph Projection → React UI**

- **Frontend:** React + TypeScript + Vite.
- **State:** React dispatches typed commands to a pure deterministic transition function.
- **Case data:** one small authored CASE 01 TypeScript definition.
- **Projection:** canonical state derives visible evidence, causal links, reconstruction emphasis, and conclusion availability.
- **Presentation:** React, native SVG/HTML, and CSS render state; presentation cannot decide correctness.
- **Tests:** Vitest exercises engine and projection without React or browser APIs.
- **AI:** no runtime dependency; future scenario generation, if pursued, is offline authoring followed by validation and human approval.

Avoid broad renames that do not help the current model. Existing graph code may remain where it cleanly serves the board projection.

## Scope Boundary

Proof of Fun v2 stops once the evidence-to-reconstruction-to-conclusion loop is playable and verified. It excludes additional cases, NPC investigation systems, procedural generation, runtime AI, a scenario pipeline, generalized editing tools, backend, persistence, accounts, scoring, achievements, and elaborate animation.

## Source Documents

- `AGENTS.md` — persistent repository rules and instruction priority.
- `GAME_DESIGN.md` — current v2 product and interaction source of truth.
- `PROJECT_CONTEXT.md` — current implementation context and scope.
- `IMPLEMENTATION_PLAN.md` — historical bootstrap/Milestone 0 plan; use only where not overridden.
- `docs/CODEX_LOG.md` — factual chronological history, including the constellation prototype.

Do not rewrite `IMPLEMENTATION_PLAN.md` to match v2. The transition is intentionally preserved in the log and current documents.

## Verification

Run from the repository root:

```bash
npm test
npm run typecheck
npm run build
npm run verify
```

The browser acceptance path covers first load, evidence readability, valid and invalid deductions, causal reconstruction, incorrect and correct conclusions, reset, and console output.

## Open Product Questions

1. Is the goal understandable without explanation?
2. Does the board provoke reasoning rather than random pair clicking?
3. Does wrong-deduction feedback help without leaking the answer?
4. Does chronology improve causal comprehension?
5. Does the completed structure create a genuine Aha moment?
6. Is this a stronger test of deduction than the constellation prototype?

Automated verification cannot answer these questions. Observe first-time players before expanding scope.
