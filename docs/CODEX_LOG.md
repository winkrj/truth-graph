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

---

## Core Fun Candidate 01 — Limited Evidence Verdict — 2026-08-20

### Task

Respond to the human playtest finding that Proof of Fun v2 was not intuitive and could be advanced by repeated clicking. Explore whether the graph interaction itself was weak, implement the smallest stronger alternative, self-play it in a real browser, fix the largest observed issue, and stop at the Core Fun Gate before production work.

### Human/Product Evidence

- Highest-priority feedback: `직관적으로 무슨 게임을 하는지 모르겠다. 그냥 여러 번 클릭하다 보니 연결이 됐다.`
- Core fun, immediate comprehension, meaningful decisions, and an Aha moment take priority over preserving prior implementation work.
- The existing graph, E-17 fiction, visual identity, and conclusion flow could be discarded.
- Runtime correctness must remain deterministic, Korean-first, browser-reliable, and independent from AI.
- The first playable loop should demonstrate itself within roughly three minutes and then wait for a human gate.

### Alternatives Considered

1. Fill missing event slots in a timeline: clearest and low-risk, but close to a conventional sequencing puzzle.
2. Choose limited investigation records and commit to a verdict: strongest consequence and short-demo potential.
3. Find one contradiction: compact, but at risk of becoming a one-click spot-the-error exercise.

The implemented candidate uses alternative 2 with four leads, a two-record budget, and one verdict.

### Codex Contribution

- Diagnosed that v2 exposed all seven facts, allowed cost-free pair probing, supplied accepted relationship sentences, and counted engine-accepted links rather than player understanding.
- Designed the explicit player question: whether Yujin stole the laptop or had another reason, and which two records could prove the difference.
- Replaced the graph interaction and E-17 fiction with a familiar missing-demo-laptop incident.
- Authored four lead questions with hidden results, two plausible but insufficient distractors, a decisive temperature-plus-movement pair, a safety-protocol reversal, and three verdicts.
- Replaced graph state with a pure limited-inspection/verdict engine and derived case projection.
- Rebuilt the UI around role, incident, known facts, remaining inspections, semantic record buttons, a combination reveal, one-shot verdict, failure, success, and replay.
- Replaced the v2 test suite with fourteen focused deterministic tests, including a regression guard against leaking decisive hidden facts through verdict labels.

### Browser Problems Found and Fixes

- The first viewport clearly communicated the incident, role, player question, `0 / 2` progress, and the record-selection objective, but the first record buttons initially began below a 1280×720 fold. The opening composition was later compacted so the first two `기록 열기` affordances enter that viewport.
- The correct pair produced the intended 82°C-plus-fire-safe-storage reveal and made the innocent explanation legible before the verdict.
- A weak pair followed by a guessed correct verdict correctly failed, proving that verdict guessing alone cannot solve the run.
- The first failure copy named the exact missing concepts (movement and overheating), making the second attempt too easy. It was changed to explain that suspicion and missing paperwork do not reveal why the action happened, without naming the unchosen records.
- Independent review then found a second answer leak: the third verdict itself named an overheated laptop and fire-safe storage even when neither record had been inspected, and the weak-evidence failure confirmed that verdict as correct. The verdict was rewritten at the interpretation level (`긴급 조치`) and insufficient-evidence feedback no longer confirms whether the selected verdict was right.
- The same review found that record buttons began below a 1280×720 first viewport, uninspected results crossed the projection boundary, and small orange labels had weak contrast. The opening composition was compacted, projection now emits a nullable finding only for inspected leads, `CaseDesk` no longer receives the full case/solution, and the accent was darkened for readable small text.
- Decisive evidence followed by the theft verdict correctly failed with a conflict explanation.
- Reset/replay returned to the same two-inspection starting state.
- Native semantic buttons and visible focus styling are present. An automated browser `press` attempt focused a record button but did not activate it through the browser-control layer, so end-to-end keyboard activation remains unverified rather than claimed.

### Files Created, Changed, or Removed

- Updated `AGENTS.md`, `GAME_DESIGN.md`, `PROJECT_CONTEXT.md`, `index.html`, `src/app/App.tsx`, `src/app/styles.css`, `src/cases/case01.ts`, `src/game/types.ts`, and `src/game/engine.ts`.
- Added `src/game/projection.ts`, `src/ui/CaseDesk.tsx`, and `tests/core-fun-gate.test.ts`.
- Removed active v2 graph files `src/game/graph.ts`, `src/graph/TruthGraph.tsx`, and `tests/proof-of-fun-v2.test.ts`.
- Retained `IMPLEMENTATION_PLAN.md` unchanged as historical context.

### Verification So Far

- Focused `npm test -- --run tests/core-fun-gate.test.ts`: initially 13/13 passed; the answer-leak review fix added a fourteenth regression test.
- `npm run typecheck`: passed after the core implementation.
- Browser self-play covered first load, one-record feedback, the decisive pair, Aha reveal, correct completion, weak evidence plus correct-verdict failure, decisive evidence plus wrong-verdict failure, replay, and a smaller desktop viewport.
- After review fixes, a fresh 1280×720 browser pass showed record-opening affordances in the first viewport, no hidden `82°C` or `방화 보관실` text before the decisive pair, no verdict-correctness confirmation on weak-evidence failure, and a successful corrected decisive path.
- Final `npm run verify` passed: Vitest 14/14, TypeScript checking, and the Vite 7.3.6 production build all completed successfully.
- Final `git diff --check` passed.
- Independent review cycle 1 found one High answer leak, two Medium boundary/first-fold issues, and a small-text contrast issue. After fixes, review cycle 2 reported Critical: 0, High: 0, Medium: 0. The reviewer independently reran 14/14 tests and typecheck and reported no browser console warnings or errors.
- End-to-end Enter/Space activation remains unverified through the browser-control layer; native semantic buttons and visible focus styling are present.
- No first-time human fun assessment has occurred. Core fun is not claimed proven; the build now stops at the human Core Fun Gate.

---

## Core Fun Candidate 02 — Interactive Evidence Desk — 2026-08-20

### Task

Respond to the human playtest finding that Candidate 01's scenario and actions were good, but its identical record cards and verdict choices felt like a portfolio or quiz website. Preserve the meaningful limited-evidence decision while making the clues illustrated, physical, and directly interactive; self-play the new loop and stop again at the Core Fun Gate.

### Human/Product Evidence

- The scenario and action premise should remain.
- The primary problem is presentation and interaction: the build did not feel sufficiently game-like, substantial, or original.
- Clues should be represented as pictures or objects that the player can manipulate.
- Game feel must come from the player's verbs, not by placing illustrations inside the previous text cards.
- This feedback is not Core Fun approval, so production, deployment, and submission work remain blocked.

### Alternatives and Design Decision

- A read-only audit confirmed that Candidate 01's header, hero, status cards, four identical lead buttons, automatic prose reveal, and three-option conclusion created the website/quiz impression.
- The deterministic two-inspection budget, evidence sufficiency, one-shot verdict, hidden-result safeguards, familiar CASE 01 scenario, and small React/Vite stack were retained.
- The presentation and verbs were replaced with one top-down operations desk: observe four illustrated objects, commit an analysis film, perform an object-specific two-step manipulation, receive a physical evidence ticket, explicitly compare two tickets, and stamp a paper verdict.
- Static bitmap generation was not used because the required improvement was code-native interaction and state, not decorative art.

### Codex Contribution

- Replaced the record-card UI with distinct inline-SVG/CSS objects: diagnostic tablet, access badge, asset ledger, and team phone.
- Added four close-up rituals: power and thermal inspection; badge scan and route replay; page flip and missing-row marking; phone wake and message-fragment restoration.
- Added visible semantic target controls alongside range inputs so inspection does not depend on pointer precision or become pixel hunting.
- Added physical analysis-film indicators, evidence tickets, a central comparator, a protocol-reconstruction reveal, a stamped verdict sheet, and physical success/failure reports.
- Extended the deterministic model with committed and revealed evidence IDs, an active ordered inspection, an explicit comparing phase, and typed inspection/comparison commands and effects.
- Kept all hidden findings masked until both authored steps complete and all correctness, limits, comparison, verdict, outcome, and reset decisions engine-owned.
- Updated current repository rules, design source, project context, and page metadata while preserving older design/log history.
- Replaced the Candidate 01 suite with seventeen focused pure tests for film commitment, ordered interaction, masking, concurrent/duplicate rejection, comparison, protocol reveal, success, failures, terminal immutability, projection, and reset.

### Browser Problems Found and Fixes

- The first 1280×720 view now reads as one evidence-unit game screen: dossier on paper, four visually distinct objects on a green operations desk, comparator in the center, and film/evidence HUD on the right.
- The first object art made the diagnostic tablet's heat spot and ledger's missing cell too answer-specific. Those initial illustrations were neutralized so the correct pair is not visually highlighted before investigation.
- Range controls were reliable for a human pointer but awkward through the browser-control layer and risked becoming precision chores. Semantic pictured-region controls were added for thermal, route, and message restoration interactions while retaining the ranges.
- The comparison reveal was first captured during its deliberate scan-line opening animation and appeared vertically compressed; after the 420 ms animation completed, the full reveal was correctly sized and readable.
- The decisive path successfully produced `82°C + 방화실 = 안전 격리`, unlocked the report, accepted the supported verdict, and displayed the reconstructed incident.
- The weak ledger-plus-phone path displayed neither `82°C` nor `방화 보관실`, rejected the verdict for insufficient evidence, and did not confirm whether the chosen verdict was correct.
- Independent review found one High semantic leak: the phone restoration's intermediate bubble said `배터리 경고가 떴어`, letting a distractor expose the unchosen diagnostic cause and creating evidence that the authored engine still rejected. It was replaced with a neutral rehearsal/location line and browser-rechecked; no battery, thermal, or 82°C cue remains in that path.

### Files Created, Changed, or Removed

- Updated `AGENTS.md`, `GAME_DESIGN.md`, `PROJECT_CONTEXT.md`, `index.html`, `src/app/App.tsx`, `src/app/styles.css`, `src/cases/case01.ts`, `src/game/types.ts`, `src/game/engine.ts`, and `src/game/projection.ts`.
- Added `src/ui/EvidenceDesk.tsx`.
- Replaced the active test contents in `tests/core-fun-gate.test.ts`.
- Removed the superseded `src/ui/CaseDesk.tsx`.
- Retained the already-removed v2 graph files and `IMPLEMENTATION_PLAN.md` as historical context rather than restoring them.

### Verification Performed

- Focused Candidate 02 tests passed 17/17 after implementation and again after the review fix.
- TypeScript checking passed after implementation and after the review fix.
- Final `npm run verify` passed: Vitest 17/17, TypeScript checking, and the Vite 7.3.6 production build completed successfully.
- Final `git diff --check` passed.
- Real in-app browser self-play at 1280×720 covered initial comprehension, tablet and badge object interactions, two physical evidence tickets, explicit decisive comparison, Aha reveal, verdict sheet, solved report, replay, ledger and phone interactions, weak comparison, insufficient-evidence failure, and the post-review phone-leak regression.
- Review cycle 1 found one High hidden-answer/solution-integrity issue in the phone intermediate message. It was fixed, retested, and re-reviewed. Review cycle 2 reported Critical: 0 and High: 0 for the fix and found no new blocker.
- No first-time human playtest has approved this candidate. Whether the object rituals feel playful and original enough remains the deliberate Core Fun Gate question.

---

## Core Fun Candidate 03 — 심사 3분 전 — 2026-08-20

### Task

Respond to the human's direction that each clue should feel like a different modern escape-room puzzle, with an immediately legible opening, light challenge, one immersive incident, and a satisfying physical payoff. Implement the approved direction, self-play the entire chain in a real browser, and stop at the revised Core Fun Gate before production, deployment, or submission work.

### Human/Product Evidence

- Candidate 02 was more game-like, but still felt too simple and insufficiently original.
- The human wanted different mini-games for different clues, while keeping them intuitive enough to understand at a glance and just difficult enough to make solving rewarding.
- The opening needed to answer immediately: what happened, what the player should do, and why the player should want to continue.
- The human approved moving forward with the connected escape-room direction by saying `좋아 가자`.
- This approval authorized Candidate 03 implementation; it was not approval of the later Core Fun Gate or production scope.

### Design Decision

- The player question is: where is the missing demo laptop, and how can the desk objects be combined to release the three latches on its fire-safe locker?
- Four unrelated mini-games were rejected in favor of one dependency chain. A thermal scan reveals `82°C`; message reconstruction reveals `안전 규정 7조`; those two values unlock a two-dial protocol overlay revealing `방화 보관실 B-3`; that location unlocks a chronological route trace and the final latch.
- Thermal and message puzzles can be solved in either order. Wrong answers preserve progress, and contextual hints appear only after an attempt.
- The multiple-choice verdict, two-film budget, full-reset penalty, and website-style record cards were removed.
- The opening presents a missing laptop, `03:00` narrative urgency, a large locked safe, three visible latches, two immediately usable objects, and two dependency-locked objects in one viewport.
- The payoff is physical and authored: all three latches open, the safe doors part, and the missing laptop appears with `DEMO READY`. The conclusion is a solved incident report rather than another quiz.

### Codex Contribution

- Re-authored CASE 01 as `심사 3분 전`, a Korean-first connected micro escape game.
- Replaced the Candidate 02 inspection/comparison/verdict model with four deterministic puzzle types: 3×3 thermal scanning, ordered message fragments, two-value protocol dials, and a chronological route trace.
- Rebuilt the pure engine around prerequisites, active-puzzle control, wrong-attempt preservation, two-stage hints, latch progression, exact solutions, solve immutability, and deterministic reset.
- Added a privacy-preserving projection that masks unscanned readings, locked protocol options, locked route data, unsolved rewards, authored solutions, and the final conclusion.
- Rebuilt the scene with code-native SVG/CSS objects, a central animated fire-safe locker, physical clue tickets, distinct puzzle overlays, visible dependency states, and a solved laptop reveal without new dependencies or external assets.
- Added keyboard modal behavior: initial focus, Tab/Shift+Tab containment, Escape close, background reset blocking, trigger restoration, and a next-available-object fallback after a solved trigger becomes disabled.
- Replaced the Candidate 02 test contents with twenty-two focused deterministic tests.

### Browser Problems Found and Fixes

- The first implementation leaked `B-3` on the unopened safe, included the hidden laptop text in the DOM, and named B-3 in the locked route prompt. All three leaks were removed; the safe begins as `LOCATION UNKNOWN`, the laptop does not exist in the DOM until solve, and the route prompt remains generic until its dependency is earned.
- The final 1280×720 opening clearly showed the incident, player goal, central locked safe, `0 / 3` latches, two available objects, and two visibly locked objects without scrolling.
- Full browser self-play covered a wrong answer, first hint, corrected answer, both source clues, protocol failure and recovery, location reveal, route failure and recovery, all three latch releases, the safe-door animation, laptop reveal, solved report, and replay.
- Replay returned to the same masked initial state with no B-3, no `DEMO READY`, zero rewards, and zero open latches.
- Review found that the stronger second hint initially required an unnecessary second wrong answer. The engine and projection now allow the second hint on another request after the first wrong attempt, with a regression test.
- Review also found incomplete modal keyboard behavior. Initial focus, focus containment, Escape close, reset blocking, and focus restoration were added. A follow-up review identified the solved-trigger edge case; the final browser check confirmed that solving thermal moves focus to the next available team-phone object instead of leaving focus on the newly disabled tablet.

### Files Created, Changed, or Removed

- Updated `AGENTS.md`, `GAME_DESIGN.md`, `PROJECT_CONTEXT.md`, `index.html`, `src/app/App.tsx`, `src/app/styles.css`, `src/cases/case01.ts`, `src/game/types.ts`, `src/game/engine.ts`, and `src/game/projection.ts`.
- Added `src/ui/EscapeDesk.tsx` and rewrote `tests/core-fun-gate.test.ts`.
- Removed the superseded `src/ui/EvidenceDesk.tsx` while retaining older history in this log and Git.
- Created `work/core-fun-iteration-3.md` outside the application directory as the iteration design note.
- Retained `IMPLEMENTATION_PLAN.md` unchanged as historical planning context.

### Verification Performed

- Focused Candidate 03 tests passed 22/22 after the hint and accessibility fixes.
- TypeScript checking passed after the same fixes.
- `git diff --check` passed.
- Real in-app browser self-play at 1280×720 covered the complete wrong/hint/right dependency chain and solved reveal. A final focused browser pass verified initial answer masking, modal reset blocking, initial focus, Escape behavior, and focus movement to the next available object after success.
- Independent review cycle 1 reported Critical: 0 and High: 0, plus two Medium hint/accessibility findings. Review cycle 2 confirmed the hint fix and the main modal fixes with Critical: 0 and High: 0, then identified the disabled-trigger focus edge case. That edge case was patched and directly browser-tested; the two-cycle review limit was respected.
- Final `npm run verify` passed: Vitest 22/22, TypeScript checking, and the Vite 7.3.6 production build all completed successfully. Final `git diff --check` also passed. No deployment or submission verification was performed because both remain blocked by the human Core Fun Gate.
- No first-time human has yet judged this candidate fun, immersive, or original enough. Those qualities remain the explicit gate rather than an automated claim.

---

## Candidate 03 Public Playtest Deployment — 2026-08-20

### Task and Human Decision

The human requested an immediate deployment so people around them could play Candidate 03 and provide reactions. This authorizes a public playtest build; it is not a declaration that the Core Fun Gate has passed and does not authorize submission-package work.

### Deployment Decisions and Problems

- The validated Candidate 03 source was committed on `playtest/core-fun-candidate-03` first so the experimental state could remain identifiable.
- The Vercel branch preview built successfully but redirected anonymous visitors to Vercel login because preview deployments are protected on this project.
- The stable production alias `https://truth-graph.vercel.app/` was already public but initially served the older Proof of Fun v2 build.
- Because the human explicitly needed a shareable URL, the same validated Candidate 03 commit was fast-forwarded to `main`, allowing the existing GitHub-to-Vercel production integration to update the public alias.
- A logged-out temporary Vercel upload was not used after its safety approval was rejected. No workaround or untrusted upload was attempted.

### Production QA and Follow-up Fix

- Anonymous HTTP verification returned `200` from `https://truth-graph.vercel.app/` without a login redirect and returned the Candidate 03 title and authored production assets.
- In-app browser QA loaded the public initial screen with the missing-laptop hook, `0 / 3` progress, no B-3 answer, and no hidden `DEMO READY` laptop text.
- Public interaction QA opened the thermal tablet, scanned B3, confirmed `82°C`, and returned to the desk.
- That production pass exposed a focus timing edge case: when browser automation opened a puzzle while `BODY` was focused, the modal cleanup considered `BODY` a usable restoration target. The focus therefore did not move to the next playable object.
- The cleanup now waits for the post-commit animation frame and restores the previous target only when it matches the same focusable-control selector used by the modal. Otherwise it focuses the first enabled desk object or the enabled reset control.
- Local reproduction began with `BODY` focused and finished with the team-phone button focused. The corrected production bundle reproduced the same result.

### Verification Performed

- Gameplay commit tested and deployed: `ee1e05481d9a370a1e32d0d5be8374d736460a15`.
- Final `npm run verify` passed: Vitest 22/22, TypeScript checking, and the Vite 7.3.6 production build completed successfully.
- `git diff --check` passed.
- Independent review cycle 1 reported Critical: 0 and High: 0 for the post-commit focus timing change. Production QA then exposed the noninteractive-origin case; review cycle 2 reported Critical: 0 and High: 0 after that predicate was corrected.
- GitHub reported the Vercel production deployment for the gameplay commit as successful.
- The public alias returned the corrected `index-lwiz_3G1.js` bundle, loaded without authentication, survived a fresh navigation, and accepted the first playable interaction.
- Final public playtest URL: `https://truth-graph.vercel.app/`.
- Feedback from real first-time players is still pending and remains the evidence required to approve or reject the Core Fun Gate.
