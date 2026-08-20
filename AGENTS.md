# Investigation Reconstruction Repository Rules

## Instruction Order

Apply project guidance in this order:

1. The human's newest explicit instruction.
2. `AGENTS.md` for persistent repository rules.
3. `GAME_DESIGN.md` for the current playable design.
4. `PROJECT_CONTEXT.md` for current implementation context.
5. `IMPLEMENTATION_PLAN.md` only as a historical plan where it does not conflict with newer guidance.
6. `docs/CODEX_LOG.md` as chronological evidence of prior decisions and work, not as a current product specification.

The original star/constellation design and Milestone 0 remain useful history in `IMPLEMENTATION_PLAN.md` and `docs/CODEX_LOG.md`. Do not rewrite those historical decisions to make them look current.

## Product Mission

This project is a detective puzzle about reconstructing what happened from incomplete evidence. The player explicitly connects evidence and causal relationships until an apparently suspicious incident has a coherent explanation.

Current core loop:

**INVESTIGATE → DISCOVER → CONNECT → RECONSTRUCT → SOLVE**

The central player fantasy is: **"I figured out how these pieces of evidence fit together."**

The board is the player's reasoning interface, not a passive visualization and not a general graph editor. Prefer causal claims such as "A caused B" over generic association such as "A is related to B."

## Product Identity and Visual Direction

- Stars, constellations, space, ASTER-9, and the Memory Investigator setting are historical concepts, not required product identity.
- The current visual metaphor is a clean, modern investigation board / case board.
- Present understandable evidence objects: testimony, access logs, photos, system records, people, objects, incidents, timestamps, and maintenance reports.
- Favor dark neutral space, readable evidence cards, clear hierarchy, restrained connection lines, subtle time cues, and strong selected/hypothesis/confirmed states.
- Do not build a realistic corkboard simulator or decorate at the expense of comprehension.
- The interface should feel like a game, not a developer graph visualization.

## Korean-First Rule

All player-facing text must be Korean, including:

- titles and instructions;
- evidence labels and descriptions;
- buttons and controls;
- feedback and hypothesis states;
- reveal messages;
- conclusion choices and result copy;
- accessible names and status announcements intended for players.

Internal identifiers, TypeScript types, enum values, and implementation names may remain English. Keep canonical identifiers stable; do not translate them merely for appearance.

## Proof of Fun v2 Rules

The current prototype tests whether causal reconstruction feels like deduction. It uses:

- exactly seven concise, authored evidence cards;
- a lightweight chronology aid where it improves comprehension;
- authored causal deduction rules rather than arbitrary relationship authoring;
- at least one plausible wrong deduction with safe recovery;
- a critical reconstruction that turns suspicious evidence into a coherent innocent explanation;
- a very small authored conclusion set;
- a deterministic reset.

The player selects the cause card first and the result card second. Selection order expresses `cause → result`; the deterministic engine evaluates that ordered pair against authored rules. Do not silently reverse an invalid pair. Add a relationship-type choice only if playtesting shows it improves reasoning; do not add one merely because the data contains edge types.

Invalid deductions must:

- give clear, lightweight Korean feedback;
- leave canonical state unchanged;
- never dead-end the case;
- never reveal the correct answer through the error message.

Prefer feedback in the spirit of: `현재 증거만으로는 이 관계를 뒷받침할 수 없습니다.` Do not reduce the response to `틀렸습니다.`

When the critical causal reconstruction is complete:

1. emphasize the completed causal chain;
2. reduce noise from context-only evidence;
3. make the actual incident easy to read;
4. show a concise Korean comprehension reveal;
5. unlock the small conclusion set.

The case is solved only by an authored correct conclusion after the required reconstruction. Incorrect conclusions receive bounded feedback and preserve a recoverable state. Reset must restore the exact initial evidence state.

## CASE 01 Boundary

The existing CASE 01 story may remain temporarily. Its approximate truth is:

- 08:50 — E-17 is confirmed in storage.
- 09:37 — Oxygen Generator #2 fails and Jun responds.
- 09:42 — storage is accessed with maintenance authorization and E-17 is removed.
- E-17 is used as emergency power; the oxygen system stabilizes.
- The withdrawal record is missed.
- 10:05 — E-17 is reported missing.

The apparent interpretation is theft. The actual interpretation is emergency use followed by an unrecorded withdrawal. Keep story rewrite effort small: the mechanic, not the temporary fiction, is under test.

## Deterministic Architecture

Preserve this one-way boundary:

**Case Definition → Deterministic Game Engine → Derived Board/Graph Projection → React UI**

- **Case Definition:** authored evidence, canonical truth, deduction rules, conclusion rules, and presentation metadata.
- **Game Engine:** pure, deterministic state transitions and validation.
- **Projection:** derives visible cards, links, causal progression, emphasis, and conclusion availability from canonical state.
- **React UI:** collects input and renders projection/effects; it does not decide correctness.
- **Animation:** presentation only; completion events must never determine progression.

Do not use time, randomness, generated IDs, prose interpretation, network state, React-local presentation state, or animation state to decide canonical correctness. Engine tests must run without React, SVG, browser APIs, animation, network access, or AI.

Retain the smallest existing stack: React, TypeScript, Vite, pure functions, explicit types, native browser/SVG/CSS capabilities, and small easy-to-delete modules. Refactor constellation-specific names only when they interfere with the investigation-board model; avoid a cosmetic architecture-wide rename.

## AI Boundary

Runtime AI is unnecessary and must not determine evidence, deductions, truth, progression, or conclusions.

AI scenario generation is a possible future **offline content-authoring** direction only. A future candidate case would require structural validation, deterministic replay, human editorial review, and human playtesting before it could become an approved runtime Case Definition. Do not build that pipeline during Proof of Fun v2.

## Scope Guardrails

Until explicitly requested, do not build:

- CASE 02 or CASE 03;
- NPC investigation systems;
- procedural generation;
- runtime AI;
- a production scenario-generation pipeline;
- a generalized case editor;
- backend services;
- persistence or accounts;
- scoring or achievements;
- complex animations;
- drag-and-drop graph editing;
- arbitrary relationship authoring;
- speculative abstractions for hypothetical future cases.

Keep one evolving application; do not preserve Milestone 0 as a second large app.

## Required Verification

Focused deterministic tests must cover at least:

1. initial evidence state;
2. valid deduction;
3. invalid deduction without canonical mutation;
4. duplicate deduction idempotence;
5. causal progression;
6. critical relationship unlock;
7. final reconstruction state;
8. correct conclusion;
9. incorrect conclusion recovery;
10. deterministic reset.

Run commands from the repository root:

- `npm install` — install dependencies.
- `npm run dev` — start the Vite development server.
- `npm test` — run deterministic tests once.
- `npm run typecheck` — run TypeScript checking without emitting files.
- `npm run build` — typecheck and create the production bundle.
- `npm run verify` — run tests, typecheck, and production build.

Before completion, run tests, typecheck, production build, and `npm run verify`. Also perform a browser playthrough covering first load, evidence readability, valid and invalid deductions, reconstruction, conclusions, reset, and browser console output. Never claim a command or playtest passed unless it was actually performed.

## Codex Collaboration

Before changing behavior, inspect relevant code, real execution paths, existing patterns, and current documentation. Prefer the smallest consistent change and preserve unrelated human edits.

After meaningful work, append a factual entry to `docs/CODEX_LOG.md` covering:

- task;
- human/product decision;
- Codex contribution;
- problems encountered;
- solutions;
- files changed;
- verification performed and any unverified area.

Do not exaggerate Codex's contribution. Human playtesting, not automated checks, answers whether the reconstruction actually feels like deduction.
