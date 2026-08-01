# Dashboard Spec

The architecture behind [dashboard/dashboard-template.html](dashboard/dashboard-template.html). The template is a self-contained static reference implementation with sample data; this spec describes what a live deployment needs.

## 1. Data source
- Backing store: the live [TASK_SCHEMA.json](TASK_SCHEMA.json) task set plus each task's latest [AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json), as maintained by the orchestrator ([ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md)).
- The dashboard is a read-only view. It never writes task state — any action a human takes (approve, reassign, escalate-response) goes through the orchestrator's own interface/API, not a direct dashboard mutation, so [STATE_MACHINES.md](STATE_MACHINES.md) transitions stay single-authored.
- Live deployments replace the template's embedded `TASKS` array with a fetch/subscription against the orchestrator's task store (poll or push — push preferred so state changes reflect immediately per [STATE_MACHINES.md](STATE_MACHINES.md) event-driven scheduling).

## 2. Required views
1. **Task list** (implemented in the template) — filterable by status/role/search, showing findings/notes inline. This is the default view.
2. **Task graph** — renders [TASK_GRAPH.md](TASK_GRAPH.md) as a DAG: nodes colored by state, critical path highlighted, ready-set visually distinct from blocked-on-dependency.
3. **Agent load** — per-role concurrency: how many tasks each [agents/AGENT_INDEX.md](agents/AGENT_INDEX.md) role is running vs. its configured limit ([ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md) §4), surfacing bottlenecks.
4. **Review pipeline status** — per-task, which [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) stages have passed/failed/pending, so a human can see exactly what's gating a `done` transition.
5. **Release view** — current release-in-progress state per [STATE_MACHINES.md](STATE_MACHINES.md) §3, included task list, and changelog draft.

## 3. Escalation surface
Any task an orchestrator has escalated to a human ([ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md) §3) surfaces as a distinct, non-dismissible-until-resolved item — not just another row in the task list. A human's response (decision, answer, risk acceptance) is captured back onto the task's `context.background` field for the next agent that picks it up.

## 4. Design constraints
- Self-contained, no build step required to view it (the template's approach: inline CSS/JS, no external CDN deps) — a live deployment may add a real frontend build, but the reference template stays copy-pasteable.
- Light/dark aware via `prefers-color-scheme`, matching the template.
- Every status/severity color is defined once as a CSS custom property (`--queued`, `--blocker`, etc.) — new states/severities are added there, not hardcoded per-view.

## 5. Extensibility
Plugin-contributed workflow steps or agents ([PLUGIN_SDK.md](PLUGIN_SDK.md)) appear in the dashboard automatically as long as they emit standard [TASK_SCHEMA.json](TASK_SCHEMA.json)/[AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json) shapes — the dashboard does not need per-plugin view code for basic task tracking, only for a plugin that wants a custom visualization (opt-in, registered via the plugin manifest).
