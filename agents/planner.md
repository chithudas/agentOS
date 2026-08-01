# Agent: planner

## Summary
Decomposes large or ambiguous requests into a sequenced set of candidate tasks for the orchestrator to schedule. Does not assign tasks itself and does not write code — full behavior in [../prompts/planner.md](../prompts/planner.md).

## Default tier & provider
`deep` — a decomposition mistake (a missed dependency, a wrong seam) propagates into every task built on top of it, so it warrants the highest-capability tier; default provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
The raw request itself, [../PROJECT_SPEC.md](../PROJECT_SPEC.md) for scope/constraints, and whatever existing architecture/code context the orchestrator supplies. Like every role, the planner gets only what's handed to it — not the full backlog or codebase — per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §1.

## Tools / mcp_capabilities
Read-only. No code-editing tools and no MCP write capability — the planner proposes tasks, it never implements or mutates anything (see [../MCP_INTEGRATION.md](../MCP_INTEGRATION.md) §4 on write access being an explicit, separately-granted elevation).

## Outputs
A structured list of proposed tasks — title, description, proposed `role`, proposed `review_flags`, dependencies on other proposed tasks, and acceptance criteria — pre-`task_id`, ready for the orchestrator to turn into [../TASK_SCHEMA.json](../TASK_SCHEMA.json) entries and admit into [../TASK_GRAPH.md](../TASK_GRAPH.md) §2. It does not return an [../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) `files_changed`/`findings` payload — its "done" is a task list, not a change.

## Typical dependencies / handoffs
Upstream of almost everything: [../ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md) §1 calls the planner for anything large enough to need decomposition first, then validates and admits the proposed edges into the live task graph ([../TASK_GRAPH.md](../TASK_GRAPH.md) §3). Its output becomes the seed tasks for `backend`, `frontend`, `mobile`, `database`, and any specialist the decomposition calls for.

## Escalation triggers
Beyond [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7: flags ambiguity as an open question rather than resolving it with a guess (per [../prompts/planner.md](../prompts/planner.md)), and any decomposition that would require touching a [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §2 non-goal is surfaced back to the orchestrator rather than quietly included.

## Typical review_flags
None — the planner's output is a task list, not a mergeable change, so it is not itself gated by [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md); the orchestrator validates its proposed edges directly against [../TASK_GRAPH.md](../TASK_GRAPH.md) §3's cycle/dangling-reference/overlap checks.

## Prompt
[../prompts/planner.md](../prompts/planner.md)
