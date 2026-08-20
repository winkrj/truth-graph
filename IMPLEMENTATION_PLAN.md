# Star Testimony — Implementation Plan

Status: product and technical bootstrap review only  
Scope: CASE 01 — The Missing Cell  
Core loop: **INVESTIGATE → DISCOVER → CONNECT → VERIFY → SOLVE**

## Planning basis and constraints

This plan is based on the complete 555-line attached product brief and the working agreements supplied with the task. The generated workspace contained no source code, package configuration, physical AGENTS.md, or GAME_DESIGN.md. Therefore:

- This is a greenfield recommendation, not an assessment of existing application patterns.
- The attached brief is treated as the available game-design source of truth.
- The missing GAME_DESIGN.md is a verification gap; it must be reconciled before implementation if a separate design document exists.
- This projectless Codex workspace uses outputs/ as its delivery root. IMPLEMENTATION_PLAN.md and docs/CODEX_LOG.md below are paths relative to that delivery root.
- This task creates planning documents only. It does not initialize an application, install dependencies, or write application code.

The plan deliberately excludes CASE 02/03, runtime AI chat, complex lie systems, trust meters, procedural cases, multiplayer, accounts, persistence, achievements, inventory, a general authoring platform, and backend infrastructure.

## 1. Product Understanding

### What the player is doing

The player is reconstructing an incident from incomplete, separately sourced facts. Investigation exposes facts and explicit relationships, but it does not assemble the decisive explanation. The player must compare two partial accounts, decide that facts from different clusters belong together, express that deduction as a relationship, and then seek evidence that can verify it.

The intended mental loop is:

1. **Investigate:** choose a person or system and a non-leading action.
2. **Discover:** receive evidence; new Fact stars and explicit solid relationships appear.
3. **Connect:** inspect the two incomplete constellations and propose a missing relationship.
4. **Verify:** follow the new line of inquiry opened by that hypothesis.
5. **Solve:** use the confirmed constellation to choose the complete explanation.

The objective is not “click every investigation button.” It is “find the relationship that makes the fragments form one coherent event.”

### What the player thinks about

- Which source is most likely to contain a useful fragment.
- What the five-minute interval between the 09:37 failure and 09:42 access implies.
- Why Jun appears in both the storage-access account and the oxygen-emergency account.
- Whether the missing cell and the damaged generator could be causally connected.
- Which Fact pair and relationship verb best express that connection.
- What additional record could confirm or disprove the idea.
- Which final explanation accounts for the cell, the emergency, and the missing record.

### Decisions the player makes

- Select an investigation target.
- Select a focused, non-leading investigation action.
- Decide when the two visible clusters contain enough information to reason from.
- Select two discovered Fact nodes.
- Select **USED_FOR** as the proposed relationship.
- Pursue the newly available verification action.
- Submit one deterministic final conclusion.

### The “Aha!” moment

The player notices that “E-17 left storage at 09:42” and “Generator #2 failed at 09:37” are not separate stories. Jun’s presence and the time proximity suggest that the missing cell may have powered the emergency response. The player authors:

    E-17 → USED_FOR → Oxygen Generator #2

The game first shows this as the player’s dotted hypothesis. Only after the player investigates emergency-bypass telemetry does the edge become confirmed, the two clusters merge, and **HIDDEN CONNECTION DISCOVERED** appears. The satisfaction comes from the game confirming a connection the player proposed, not from the game announcing the answer.

### Why the graph is gameplay

The Truth Graph is an interactive state machine:

- Investigation changes which nodes and explicit edges exist.
- The player selects nodes and creates a hypothesis edge.
- The hypothesis changes which investigation action is available.
- Verification changes the edge state from HYPOTHESIS to CONFIRMED.
- Confirmation changes the established-evidence topology from two connected components to one.
- The confirmed critical edge gates the final conclusion and case completion.

Removing the graph interaction would remove the central decision and halt progression. That is the test that it is gameplay rather than decoration.

One important modeling rule follows from this: both clusters mention Jun, but they must not share a single visible Jun node. A shared node would connect the clusters before the signature reveal. The graph should instead contain two context-specific Fact nodes—“Jun’s authorization opened storage” and “Jun responded to Generator #2”—tagged with the same actor ID for semantics but kept visually distinct.

For graph-state tests, connected components include only DISCOVERED and CONFIRMED relationships. A dotted HYPOTHESIS is a visible overlay between the still-separated layouts, not yet part of the established-evidence topology. The graph remains spatially separated while the dotted bridge is pending and merges only when that same edge becomes CONFIRMED.

## 2. MVP Vertical Slice

### Smallest complete experience

Use one responsive game screen with three stable regions:

- a short incident/objective header;
- an investigation panel with the current target and its actions;
- the Truth Graph, which remains visible while evidence accumulates.

The incident introduction is:

> Energy Cell E-17 was confirmed in storage at 08:50 and reported missing at 10:05. Investigate what happened.

Use exactly two initial investigation targets:

1. **Station Archive** — inventory, access, alarm, and diagnostic records.
2. **Jun** — the maintenance engineer who responded during the incident window.

The initial actions should be few and non-leading:

| Target | Action | Player-facing result | Graph purpose |
|---|---|---|---|
| Station Archive | Review E-17 inventory history | E-17 was in equipment storage at 08:50; no withdrawal was recorded | Starts Cluster A |
| Station Archive | Check storage access around 09:42 | Maintenance authorization opened storage; Jun used it | Completes Cluster A |
| Station Archive | Review incidents shortly before 10:05 | Generator #2 suffered a regulator failure at 09:37 | Starts Cluster B |
| Jun | What were you repairing? | Jun was dispatched to Generator #2 and stabilized it | Completes Cluster B |

At this point the graph must show two visibly separate connected components:

    Cluster A
    E-17 → Equipment Storage → 09:42 Access
          → Maintenance Authorization → Jun’s storage access

    Cluster B
    09:37 Regulator Failure → Oxygen Generator #2
                             → Jun’s emergency response

The UI then teaches one interaction in context: select one Fact from each cluster and choose a relationship. The intended choice is E-17, **USED_FOR**, Oxygen Generator #2. The edge appears immediately as a dotted HYPOTHESIS.

Although the dotted overlay spans the clusters, their authored positions remain separated and the hypothesis is excluded from established-evidence connectedness until confirmation.

Creating the correct hypothesis unlocks one focused follow-up action:

| Target | Verification action | Evidence |
|---|---|---|
| Station Archive | Inspect emergency bypass telemetry | Generator #2 drew emergency power from a portable E-series cell whose discharge signature matches E-17 |

That evidence causes the deterministic engine to:

1. change the critical edge to CONFIRMED;
2. render it as a solid highlighted relationship;
3. transition the authored graph layout from two clusters to one constellation;
4. emit **HIDDEN CONNECTION DISCOVERED** once;
5. unlock final conclusion submission.

The player then chooses among three concise explanations:

- Jun stole E-17.
- **Jun used E-17 as emergency bypass power and missed the withdrawal record.**
- The inventory system falsely reported E-17 missing.

Only the second option, submitted after the critical edge is confirmed, solves the case.

### Guardrails for the vertical slice

- Do not reveal the critical relationship in an investigation-action label.
- Do not expose bypass telemetry until the player has created the correct hypothesis.
- Do not auto-create the critical edge when both endpoints are discovered.
- Do not use a shared visible Jun node that pre-merges the graph.
- Allow only one active hypothesis in CASE 01; this is enough to test the mechanic.
- Reject an invalid pair or relationship without unlocking verification or changing completion state.
- Do not add scoring, collectibles, branching dialogue, red herrings, persistence, or additional cases.

## 3. Technical Architecture

### Recommended stack

| Concern | Recommendation | Reason |
|---|---|---|
| Frontend | React + TypeScript + Vite | Fast greenfield setup, componentized interaction, strong typed data, and a static production bundle |
| Graph rendering | Native SVG with CASE 01-authored normalized coordinates | Small graph, crisp labels/edges, direct pointer and keyboard interaction, deterministic layout |
| State | React useReducer backed by a pure TypeScript engine | The state surface is small; no state-management dependency is justified |
| Styling/animation | Plain CSS, CSS custom properties, and prefers-reduced-motion | Keeps presentation cheap to change and separate from correctness |
| Case data | JSON-compatible TypeScript object using satisfies CaseDefinition | Compile-time checking while retaining a serializable generation boundary |
| Tests | Vitest for engine, definition, and graph-projection tests | Fits the Vite toolchain and runs deterministic logic without a browser or AI |
| Deployment | Static host from Vite dist, with a locally tested preview build as demo fallback | No server, database, secret, runtime network call, or AI availability risk |

Primary references checked for the recommendation: [Vite static deployment](https://vite.dev/guide/static-deploy.html), [React useReducer](https://react.dev/reference/react/useReducer), and [Vitest](https://vitest.dev/guide/).

Do not add D3, a force-directed graph library, canvas/WebGL, a router, a global state library, a backend, or a schema-validation package for Milestone 0. Reconsider only after playtesting demonstrates a specific unmet need.

### Runtime boundaries

    React UI
       │ sends typed commands
       ▼
    Pure deterministic Game Engine
       │ returns next state + presentation effects
       ├──────────────► UI panels/selectors
       └──────────────► Visible graph projection
                              │
                              ▼
                     SVG renderer + CSS motion

    CaseDefinition ───────────► Engine and graph projection

The engine owns:

- which actions are available;
- which evidence, Facts, and explicit relationships are discovered;
- whether a hypothesis tuple is recognized;
- whether confirmation requirements are satisfied;
- whether an invalid hypothesis is rejected;
- when the critical edge becomes confirmed;
- whether a conclusion is available and correct;
- whether the case is solved.

The UI owns only presentation and input collection. Animation completion events must never advance canonical state.

### Deterministic engine shape

Use a small command transition:

    transition(caseDefinition, previousState, command)
      -> { state: nextState, effects: PresentationEffect[] }

Minimum commands:

    START_CASE
    INVESTIGATE { actionId }
    PROPOSE_HYPOTHESIS { fromFactId, relation, toFactId }
    REQUEST_HINT
    SUBMIT_CONCLUSION { conclusionId }
    RESET_CASE

Minimum stored state:

    phase: "briefing" | "active" | "solved"
    usedActionIds
    discoveredEvidenceIds
    discoveredFactIds
    discoveredExplicitRelationshipIds
    hypotheses
    revealedHintIds
    submittedConclusionIds

“Ready to verify” and “ready to conclude” should be derived selectors, not extra phases. IDs must be stable and authored. Arrays should be normalized or de-duplicated deterministically. Do not use the clock, random values, generated IDs, network state, or animation state in engine transitions.

The engine emits presentation effects such as FACT_DISCOVERED and HIDDEN_CONNECTION_DISCOVERED. An effect is emitted only on the state transition that first produces it. Repeating an action cannot replay the reveal.

### Graph rendering and layout

CASE 01 is small enough for authored coordinates. Store normalized positions for two layouts:

- **separate:** storage and oxygen Facts occupy two distinct, readable regions;
- **confirmed:** both groups settle into one constellation around the confirmed bridge.

SVG renders only the graph projection derived from discovered state. Use stable node IDs and keyed elements so labels preserve spatial identity. When confirmation occurs, CSS transitions positions between the two authored layouts; the new solid edge may receive a short pulse. The banner is a sibling UI effect, not part of graph geometry.

Input should support:

- click/tap to select the first and second node;
- visible focus and selected states;
- keyboard activation for nodes and relationship controls;
- a small sentence-style composer: “[E-17] [USED_FOR] [Oxygen Generator #2]”;
- cancellation before submission;
- a reduced-motion path that swaps layouts without movement.

### Case Definition

The runtime imports one approved CASE 01 definition. The definition contains canonical truth, player-visible content, deterministic unlock rules, graph topology, authored coordinates, hints, and solution conditions. All content that changes truth or progression must be an ID-based rule, never inferred from prose.

Use one hand-authored TypeScript definition for the MVP. A small integrity function should reject duplicate IDs, dangling references, a critical edge configured for automatic discovery, or a solution that does not require the critical edge. A general rule language is unnecessary; CASE 01 only needs “all listed IDs are present” and “relationship has named state.”

### Optional AI boundary

No AI package or endpoint belongs in the runtime. In Milestone 4 only, an offline tool may generate a candidate JSON payload conforming to the same CaseDefinition shape. It must pass structural and semantic checks and human editorial review before being copied into the runtime cases directory. Runtime behavior is identical whether the file was written by a person or proposed by AI.

### Deployment

Build a static Vite dist and deploy it to the team’s existing static host; if there is no existing preference, use a Git-connected static deployment with no environment variables. Before the demo, also verify the production bundle locally and keep that build available on the presentation laptop. The game must remain fully playable after the page has loaded even if network connectivity disappears.

## 4. Proposed Repository Structure

No structure is created during this planning task. The smallest proposed implementation layout is:

    /
    ├── AGENTS.md
    ├── GAME_DESIGN.md
    ├── IMPLEMENTATION_PLAN.md
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    ├── docs/
    │   └── CODEX_LOG.md
    ├── src/
    │   ├── main.tsx
    │   ├── app/
    │   │   ├── App.tsx
    │   │   └── styles.css
    │   ├── ui/
    │   │   ├── BriefingPanel.tsx
    │   │   ├── InvestigationPanel.tsx
    │   │   ├── HypothesisComposer.tsx
    │   │   ├── RevealBanner.tsx
    │   │   └── ConclusionPanel.tsx
    │   ├── graph/
    │   │   ├── TruthGraph.tsx
    │   │   ├── graphProjection.ts
    │   │   └── graphGeometry.ts
    │   ├── game/
    │   │   ├── types.ts
    │   │   ├── engine.ts
    │   │   ├── selectors.ts
    │   │   └── validateCaseDefinition.ts
    │   └── cases/
    │       └── case01.ts
    └── tests/
        ├── case01-definition.test.ts
        ├── case01-engine.test.ts
        └── case01-graph.test.ts

Add this directory only in Milestone 4:

    tools/
    └── scenario-generation/
        ├── README.md
        ├── generateCandidate.ts
        └── validateCandidate.ts

The scenario-generation directory must not be imported by src. Do not create shared “multi-case” services, plugin systems, databases, API routes, or an authoring UI.

## 5. Minimum Case Definition Schema

### Design principles

- **Facts are atomic player-visible propositions.** A character is not automatically a shared graph node.
- **Evidence unlocks Facts and explicit relationships.** Prose cannot mutate state.
- **Critical relationships are rules, not hidden prose.** The player must submit the matching tuple.
- **Conditions are all-of lists.** No general expression language is needed.
- **Presentation is separate from canonical truth.** Layout coordinates never affect validity.
- **Knowledge boundaries reference canonical events.** They constrain authored testimony even though runtime dialogue is prewritten.
- **The solution names required confirmed relationships and one correct conclusion.**

### Minimum type shape

    type CaseDefinition = {
      schemaVersion: 1;
      id: string;
      title: string;
      briefing: {
        incident: string;
        objective: string;
      };
      canonical: {
        timeline: CanonicalEvent[];
        characters: Character[];
      };
      targets: InvestigationTarget[];
      actions: InvestigationAction[];
      evidence: Evidence[];
      facts: Fact[];
      explicitRelationships: ExplicitRelationship[];
      hypothesisRules: HypothesisRule[];
      hints: Hint[];
      conclusions: Conclusion[];
      solution: {
        requiredConfirmedRelationshipIds: string[];
        correctConclusionId: string;
      };
      presentation: {
        graph: {
          clusters: GraphCluster[];
          separatePositions: Record<string, Point>;
          confirmedPositions: Record<string, Point>;
          hypothesisRelationChoices: string[];
        };
      };
    };

    type CanonicalEvent = {
      id: string;
      event: string;
      at?: string;
      afterEventId?: string;
    };

    type Character = {
      id: string;
      name: string;
      role: string;
      knowsEventIds: string[];
    };

    type InvestigationAction = {
      id: string;
      targetId: string;
      label: string;
      revealsEvidenceIds: string[];
      requires?: {
        discoveredFactIds?: string[];
        hypothesisRelationshipIds?: string[];
      };
    };

    type Evidence = {
      id: string;
      sourceTargetId: string;
      supportsEventIds: string[];
      title: string;
      text: string;
      revealsFactIds: string[];
      revealsExplicitRelationshipIds?: string[];
    };

    type Fact = {
      id: string;
      label: string;
      detail: string;
      kind: "object" | "place" | "time" | "event" | "system" | "actor-observation";
      actorId?: string;
    };

    type HypothesisRule = {
      relationshipId: string;
      fromFactId: string;
      relation: string;
      toFactId: string;
      confirmWhenAllEvidenceIds: string[];
      critical: boolean;
    };

### Concrete CASE 01 example shape

This example is intentionally explicit and CASE 01-specific. Copy and wording remain subject to playtest.

    const case01 = {
      schemaVersion: 1,
      id: "case-01",
      title: "The Missing Cell",

      briefing: {
        incident:
          "Energy Cell E-17 was confirmed in storage at 08:50 and reported missing at 10:05.",
        objective:
          "Investigate the fragments, connect the missing relationship, and explain what happened."
      },

      canonical: {
        timeline: [
          { id: "t-0850", at: "08:50", event: "E-17 exists in equipment storage." },
          { id: "t-0937", at: "09:37", event: "Generator #2 pressure regulator fails." },
          { id: "t-response", afterEventId: "t-0937", event: "Jun responds to the oxygen emergency." },
          { id: "t-0942", at: "09:42", event: "Jun opens storage with maintenance authorization." },
          { id: "t-remove", afterEventId: "t-0942", event: "Jun removes E-17." },
          { id: "t-bypass", afterEventId: "t-remove", event: "E-17 powers the emergency oxygen bypass." },
          { id: "t-stable", afterEventId: "t-bypass", event: "The oxygen system stabilizes." },
          { id: "t-no-record", afterEventId: "t-remove", event: "No inventory withdrawal record is created." },
          { id: "t-record-cause", afterEventId: "t-bypass", event: "The emergency response causes Jun to miss the record." },
          { id: "t-1005", at: "10:05", event: "E-17 is discovered missing." }
        ],
        characters: [
          {
            id: "jun",
            name: "Jun",
            role: "Maintenance engineer",
            knowsEventIds: [
              "t-0937",
              "t-response",
              "t-0942",
              "t-remove",
              "t-bypass",
              "t-stable",
              "t-no-record",
              "t-record-cause"
            ]
          }
        ]
      },

      targets: [
        {
          id: "station-archive",
          kind: "system",
          name: "Station Archive",
          actionIds: [
            "review-inventory",
            "check-storage-access",
            "review-incidents",
            "inspect-bypass-telemetry"
          ]
        },
        {
          id: "jun",
          kind: "person",
          name: "Jun",
          characterId: "jun",
          actionIds: ["ask-repair"]
        }
      ],

      actions: [
        {
          id: "review-inventory",
          targetId: "station-archive",
          label: "Review E-17 inventory history",
          revealsEvidenceIds: ["ev-inventory"]
        },
        {
          id: "check-storage-access",
          targetId: "station-archive",
          label: "Check storage access around 09:42",
          revealsEvidenceIds: ["ev-access"]
        },
        {
          id: "review-incidents",
          targetId: "station-archive",
          label: "Review incidents shortly before 10:05",
          revealsEvidenceIds: ["ev-failure"]
        },
        {
          id: "ask-repair",
          targetId: "jun",
          label: "What were you repairing?",
          revealsEvidenceIds: ["ev-jun-response"]
        },
        {
          id: "inspect-bypass-telemetry",
          targetId: "station-archive",
          label: "Inspect emergency bypass telemetry",
          requires: {
            hypothesisRelationshipIds: ["rel-e17-used-for-o2"]
          },
          revealsEvidenceIds: ["ev-bypass"]
        }
      ],

      evidence: [
        {
          id: "ev-inventory",
          sourceTargetId: "station-archive",
          supportsEventIds: ["t-0850", "t-no-record"],
          title: "Inventory History",
          text: "E-17 was present in equipment storage at 08:50. No withdrawal was logged.",
          revealsFactIds: ["f-e17", "f-storage"],
          revealsExplicitRelationshipIds: ["rel-e17-storage"]
        },
        {
          id: "ev-access",
          sourceTargetId: "station-archive",
          supportsEventIds: ["t-0942"],
          title: "Storage Access Log",
          text: "Maintenance authorization opened storage at 09:42. The credential belonged to Jun.",
          revealsFactIds: ["f-access-0942", "f-maint-auth", "f-jun-storage"],
          revealsExplicitRelationshipIds: [
            "rel-storage-access",
            "rel-access-auth",
            "rel-auth-jun"
          ]
        },
        {
          id: "ev-failure",
          sourceTargetId: "station-archive",
          supportsEventIds: ["t-0937"],
          title: "Emergency Alarm Log",
          text: "Generator #2 reported a pressure-regulator failure at 09:37.",
          revealsFactIds: ["f-failure-0937", "f-o2"],
          revealsExplicitRelationshipIds: ["rel-failure-o2"]
        },
        {
          id: "ev-jun-response",
          sourceTargetId: "jun",
          supportsEventIds: ["t-response", "t-stable"],
          title: "Jun’s Testimony",
          text: "Jun was dispatched to Generator #2 and stabilized the oxygen system.",
          revealsFactIds: ["f-jun-response", "f-stabilized"],
          revealsExplicitRelationshipIds: [
            "rel-jun-response-o2",
            "rel-response-stabilized"
          ]
        },
        {
          id: "ev-bypass",
          sourceTargetId: "station-archive",
          supportsEventIds: ["t-bypass"],
          title: "Emergency Bypass Telemetry",
          text: "A portable E-series cell powered the bypass; its discharge signature matches E-17.",
          revealsFactIds: ["f-bypass-signature"],
          revealsExplicitRelationshipIds: ["rel-o2-bypass-signature"]
        }
      ],

      facts: [
        { id: "f-e17", label: "Energy Cell E-17", detail: "Present at 08:50", kind: "object" },
        { id: "f-storage", label: "Equipment Storage", detail: "Last recorded location", kind: "place" },
        { id: "f-access-0942", label: "09:42 Access", detail: "Storage opened", kind: "time" },
        { id: "f-maint-auth", label: "Maintenance Authorization", detail: "Access class", kind: "event" },
        { id: "f-jun-storage", label: "Jun · Storage Access", detail: "Credential owner", kind: "actor-observation", actorId: "jun" },
        { id: "f-failure-0937", label: "09:37 Failure", detail: "Pressure regulator", kind: "event" },
        { id: "f-o2", label: "Oxygen Generator #2", detail: "Emergency system", kind: "system" },
        { id: "f-jun-response", label: "Jun · Emergency Response", detail: "Dispatched engineer", kind: "actor-observation", actorId: "jun" },
        { id: "f-stabilized", label: "Oxygen Stabilized", detail: "Emergency resolved", kind: "event" },
        { id: "f-bypass-signature", label: "E-series Bypass Signature", detail: "Matches E-17", kind: "event" }
      ],

      explicitRelationships: [
        { id: "rel-e17-storage", fromFactId: "f-e17", relation: "LOCATED_IN", toFactId: "f-storage" },
        { id: "rel-storage-access", fromFactId: "f-storage", relation: "ACCESSED_AT", toFactId: "f-access-0942" },
        { id: "rel-access-auth", fromFactId: "f-access-0942", relation: "AUTHORIZED_BY", toFactId: "f-maint-auth" },
        { id: "rel-auth-jun", fromFactId: "f-maint-auth", relation: "USED_BY", toFactId: "f-jun-storage" },
        { id: "rel-failure-o2", fromFactId: "f-failure-0937", relation: "AFFECTED", toFactId: "f-o2" },
        { id: "rel-jun-response-o2", fromFactId: "f-jun-response", relation: "RESPONDED_TO", toFactId: "f-o2" },
        { id: "rel-response-stabilized", fromFactId: "f-jun-response", relation: "RESULTED_IN", toFactId: "f-stabilized" },
        { id: "rel-o2-bypass-signature", fromFactId: "f-o2", relation: "RECORDED", toFactId: "f-bypass-signature" }
      ],

      hypothesisRules: [
        {
          relationshipId: "rel-e17-used-for-o2",
          fromFactId: "f-e17",
          relation: "USED_FOR",
          toFactId: "f-o2",
          confirmWhenAllEvidenceIds: ["ev-bypass"],
          critical: true
        }
      ],

      hints: [
        {
          id: "hint-1",
          text: "Compare the 09:37 emergency with the 09:42 storage access.",
          requiresDiscoveredFactIds: ["f-e17", "f-o2"]
        },
        {
          id: "hint-2",
          text: "What left storage shortly after Generator #2 failed?",
          requiresDiscoveredFactIds: ["f-e17", "f-o2"]
        },
        {
          id: "hint-3",
          text: "Try connecting E-17 and Oxygen Generator #2.",
          highlightFactIds: ["f-e17", "f-o2"],
          requiresDiscoveredFactIds: ["f-e17", "f-o2"]
        }
      ],

      conclusions: [
        { id: "conclusion-theft", label: "Jun stole E-17." },
        {
          id: "conclusion-emergency-use",
          label: "Jun used E-17 to stabilize oxygen and missed the withdrawal record."
        },
        { id: "conclusion-system-error", label: "The inventory system was wrong." }
      ],

      solution: {
        requiredConfirmedRelationshipIds: ["rel-e17-used-for-o2"],
        correctConclusionId: "conclusion-emergency-use"
      },

      presentation: {
        graph: {
          clusters: [
            {
              id: "storage-cluster",
              factIds: [
                "f-e17",
                "f-storage",
                "f-access-0942",
                "f-maint-auth",
                "f-jun-storage"
              ]
            },
            {
              id: "oxygen-cluster",
              factIds: [
                "f-failure-0937",
                "f-o2",
                "f-jun-response",
                "f-stabilized",
                "f-bypass-signature"
              ]
            }
          ],
          separatePositions: {
            "f-e17": [0.12, 0.34],
            "f-storage": [0.23, 0.24],
            "f-access-0942": [0.30, 0.42],
            "f-maint-auth": [0.21, 0.58],
            "f-jun-storage": [0.36, 0.66],
            "f-failure-0937": [0.64, 0.26],
            "f-o2": [0.78, 0.38],
            "f-jun-response": [0.66, 0.56],
            "f-stabilized": [0.84, 0.62],
            "f-bypass-signature": [0.74, 0.76]
          },
          confirmedPositions: {
            "f-e17": [0.35, 0.38],
            "f-storage": [0.19, 0.26],
            "f-access-0942": [0.18, 0.48],
            "f-maint-auth": [0.25, 0.68],
            "f-jun-storage": [0.42, 0.72],
            "f-failure-0937": [0.62, 0.22],
            "f-o2": [0.57, 0.43],
            "f-jun-response": [0.69, 0.59],
            "f-stabilized": [0.83, 0.45],
            "f-bypass-signature": [0.60, 0.76]
          },
          hypothesisRelationChoices: ["USED_FOR", "LOCATED_IN", "RESPONDED_TO"]
        }
      }
    } satisfies CaseDefinition;

### Deterministic state transitions

| Command/state | Rule | Result |
|---|---|---|
| INVESTIGATE | Action exists, prerequisites pass, evidence not already discovered | Add declared evidence/Facts/explicit edges idempotently |
| INVESTIGATE repeated | Evidence already discovered | No canonical state change; no duplicate effects |
| PROPOSE_HYPOTHESIS with undiscovered endpoint | Reject input | No hypothesis and no progression |
| PROPOSE_HYPOTHESIS with wrong pair/relation | Create or show REJECTED result | Verification remains locked |
| PROPOSE_HYPOTHESIS matching critical rule, proof absent | Store HYPOTHESIS | Render dotted edge and unlock bypass telemetry |
| INVESTIGATE bypass telemetry | Required hypothesis exists | Add evidence, re-evaluate, change edge to CONFIRMED, emit reveal once |
| SUBMIT_CONCLUSION before confirmation | Guard fails | Case remains active |
| SUBMIT_CONCLUSION incorrect after confirmation | Record attempt, give bounded feedback | Case remains active; canonical truth is not exposed |
| SUBMIT_CONCLUSION correct after confirmation | All solution requirements pass | Phase becomes SOLVED |

For the one critical rule, accept the player selecting endpoints in either order if the sentence-style composer normalizes them to the authored direction. Do not punish an intuitive click order while still requiring the correct **USED_FOR** meaning.

## 6. Scenario Generation Boundary

### Future offline pipeline

    Human-authored canonical incident truth
      ↓
    Candidate timeline
      ↓
    Characters and explicit knowledge boundaries
      ↓
    Testimony and system-record prose
      ↓
    Evidence-to-Fact mappings
      ↓
    Explicit graph relationships
      ↓
    Hidden critical relationship rules
      ↓
    Optional red herrings and bounded hints
      ↓
    Candidate CaseDefinition JSON
      ↓
    Structural validation
      ↓
    Semantic invariants and deterministic engine replay
      ↓
    Human review, playtest, and approval
      ↓
    Approved runtime CaseDefinition

### Required interface, and no more

The future generator accepts a canonical incident seed and returns a candidate JSON-compatible CaseDefinition plus generation metadata that is discarded before runtime. The runtime accepts only an approved CaseDefinition. It does not know whether the definition originated from AI, a script, or a person.

Validation must check:

- all IDs are unique and references resolve;
- person-sourced evidence declares only supported event IDs within that character’s knowledge boundary;
- evidence unlocks only declared Facts and explicit relationships;
- the critical relationship cannot be auto-discovered;
- confirmation evidence exists but is gated behind the hypothesis;
- at least one deterministic valid investigation path reaches the solution;
- the solution requires the critical confirmed relationship;
- canonical truth, edge validity, completion, and scoring do not depend on prose;
- the same command sequence produces the same result.

Structural validation cannot prove that natural-language prose says only what its supported event IDs declare. Human review must check that mapping and approve factual coherence, clue fairness, prose quality, difficulty, and the final playable path. Do not build this generator until CASE 01 is fun and stable.

## 7. Milestone Plan

### Milestone 0 — Proof of Fun

Goal: determine whether authoring and confirming a missing connection feels satisfying.

Start from a deliberately seeded state in which both CASE 01 clusters are already discovered. Implement only:

- two fixed, readable SVG clusters;
- node selection with clear focus and selection states;
- a small relationship chooser containing **USED_FOR** and a minimal number of plausible wrong choices;
- deterministic invalid-hypothesis rejection;
- a persistent dotted edge for the correct HYPOTHESIS;
- one “Inspect emergency bypass telemetry” verification action;
- CONFIRMED solid-edge treatment;
- fixed-layout constellation merge;
- one **HIDDEN CONNECTION DISCOVERED** reveal;
- reset;
- pure engine and graph-progression tests;
- short first-time-player observation.

Do not build target navigation or the full investigation loop yet. If this interaction is not legible or satisfying, change or delete it before adding more game.

### Milestone 1 — Investigation Loop

- Replace the seeded state with Station Archive and Jun targets.
- Add the four non-leading initial actions.
- Reveal evidence, Facts, and explicit relationships idempotently.
- Teach Fact stars on the first discovery.
- Preserve two graph components until the player’s critical hypothesis is confirmed.
- Add the contextual verification unlock.
- Add focused engine and case-definition integrity tests.

### Milestone 2 — Complete CASE 01

- Add the short incident briefing and in-context onboarding.
- Finish all CASE 01 evidence copy.
- Add the three-step, player-requested hint ladder.
- Add deterministic conclusion choices and incorrect-answer behavior.
- Add the solved/result screen reconstructing the canonical timeline.
- Verify the full reset/replay path.

### Milestone 3 — Polish

Add only improvements that make the existing loop clearer or more memorable:

- selection, edge, and merge motion tuning;
- sound for discovery/confirmation with mute control, only if time permits;
- responsive layout and touch targets;
- keyboard navigation, focus states, contrast, and reduced motion;
- copy tightening;
- demo-viewport, production-build, and offline-after-load checks.

Do not add new systems to create the appearance of scope.

### Milestone 4 — AI Scenario Generation Prototype

Only after CASE 01 is fun, stable, and human-approved:

- define a JSON export boundary matching CaseDefinition;
- generate one candidate structured case offline;
- run structural and semantic validation;
- require human approval before runtime import;
- demonstrate that the runtime uses the same deterministic engine.

Stop at the smallest proof of this content pipeline. Do not build an authoring platform or runtime AI.

## 8. Ranked Risk Analysis

| Rank | Risk | Why it matters | Mitigation / evidence needed |
|---:|---|---|---|
| 1 | Graph interaction is confusing | If players cannot understand how to connect Facts, the core game never starts | Sentence-style composer, explicit selected states, click/tap and keyboard paths; observe fresh players without verbal instruction |
| 2 | The connection feels like UI compliance, not deduction | A forced highlighted pair destroys the “Aha!” | Keep early questions non-leading; do not highlight endpoints until the final rescue hint; require player-authored edge before verification |
| 3 | Graph becomes decorative | Automatic critical edges reduce play to evidence collection | Make HYPOTHESIS state unlock verification and make CONFIRMED state gate conclusion |
| 4 | Investigation becomes button-clearing progression | Clicking all actions can replace reasoning | Use only four initial actions; move focus to the graph once both clusters exist; make the follow-up depend on the hypothesis |
| 5 | Hidden connection is too obvious | If action labels or evidence state the answer, there is no inference | Reveal time, actor, failure, and access separately; reserve identity-matching telemetry for post-hypothesis verification |
| 6 | Hidden connection is too difficult | Players may never choose E-17 and Generator #2 | Use the 09:37/09:42 timing and Jun’s two context Facts; provide a three-step requested hint ladder; measure time to hypothesis |
| 7 | Layout instability or shared identity pre-connects clusters | Drift, overlap, or one shared Jun node ruins the before/after topology | Authored coordinates, context-specific Jun Facts, connected-component tests, fixed demo-viewport review |
| 8 | Animation hurts usability or correctness | Motion can hide labels, cause nausea, or introduce timing races | Stable keyed nodes, short bounded CSS transition, reduced-motion mode, no engine dependence on animation events |
| 9 | Schema becomes overengineered | Time is spent on hypothetical cases instead of playtesting | One CASE 01 definition, all-of conditions only, no generic rule DSL, no generator code until Milestone 4 |
| 10 | Browser/demo reliability fails | A strong mechanic is irrelevant if the build or network fails on stage | Static build, zero runtime network calls, local production-preview backup, target-browser and viewport rehearsal, clean reset |

Additional abuse risk: players may brute-force pairs. For CASE 01, keep one active hypothesis, require an explicit relation verb, and make verification a separate step. Do not add penalties or a scoring system before observing whether brute force is a real recurring problem.

Largest gameplay risk: players interpret “connect Facts” as an unfamiliar graph-editing task instead of a deduction they want to express.

Largest technical risk: unstable graph identity/layout—especially accidentally sharing Jun across clusters—removes the visual two-cluster-to-one-constellation payoff.

## 9. Verification Strategy

All canonical engine tests run from CaseDefinition fixtures without AI, network access, DOM animation, or prose interpretation.

### Pure engine and definition tests

| Required behavior | Concrete test |
|---|---|
| Fact unlock conditions | From initial state, dispatch each investigation action and assert that only its declared evidence, Facts, and explicit relationships are discovered |
| Locked action | Assert bypass telemetry is unavailable before the correct HYPOTHESIS and available immediately afterward |
| Duplicate Fact handling | Dispatch the same action twice and overlapping evidence actions; assert unique IDs, unchanged second state, and no repeated reveal effect |
| Hypothesis creation | With both endpoints discovered, submit E-17 + USED_FOR + Generator #2; assert HYPOTHESIS and a visible dotted edge projection |
| Undiscovered endpoint guard | Propose an edge before discovering one endpoint; assert rejection and no state progression |
| Valid confirmation | Create the correct hypothesis, discover bypass telemetry, assert CONFIRMED and one HIDDEN_CONNECTION_DISCOVERED effect |
| Confirmation idempotence | Repeat the telemetry action; assert no additional confirmation or banner effect |
| Invalid hypothesis | Submit the wrong endpoints or relation; assert REJECTED, telemetry remains locked, and solution requirements remain false |
| Graph progression | At the seeded M0 state and while the dotted HYPOTHESIS overlay is pending, assert two established-evidence connected components and separate authored positions; after confirmation, assert one established-evidence component and the merged layout |
| Critical-edge secrecy | Assert the visible graph contains no critical edge before player submission even if both endpoints are discovered |
| Case completion | Confirm the critical edge and submit the correct conclusion; assert SOLVED |
| Premature conclusion | Submit the correct text/ID before confirmation; assert the case remains active |
| Incorrect conclusion | After confirmation, submit theft/system-error; assert the case remains active and the correct answer is not leaked |
| Deterministic replay | Replay one fixed command list twice against the same definition; deep-compare all resulting states and effects |
| Case integrity | Reject duplicate/dangling IDs, invalid knowledge references, an auto-revealed critical edge, and a solution missing the critical edge |

### UI and browser checks

- Node labels do not overlap at the agreed demo viewport.
- The graph keeps two obvious groups before confirmation and one constellation afterward.
- Dotted HYPOTHESIS and solid CONFIRMED edges are distinguishable without color alone.
- Mouse, trackpad, touch, and keyboard users can create and cancel a hypothesis.
- The reveal message fires once and does not block further input.
- Reduced-motion mode communicates the same state change without movement.
- Reset returns to exactly the same initial state.
- The production bundle loads with no console errors.
- After the first load, the game requires no API or network request to finish.

### Human proof-of-fun checks

Observe at least three first-time players without explaining which nodes to connect. Record:

- time until they understand that Facts are selectable;
- time until they create a hypothesis;
- whether they distinguish dotted and solid edges;
- whether they understand why the verification action appeared;
- whether they notice the constellation merge and reveal;
- whether they can explain the incident afterward;
- whether the moment felt like their deduction or the game’s answer.

The purpose is to decide whether to keep, change, or delete the mechanic—not to produce favorable metrics.

## 10. Hackathon Demo Path

Target duration: approximately 4 minutes.

| Time | Demo beat | What the audience sees |
|---|---|---|
| 0:00–0:20 | Incident | E-17 was present at 08:50 and missing at 10:05; one-sentence objective |
| 0:20–1:05 | Storage investigation | Inventory and access evidence form Cluster A, including 09:42 and Jun’s authorization |
| 1:05–1:45 | Emergency investigation | Alarm record and Jun’s response form a separate Cluster B around Generator #2 |
| 1:45–2:15 | Player reasoning | The screen pauses on two readable constellations; Jun and the five-minute interval are visible in both contexts |
| 2:15–2:40 | Connect | Player selects E-17, USED_FOR, and Generator #2; a dotted bridge appears while the clusters remain spatially separated |
| 2:40–3:05 | Verify | The new bypass-telemetry action supplies matching evidence |
| 3:05–3:25 | Signature reveal | Edge becomes solid, clusters merge, **HIDDEN CONNECTION DISCOVERED** fills the moment |
| 3:25–3:50 | Solve | Player selects emergency use followed by a missed inventory record |
| 3:50–4:10 | Result | A concise reconstructed timeline confirms the full truth |

The differentiator is visible even with no narration: two separate star groups, a player-drawn dotted bridge, evidence confirmation, then one merged constellation.

## 11. Definition of Done — Milestone 0

Milestone 0 is complete only when all of these are true:

### Deterministic behavior

- The seeded CASE 01 graph contains exactly two established-evidence connected components.
- The critical edge is absent until the player explicitly proposes it.
- Selecting E-17 + USED_FOR + Generator #2 creates a persistent dotted HYPOTHESIS.
- While that dotted overlay is pending, the clusters retain separate authored positions and established-evidence connectedness still reports two components.
- At least one wrong pair or relation is deterministically REJECTED and does not advance progress.
- The verification action is unavailable before the correct hypothesis and available after it.
- Verification changes the same edge to CONFIRMED; it does not create a second edge.
- Confirmation includes the critical edge in established-evidence topology, changes it to exactly one component, and triggers the merged layout.
- **HIDDEN CONNECTION DISCOVERED** emits once, including after repeated verification input.
- Reset reproduces the same initial state.
- All M0 pure engine and graph tests pass without AI.

### Interaction and presentation

- A user can complete node selection, relationship choice, hypothesis submission, and verification with pointer or keyboard.
- Dotted and solid edge states are understandable without relying only on color.
- Labels remain readable before, during, and after the merge at the agreed demo viewport.
- Reduced-motion mode preserves the reveal without animated travel.
- The production build loads with no console errors and no runtime network dependency.

### Human proof of fun

- At least three first-time players are observed.
- At least two of three can create the intended hypothesis within two minutes of seeing the seeded graph without being told the endpoints.
- At least two of three correctly explain that the dotted line was their hypothesis and the solid line was confirmed evidence.
- All testers notice the merge/reveal, or the presentation is revised and retested.
- The team can make an evidence-based keep/change/delete decision about the connection mechanic.

A successful build alone does not satisfy Milestone 0.

## Recommended next implementation task

Implement only the Milestone 0 proof-of-fun transition and graph: seed the two authored CASE 01 SVG clusters, support E-17 + USED_FOR + Oxygen Generator #2 as a dotted HYPOTHESIS, unlock one bypass-telemetry verification action, deterministically confirm and merge the graph with one reveal effect, and cover valid, invalid, duplicate, and connected-component transitions with pure tests.
