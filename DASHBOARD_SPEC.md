# Dashboard Spec

The architecture behind [dashboard/dashboard-template.html](dashboard/dashboard-template.html) and its reference live server, [dashboard/status-server.js](dashboard/status-server.js). Together these are a real, runnable local dashboard, not just a static mockup — this spec describes how the pieces fit and what a fuller deployment would add.

![AgentOS status board sample](docs/dashboard-preview.png)

## 0. Install-time status board
Both installers ([`bin/cli.js`](bin/cli.js) and [`install.sh`](install.sh)) always copy three files to the **host project's root** — not nested inside the `agentos/` subdirectory — the moment AgentOS is installed:
- `agentos-status.html` — the dashboard UI (from `dashboard/dashboard-template.html`)
- `status-server.js` — a zero-dependency Node HTTP server (from `dashboard/status-server.js`) that serves the UI and a live `/api/tasks` endpoint reading `agentos-tasks.json` off disk, bound to `127.0.0.1` only
- `agentos-tasks.json` — the task ledger the orchestrator writes to (seeded empty, from `dashboard/agentos-tasks.example.json`)

Run `node status-server.js` and open `http://localhost:4500` for a live view. This is real, working infrastructure, not a description of what one would need to build — the reference orchestrator loop is: decompose work into [TASK_SCHEMA.json](TASK_SCHEMA.json)-shaped entries, append/update them in `agentos-tasks.json` as tasks are dispatched and completed, and the page polls that file every few seconds and re-renders. If any of the three files already exists at root, the installer skips that one and says so rather than overwriting it. If `agentos-tasks.json` is empty or the server isn't running, the page falls back to its baked-in sample data, clearly labeled as such rather than presented as real progress.

## 1. Data source
- Backing store: `agentos-tasks.json`, an array of [TASK_SCHEMA.json](TASK_SCHEMA.json)-shaped entries each carrying its latest [AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json)-shaped `output`, maintained by whatever is acting as orchestrator ([ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md)) for the project — a Claude Code session, a custom agent runner, or a future standalone orchestrator process.
- The dashboard is a read-only view. It never writes task state — any action a human takes (approve, reassign, escalate-response) goes through the orchestrator's own process, not a direct dashboard mutation, so [STATE_MACHINES.md](STATE_MACHINES.md) transitions stay single-authored.
- `status-server.js` is the reference read path (poll `agentos-tasks.json`, serve it as JSON). A fuller deployment may replace the polling loop with a push/subscription channel (WebSocket, SSE) against a real orchestrator process instead of a flat file — the frontend's `loadLive()` function is the only piece that would need to change.

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
