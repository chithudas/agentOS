# Agent: backend

## Summary
Implements server-side APIs, background jobs, service integrations, and business logic. Full behavior in [../prompts/backend.md](../prompts/backend.md).

## Default tier & provider
`standard` — the default tier for most backend/frontend/mobile/database work per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §1; default provider per §4.

## Inputs
The task's `file_scope` and `context.relevant_files` beyond the base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields — typically the API contract or schema it's implementing against, plus any prior decisions in `context.background`, most often a preceding `database` task's output.

## Tools / mcp_capabilities
Code-editing tools scoped to `file_scope`, plus whatever `mcp_capabilities` the task grants for reaching external services it integrates with (per [../MCP_INTEGRATION.md](../MCP_INTEGRATION.md) §3). Write-capable MCP tools only if the task explicitly requests write capability (§4).

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) with `files_changed`, `tests_added`, and a real (never fabricated) `tests_run` result, per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §4 and §8. If `review_flags` includes `security` or `privacy`, `summary` states what specifically those reviewers should look at (new auth path, new data flow, new external call).

## Typical dependencies / handoffs
Frequently downstream of `database` — an endpoint depending on a schema/migration landing first is the canonical example in [../TASK_GRAPH.md](../TASK_GRAPH.md) §2 — and of `api-designer`/`planner` for contract shape. Upstream of `qa` (nearly always) and `security` (when auth or data is touched), then often `docs` if the change is user- or developer-facing.

## Escalation triggers
Beyond [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7, per [../prompts/backend.md](../prompts/backend.md): the task needs a database schema that doesn't exist yet and isn't in `file_scope`/`context.relevant_files` (request the `database` role's task first), or `acceptance_criteria` are ambiguous enough that two reasonable implementations would satisfy the letter but not the intent.

## Typical review_flags
`qa`; `security` if the change touches auth or data (per the roster in [AGENT_INDEX.md](AGENT_INDEX.md)).

## Prompt
[../prompts/backend.md](../prompts/backend.md)
