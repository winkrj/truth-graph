# Codex Collaboration Log

## Task

Perform the initial technical and product bootstrap review for Star Testimony, create an implementation plan for a CASE 01 vertical slice, and stop before application implementation.

## Human/Product Decisions Provided

- The product is a small, polished browser game for a short hackathon demonstration.
- The core loop is **INVESTIGATE → DISCOVER → CONNECT → VERIFY → SOLVE**.
- The most important player action is explicitly connecting two apparently unrelated Facts.
- Runtime LLM conversation is not core MVP gameplay.
- AI may later assist with offline scenario content generation, but a human approves the final playable case.
- The deterministic Game Engine owns canonical truth, Fact/relationship validity, hypothesis validation, case completion, and scoring.
- CASE 01 — The Missing Cell is the only case in scope.
- The canonical explanation is emergency use of E-17 for Oxygen Generator #2 followed by a missed inventory record.
- The player must create **E-17 → USED_FOR → Oxygen Generator #2**; it must not appear automatically.
- Confirmation must merge two constellations and display **HIDDEN CONNECTION DISCOVERED**.
- The first task is documentation only: no app code, dependencies, infrastructure, or implementation.

## Codex Analysis Contribution

- Translated the product brief into the smallest complete vertical slice and a proof-of-fun-first milestone sequence.
- Proposed a deterministic command/state boundary in which prose and animation cannot decide game correctness.
- Reduced the graph approach to native SVG with authored CASE 01 layouts rather than a force simulation or graph dependency.
- Identified a topology issue not stated explicitly: using one shared visible Jun node would join the two clusters before the critical reveal. The plan uses two context-specific Fact nodes tagged to the same actor instead.
- Defined a minimal CASE 01 data shape, deterministic hypothesis/verification transitions, a test matrix, ranked risks, and a short demo route.
- Kept the optional scenario-generation interface outside runtime scope and deferred it to Milestone 4.

## Major Technical Recommendations

- React + TypeScript + Vite for a static browser application.
- Native SVG with case-authored separate and confirmed positions.
- A pure TypeScript transition function used through React useReducer.
- One JSON-compatible TypeScript CaseDefinition validated through IDs and a few CASE 01 invariants.
- Vitest for engine, definition, and graph-projection tests that require no AI.
- Static deployment with no backend, secrets, persistence, or runtime network calls, plus a local production-build fallback for the demo.
- No D3/force layout, state library, router, schema package, runtime AI client, or generalized rule language unless later playtesting proves a concrete need.

## Risks Identified

- Largest gameplay risk: the relationship-creation UI may feel confusing or like graph editing rather than deduction.
- Largest technical risk: unstable or prematurely connected graph topology may destroy the two-cluster-to-one-constellation payoff.
- Evidence or action labels may make the critical relationship too obvious.
- Weak guidance may make the relationship too difficult for a first-time player.
- Investigation can regress into clearing buttons if the hypothesis does not change progression.
- Animation can obscure labels or accidentally become coupled to canonical state.
- The CaseDefinition can expand into a general authoring platform before CASE 01 is tested.
- Runtime services, network dependence, or untested production output can reduce demo reliability.

## Files Created

- outputs/IMPLEMENTATION_PLAN.md (delivered as IMPLEMENTATION_PLAN.md)
- outputs/docs/CODEX_LOG.md (delivered as docs/CODEX_LOG.md)

## Verification Performed

- Read the attached 555-line Star Testimony instruction completely.
- Inspected the generated workspace before writing; it contained only outputs/ and work/ and no application files or configuration.
- Searched the workspace and relevant Codex directories for AGENTS.md and GAME_DESIGN.md. No applicable physical files were present. The prompt’s inline working agreements were followed, and the attached brief was used as the available design source; the missing GAME_DESIGN.md is recorded as a verification gap.
- Cross-checked IMPLEMENTATION_PLAN.md against all eleven requested sections, the CASE 01-only scope, the deterministic-truth rule, the named risk topics, required engine tests, the demo path, and the Milestone 0 human-playtest condition.
- Independently cross-reviewed the technical architecture and product loop for the shared-Jun topology issue, overengineering, and signature-moment timing.
- Corrected the review findings that a dotted hypothesis must be excluded from established-evidence connectedness, unspecified event times must not be invented, and NPC knowledge validation requires explicit evidence-source/event references.
- Consulted official Vite, React, and Vitest documentation for the recommended static frontend/test approach.
- No build, automated test, dependency installation, or browser run was performed because no application code exists and the task explicitly stops at planning.

---

## Milestone 0 Implementation — 2026-08-18

### Task

Create the repository-level working rules, initialize the smallest project consistent with the approved plan, implement only the CASE 01 Truth Graph proof of fun, verify it, and stop before investigation or case-progression work.

### Human/Product Decisions Provided

- The latest correction replaces the earlier shared-Jun topology with two genuinely disconnected clusters: Missing Cell contains E-17, Storage, 09:42, and Maintenance Access; Emergency contains Jun, Oxygen Generator #2, and 09:37 Failure.
- The only critical bridge is **E-17 → USED_FOR → Oxygen Generator #2**.
- Milestone 0 uses two-step Fact selection; the player does not choose a relationship type.
- A pending hypothesis must remain visually dotted and must not join canonical connected components.
- Explicit confirmation turns the hypothesis into the canonical bridge, merges the constellations, and displays **HIDDEN CONNECTION DISCOVERED**.
- Invalid pairs receive lightweight feedback without penalties or canonical state changes.
- Reset must make the interaction immediately replayable.
- Investigation, NPCs, full CASE 01 progression, and scenario generation remain out of scope.

### Codex Contribution

- Created `AGENTS.md` as the persistent repository-level product, architecture, scope, interaction, verification, and collaboration contract.
- Added the minimal React, TypeScript, and Vite project plus a single `npm run verify` entrypoint.
- Modeled the corrected CASE 01 topology as authored data and separated the pure deterministic engine, canonical graph projection, native SVG renderer, and CSS presentation.
- Implemented candidate-pair recognition, invalid-pair feedback, an explicit dotted hypothesis state, deterministic confirmation, the component merge, signature reveal, keyboard activation, and reset.
- Added seven focused pure-engine/graph tests covering every required deterministic case.
- Kept the implementation limited to Milestone 0; no runtime AI, backend, generalized editor, investigation flow, or automatic graph layout was added.

### Problems Encountered

- The first attempt to install the newest tool versions exposed Node 23 compatibility and npm dependency-tree issues around Vite 8/Vitest 4.
- A first bridge-animation approach could let the SVG bridge endpoints appear detached while the two cluster groups moved.
- Parallel initialization left two unused bootstrap conflict copies in `src/app`.
- The first integrated review found that the root Node engine range was broader than Vite 7's supported range and that this log still described only the earlier planning phase.

### Solutions

- Used the same approved stack with Node-compatible Vite 7.3.6 and Vitest 3.2.7; no substitute framework or extra runtime dependency was introduced.
- Kept canonical coordinates fixed, used symmetric authored cluster offsets, and scaled the bridge around its midpoint with the same short transition as the constellation merge.
- Removed the two unused bootstrap conflict copies after confirming they were not imported.
- Aligned the declared Node range with Vite's supported versions and appended this factual implementation record.

### Files Created or Changed

- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `.gitignore`
- `index.html`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `src/main.tsx`
- `src/app/App.tsx`
- `src/app/styles.css`
- `src/cases/case01.ts`
- `src/game/types.ts`
- `src/game/engine.ts`
- `src/game/graph.ts`
- `src/graph/TruthGraph.tsx`
- `tests/milestone0.test.ts`
- `docs/CODEX_LOG.md`

`IMPLEMENTATION_PLAN.md` was read and retained unchanged; the latest human correction and `AGENTS.md` control where they differ.

### Verification Performed

- `npm install` completed successfully with the final dependency set.
- Final `npm run verify` passed after the documentation and Node-range corrections: Vitest passed 7/7 tests, TypeScript checking passed, and Vite produced a production bundle.
- A real in-app browser playthrough at 1280×720 exercised an invalid pair, the valid E-17/Oxygen Generator #2 pair, dotted hypothesis, explicit verification, one-component reveal, keyboard activation with Enter/Space, and reset back to two components.
- The browser console contained no warnings or errors during the final playthrough.
- Independent integrated read-only review reported Critical: 0 and High: 0. Its Medium stale-log finding and Low Node-range finding were corrected. The focused follow-up review reported Critical: 0, High: 0, and Medium: 0, with both original findings resolved.
- No first-time human proof-of-fun playtest was performed. Whether this interaction feels like deduction rather than graph editing remains the deliberate human acceptance question for Milestone 0.

---

## Proof of Fun v2 — Causal Reconstruction — 2026-08-19

### Task

Evolve the completed constellation-oriented Milestone 0 into one Korean-first investigation-board prototype that tests whether players can reconstruct a causal incident from incomplete evidence, then stop before NPC systems, AI generation, or broader product work.

### Human/Product Decisions Provided

- Stars, constellations, space, ASTER-9, and the Memory Investigator setting are no longer required product identity.
- The current loop is **INVESTIGATE → DISCOVER → CONNECT → RECONSTRUCT → SOLVE**.
- The board must act as the player's reasoning interface rather than a decorative graph.
- The stronger proof-of-fun question is whether ordered evidence connections feel like reconstructing what caused what, not merely matching one obvious pair.
- The playable experience is Korean-first, including controls, feedback, reveal copy, and accessibility text.
- Proof of Fun v2 uses approximately five to seven evidence items, lightweight chronology, recoverable wrong deductions, a comprehension reveal, and three final conclusions.
- The deterministic **Case Definition → Game Engine → Projection → React UI** boundary remains mandatory.
- Additional cases, NPC systems, procedural generation, runtime AI, a generalized editor, backend, persistence, accounts, scoring, achievements, dragging, and a production generation pipeline remain out of scope.

### Codex Contribution

- Replaced the constellation presentation with one clean modern investigation board while retaining the small React, TypeScript, Vite, native SVG, and CSS stack.
- Authored seven concise CASE 01 evidence cards, five timeline markers, five cause-to-result deduction rules, deterministic prerequisites, one critical relationship, and three conclusion choices.
- Reworked the pure engine and derived board projection for ordered valid, invalid, duplicate, locked, pending, confirmed, conclusion, solved, and reset transitions.
- Implemented cause-first/result-second card selection, a dotted pending hypothesis, explicit confirmation or discard, generic recoverable Korean error feedback, causal-chain emphasis, context dimming, incorrect-conclusion recovery, and the answer-level solved reveal.
- Added authored label positions and simple two-segment edge routing so all five fixed CASE 01 causal statements remain readable without adding an automatic layout engine.
- Updated current repository guidance and game design while preserving `IMPLEMENTATION_PLAN.md` and the earlier Milestone 0 log as historical records.
- Replaced the seven Milestone 0 tests with thirteen focused deterministic v2 tests independent from React and browser APIs.

### Problems Encountered

- The initial critical edge treated a 10:05 missing report as the cause of 09:48 stabilization, which reversed the incident chronology.
- The first reconstruction banner was positioned over the board and obscured the 09:42 access card during browser inspection.
- Native evidence buttons inside SVG `foreignObject` received focus but did not activate reliably through Enter or Space in the browser run.
- The first midpoint-based relationship-label geometry painted the Jun-to-storage label almost entirely beneath opaque cards.
- The generated output directory has no Git repository metadata, so Git status and diff verification were unavailable.

### Solutions

- Reframed the same stable evidence ID as `E-17 보관 이탈` after the 09:42 access event and retained 10:05 only as the later missing-report timeline marker.
- Moved the reconstruction reveal into normal document flow above the board.
- Added explicit Enter/Space handling to the semantic evidence-card buttons while preserving click behavior and disabled states.
- Kept layout deterministic and case-authored: every deduction now provides a label waypoint, and its line routes through that label without overlapping evidence cards or the timeline.
- Kept all correctness, prerequisites, completion, and conclusion decisions in the pure engine; the new positions affect presentation only.

### Files Created, Changed, or Removed

- Updated `AGENTS.md`, `PROJECT_CONTEXT.md`, and `index.html`.
- Created `GAME_DESIGN.md` as the current Proof of Fun v2 design source.
- Updated `src/app/App.tsx` and `src/app/styles.css`.
- Updated `src/cases/case01.ts`.
- Updated `src/game/types.ts`, `src/game/engine.ts`, and `src/game/graph.ts`.
- Updated `src/graph/TruthGraph.tsx` to render the investigation board.
- Added `tests/proof-of-fun-v2.test.ts` and removed `tests/milestone0.test.ts`.
- Appended this entry to `docs/CODEX_LOG.md`.
- Read and retained `IMPLEMENTATION_PLAN.md` unchanged as historical context.

### Verification Performed

- Before behavior changes, the untouched Milestone 0 suite passed 7/7 tests.
- Final `npm test` passed 13/13 v2 tests covering initial evidence, valid and reversed/invalid deductions, plausible theft, duplicates, causal progression, critical unlock, final reconstruction, correct and incorrect conclusions, premature conclusion, reset, and projection isolation.
- Final `npm run typecheck` passed.
- Final `npm run build` passed with Vite 7.3.6 and produced the production bundle.
- Final `npm run verify` passed the 13 tests, TypeScript checking, and the production build in one command.
- A real in-app browser playthrough at 1280×720 covered first load, seven-card readability, Korean document metadata, no horizontal overflow, invalid Jun-to-E-17 reasoning, an early locked critical relationship, valid hypotheses, discard and confirmation, all five deductions, incorrect and correct conclusions, deterministic reset, and Enter/Space activation. The browser console contained no warnings or errors.
- The engine review found one High chronology issue; it was corrected, retested, and re-reviewed with Critical: 0 and High: 0.
- The integrated review found one Medium label-obscuration issue; it was corrected, retested, and re-reviewed with Critical: 0, High: 0, and Medium: 0. The follow-up verified exact bounds for all five labels and confirmed that the authored layout metadata does not affect engine correctness.
- The final label-routing adjustment received deterministic test, typecheck, build, unified verification, and independent geometry review. A second browser screenshot after that presentation-only adjustment was unavailable.
- No first-time human playtest was performed. Automated checks show that v2 exercises more causal decisions than Milestone 0, but only observation of new players can establish whether it actually feels like deduction or produces an Aha moment.
