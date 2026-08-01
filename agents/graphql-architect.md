# Agent: graphql-architect

## Summary
GraphQL schema and federation design: type/field shape, subgraph ownership boundaries, and deprecation strategy. A design/coordination role like `api-designer`, producing a schema artifact rather than a task decomposition.

## Default tier & provider
`deep` — schema decisions are far more expensive to reverse than a REST endpoint once subgraphs and clients depend on them; same leverage argument as `api-designer`. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the existing schema/subgraph definitions (`context.relevant_files`), which service(s) will resolve the new fields, and [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §4 for the overall service topology. Needs consumer requirements from the frontend/mobile tasks that will query the new fields.

## Tools / mcp_capabilities
Write access limited to schema/SDL files and federation config within `file_scope`; read access to resolver implementation code to verify the schema is actually satisfiable by existing or planned resolvers. No write access to resolver implementation itself — that stays with `backend`.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (schema/SDL files), `summary` covering which subgraph owns each new type/field, and deprecation (`@deprecated`) rather than removal for any changed field with existing consumers.

## Typical dependencies / handoffs
Downstream of `planner`; upstream of `backend` (implements resolvers), `frontend`/`mobile`/`ios-specialist`/`android-specialist` (write queries against the schema). Coordinates with `api-designer` only when a project mixes REST and GraphQL surfaces for different resources.

## Escalation triggers
- A requested field requires data from a service that doesn't expose it yet and adding that exposure is out of this task's `file_scope` — needs a `backend` task first.
- A schema change would require removing (not deprecating) a field with active consumers and no deprecation window is defined in [../PROJECT_SPEC.md](../PROJECT_SPEC.md) — escalate per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7.
- Two tasks propose conflicting ownership for the same type across subgraphs.

## Typical review_flags
`docs` — the schema is self-documenting to clients but the deprecation/ownership rationale still needs a docs pass, per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/graphql-architect.md](../prompts/graphql-architect.md)
