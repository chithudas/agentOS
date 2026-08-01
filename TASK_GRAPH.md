# Task Graph

Tasks form a DAG, not a flat queue. This document specifies how dependencies are declared, validated, and scheduled against. The orchestrator ([ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md) §2) is the sole consumer/mutator of this graph.

## 1. Representation
- Nodes are tasks ([TASK_SCHEMA.json](TASK_SCHEMA.json)), keyed by `task_id`.
- Edges are declared in `context.related_task_ids`, disambiguated by an explicit relation type stored alongside each edge: `depends_on`, `blocks`, `relates_to`.
  - `depends_on`: hard dependency — this task cannot enter `in_progress` until the target is `done` (per [STATE_MACHINES.md](STATE_MACHINES.md) §1).
  - `blocks`: inverse of `depends_on`, recorded for convenience so a task's downstream impact is visible without a reverse-index scan.
  - `relates_to`: soft link for context only (e.g. "same feature area"), never gates scheduling.

## 2. Construction
- The planner ([prompts/planner.md](prompts/planner.md)) proposes `depends_on` edges when it decomposes a request — real seams like "backend endpoint depends on database migration" per [workflows/vertical-slice.md](workflows/vertical-slice.md).
- The orchestrator validates proposed edges before accepting them into the live graph (see §3) and may add edges the planner missed (e.g. two tasks it independently discovers touch overlapping `file_scope` — see [ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md) §5 conflict resolution, which becomes a `depends_on` edge ordered by priority/creation time).

## 3. Validation
Before a new task/edge enters the live graph:
- **Cycle detection** — reject any edge that would create a cycle. A cyclic dependency is a planning error; the orchestrator returns it to `planner` for re-decomposition rather than accepting it.
- **Dangling references** — every `depends_on` target must be a real, currently-tracked `task_id`. A reference to a closed/archived task from a prior release is resolved to "already satisfied," not left dangling.
- **Scope overlap without an edge** — if two unrelated tasks (no declared edge) have overlapping `file_scope`, the orchestrator does not silently allow parallel dispatch; it either serializes them (adding an edge) or flags the overlap back to the planner as a likely mis-decomposition.

## 4. Scheduling use
- **Ready set** = nodes with no incomplete `depends_on` edges. Recomputed on every state transition (event-driven, not polled — see [ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md) §2).
- **Critical path** = longest chain of `depends_on` edges from any ready node to a leaf. Used to break priority ties: among equal-priority ready tasks, the one unblocking the longest downstream chain dispatches first.
- **Fan-out** = independent tasks sharing a `depends_on` predecessor become ready simultaneously and are dispatched in parallel up to each owning role's concurrency limit ([ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md) §4).

## 5. Graph mutation on rework
- A task bounced back into `in_progress` from `in_review` (per [STATE_MACHINES.md](STATE_MACHINES.md)) keeps its existing edges — it does not re-enter the graph as a new node. Downstream tasks that were already dispatched under the assumption of an approved output are the orchestrator's responsibility to re-check (see [ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md) §5).
- A `rejected` task's `depends_on` edges are severed; anything that depended on it needs a replacement task before it can proceed, and the orchestrator surfaces this explicitly rather than leaving downstream tasks silently stuck.

## 6. Visualization
The graph, current state per node, and critical path are rendered on the dashboard per [DASHBOARD_SPEC.md](DASHBOARD_SPEC.md) §4 (graph view) — the flat task-list view in [dashboard/dashboard-template.html](dashboard/dashboard-template.html) is the default; the graph view is an additive mode for the same underlying data.
