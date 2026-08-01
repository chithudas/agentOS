# VS Code Integration

The AgentOS VS Code extension surface — how a developer interacts with the task graph, agents, and dashboard without leaving the editor.

## 1. Views
- **AgentOS panel** (sidebar): live task list, same data as [dashboard/dashboard-template.html](dashboard/dashboard-template.html), filtered to tasks touching files in the currently open workspace by default.
- **Inline annotations**: review findings ([REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) `findings`) render as editor diagnostics (squiggles + hover) at their `location`, same severity color mapping as the dashboard.
- **Task detail webview**: opening a task from the panel shows its full [TASK_SCHEMA.json](TASK_SCHEMA.json)/[AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json) content — description, acceptance criteria, files changed, findings — as a rendered webview (embeds the dashboard's task-detail rendering logic, not a separate implementation).

## 2. Commands
- `AgentOS: Create task from selection` — seeds a new task's `description`/`context.relevant_files` from the current selection/file, handed to the orchestrator for triage (role assignment, workflow selection).
- `AgentOS: Assign to agent` — for a human who already knows which specialist should own something, bypassing planner decomposition for a task simple enough not to need it.
- `AgentOS: Show task graph` — opens the [TASK_GRAPH.md](TASK_GRAPH.md) DAG view in a webview, same rendering as [DASHBOARD_SPEC.md](DASHBOARD_SPEC.md) §2 item 2.
- `AgentOS: Resolve escalation` — surfaces any task escalated to a human ([ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md) §3) that touches the open workspace, lets the developer answer inline.

## 3. Editor integration boundaries
- The extension never lets a human directly edit an agent's in-flight output to "fix it up" — per [STATE_MACHINES.md](STATE_MACHINES.md), state transitions are orchestrator-authored. A human can comment/redirect (feeding back into task context) or escalate-resolve, not silently rewrite the task's recorded output.
- File-scope violations ([AGENT_CONTRACT.md](AGENT_CONTRACT.md) §4) surface as a warning if a human tries to manually edit a file that's currently locked to an in-flight task's `file_scope`, to prevent silent merge conflicts with an agent's in-progress work.

## 4. Authentication & connection
- The extension connects to a running AgentOS orchestrator instance (local or remote) over the same interface the dashboard uses ([DASHBOARD_SPEC.md](DASHBOARD_SPEC.md) §1) — it is a client, not a second orchestrator implementation.
- Credentials/connection config live in workspace settings, never hardcoded, never logged.

## 5. Notifications
- A task the developer created, is watching, or that touches files they have open surfaces a native VS Code notification on state changes that matter to a human: `blocked`, escalated, or `done` with review findings above `low` severity. Routine `in_progress → in_review` transitions don't spam notifications.
