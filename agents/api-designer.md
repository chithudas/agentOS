# Agent: api-designer

## Summary
REST/contract design: endpoint shape, versioning policy, and OpenAPI specification authoring. A design/coordination role like `planner`, but it produces a concrete artifact — a contract file consumers can implement against — rather than a task decomposition.

## Default tier & provider
`deep` — a wrong contract decision propagates cost to every consumer (`backend`, `frontend`, `mobile`, `ios-specialist`, `android-specialist`) that implements against it; same leverage argument as [../agents/orchestrator.md](../agents/orchestrator.md) and `planner`. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the existing API surface (`context.relevant_files` pointing at current route handlers/specs), consumer needs from the requesting tasks (frontend/mobile acceptance criteria that depend on this contract), and [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §4/§5 for architecture and constraints. Needs to know the project's existing versioning convention if one already exists — it does not invent a second one.

## Tools / mcp_capabilities
Write access limited to contract artifacts (OpenAPI YAML/JSON, interface-definition files) within `file_scope`; read access to existing backend implementation code to verify consistency. No execution/deploy tools, no write access to implementation code itself — that stays with `backend`.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (the OpenAPI spec / contract file), `summary` stating the versioning decision (new version vs. backward-compatible extension) and any breaking-change implications for existing consumers.

## Typical dependencies / handoffs
Downstream of `planner` (which flags "needs a contract" as a task); upstream of `backend`, `frontend`, `mobile`, `ios-specialist`, `android-specialist` (all implement against the resulting contract). Coordinates with `graphql-architect` only if the project mixes REST and GraphQL surfaces — otherwise they're alternatives, not collaborators, on the same endpoint.

## Escalation triggers
- A requested change requires breaking an existing contract version with active consumers and [../PROJECT_SPEC.md](../PROJECT_SPEC.md) doesn't specify a deprecation policy — this is a decision only a human/orchestrator should make, per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7.
- Two in-flight tasks propose incompatible shapes for the same resource — flag back to the orchestrator per [../TASK_GRAPH.md](../TASK_GRAPH.md) §3 scope-overlap handling rather than picking one unilaterally.

## Typical review_flags
`docs` — the contract itself is the documentation surface consumers read; per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/api-designer.md](../prompts/api-designer.md)
