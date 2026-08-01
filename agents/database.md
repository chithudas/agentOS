# Agent: database

## Summary
Owns schema design, migrations, and query/index changes. Full behavior in [../prompts/database.md](../prompts/database.md).

## Default tier & provider
`standard` — per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §1; default provider per §4.

## Inputs
The task's `file_scope` (migration files, schema definitions, query modules) and `context.relevant_files` for existing constraints/relationships the change must not silently conflict with.

## Tools / mcp_capabilities
Code-editing tools scoped to `file_scope`, plus `database-readonly` (or the deployment's equivalent registered capability tag) for schema inspection during planning — the exact example [../MCP_INTEGRATION.md](../MCP_INTEGRATION.md) §3 uses for this role. Any capability that can mutate a live database beyond the task's own migration is write-capable and requires explicit task authorization (§4).

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) with `files_changed` and `tests_run` recording that the migration actually applied and rolled back cleanly in a real/test environment — never just claimed. A documented rollback plan in `summary` for any destructive change the task explicitly authorized.

## Typical dependencies / handoffs
Frequently upstream of `backend` — an API endpoint depending on the schema landing first is the canonical seam in [../TASK_GRAPH.md](../TASK_GRAPH.md) §2 — and of `data-engineer` where pipeline infrastructure builds on the schema. Downstream of `planner`/`api-designer` for data-model requirements.

## Escalation triggers
Beyond [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7, per [../prompts/database.md](../prompts/database.md): the requested change would require a destructive operation not authorized by the task, or the schema change conflicts with an existing constraint/relationship not mentioned in the task's context.

## Typical review_flags
`security` if the change is PII-adjacent (per the roster in [AGENT_INDEX.md](AGENT_INDEX.md)).

## Prompt
[../prompts/database.md](../prompts/database.md)
