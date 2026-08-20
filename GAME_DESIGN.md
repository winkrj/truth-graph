# 심사 3분 전 — Core Fun Candidate 03

## Status

This is the current playable-design source of truth and is awaiting the human **Core Fun Gate** playtest. Do not proceed into production, deployment, or submission scope until the human explicitly approves it.

Earlier graph prototypes and Core Fun Candidates 01–02 remain in Git/history and `docs/CODEX_LOG.md`. They are not the current mechanic.

## Human Evidence and Design Response

The human approved a stronger direction after observing that Candidate 02 still needed:

- a distinct mini-game for each clue;
- the immersion and light challenge of a contemporary escape room;
- a satisfying solved feeling;
- a first screen that immediately communicates what the game is, how to play, and why the player should stay.

The response is not four unrelated mini-games. It is one connected physical incident where each solved object produces information required by a later object.

## Player Question

> 사라진 노트북은 어디에 있으며, 책상 위 물건에서 얻은 정보로 중앙 보관함의 세 잠금을 어떻게 풀 수 있을까?

If the player merely follows highlighted answers or waits for explanatory copy, the mechanic has failed.

## First Ten Seconds

One desktop viewport immediately shows:

- `심사 시작까지 03:00`;
- `팀의 유일한 데모 노트북이 사라졌다`;
- the mission `책상 위 기록을 풀어 중앙 방화 보관함을 여세요`;
- a large central locker marked `LOCKED` and `LOCATION UNKNOWN`;
- three closed physical latches;
- two available objects and two visibly dependency-locked objects;
- the short contextual instruction `물건을 조사해 세 개의 잠금을 풀어라`.

There is no title splash, tutorial modal, or long scroll before the first interaction. The central locker is the visual desire object.

## Core Loop

**현장 파악 → 물건 조사 → 정보 발견 → 다른 물건에 적용 → 잠금 해제 → 보관함 개방**

```text
열화상에서 82°C 발견 ─────┐
                            ├→ 규정 다이얼 해독 → 방화 보관실 B-3
메시지에서 규정 7조 발견 ──┘                         ↓
                                             출입 경로 추적
                                                    ↓
                                             보관함과 노트북
```

Thermal and message puzzles may be solved in either order. The two rewards release latch one and unlock the protocol puzzle. Solving the protocol reveals B-3 and releases latch two. Tracing the exact chronological route releases latch three and opens the locker.

## Four Object Puzzles

### 1. Diagnostic Tablet — Spatial Scan

- A 3×3 thermal array gives subtle visual heat differences but initially masks every numeric reading.
- Clicking a cell scans only that cell and reveals its temperature.
- The player compares scanned values and submits the highest residual temperature.
- Wrong cells preserve scans; hints point first toward a region and then toward the exact cell.
- Reward: `82°C`.

### 2. Team Phone — Message Ordering

- Three damaged fragments begin in a scrambled bank.
- The player selects them into three ordered slots and may remove the last fragment without penalty.
- The authored sentence order is validated only on submission.
- Reward: `안전 규정 7조`.

### 3. Regulation Ledger — Two-Dial Overlay

- This object is locked until the first two rewards exist.
- The rewards are shown as physical evidence inputs above a paper regulations sheet.
- The player cycles a rule-number dial and a threshold-temperature dial.
- `7조 + 80°C` reveals `방화 보관실 B-3` and changes the locker label from unknown to B-3.

### 4. Access Badge Map — Chronological Route

- This object is locked until the B-3 location is known.
- The map shows connected readers with times, a missing outside-exit record, and plausible branches.
- The player selects exactly three nodes in chronological connected order.
- `팀 테이블 → 서쪽 판독기 → 방화실 B-3` opens the third latch.

## Difficulty and Failure

- Target 15–30 seconds and one insight per puzzle.
- No actual countdown failure; `03:00` is narrative urgency, not a hidden timing rule.
- No resource loss, in-run dead end, precision requirement, or full reset after a mistake.
- Wrong submissions keep the puzzle open and preserve canonical progress.
- The first hint is available only after one wrong submission. A stronger second hint requires another wrong submission.
- Buttons name actions, coordinates, fragments, or locations—not the authored solution.
- Later locations, rewards, laptop art, and conclusion remain absent until earned.

## Primary Aha and Physical Payoff

The reasoning Aha is that `82°C` and `규정 7조` together mean emergency isolation rather than theft. The visual payoff follows when the route reaches B-3: three physical latches are open, both locker doors swing outward, and the missing laptop appears inside with `DEMO READY`.

The conclusion is not another quiz. It records what the player's completed chain already proved:

> 유진은 과열된 노트북을 안전 규정에 따라 격리했다. 절도가 아니라 긴급 조치였지만, 인수인계 기록 누락은 실수다.

## Deterministic Content Boundary

```text
Case Definition
  → pure transition engine
    → masked case projection
      → React physical scene
```

Case data owns puzzle dependencies, visible options, hidden solutions, rewards, hints, and conclusion. The engine owns availability, active puzzle, scans, attempts, hints, solutions, latches, completion, immutability, and reset. Projection masks unscanned temperatures, unsolved rewards, unrequested hints, and every solution field. React owns only transient arrangement controls and dispatches typed candidate answers.

## Future AI Scenario Interface

A future scenario generator may output a supported structured chain:

```text
incident + physical goal
four themed puzzle objects
supported interaction-template kind per object
explicit dependency IDs
visible options + hidden solution
reward used by later puzzle
two staged hints
physical final reveal + authored conclusion
```

The candidate must pass reference validation, reachability, solution uniqueness, hidden-information checks, deterministic replay, editorial review, and human playtesting. The current runtime does not use AI, and the teammate's generator is not implemented here.

## Core Fun Gate Questions

1. Can a first-time player name the missing object, goal, primary interaction, and three-lock progress within about ten seconds?
2. Does the central locker create an immediate desire to interact rather than read and leave?
3. Do the four objects feel distinct but part of one incident?
4. Does each reward feel useful because it visibly unlocks or informs a later puzzle?
5. Are the puzzles lightly challenging without becoming chores or pixel hunts?
6. Do wrong answers and hints teach without leaking or punishing?
7. Does the locker opening create a genuine “I figured it out” moment?
8. Would the player voluntarily play another incident built from a different chain?

Only a human playtest can answer these. Stop at the gate.
