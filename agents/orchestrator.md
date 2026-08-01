# Agent: orchestrator

## Summary
Scheduling, dispatch, escalation, and dashboard-truth for the whole AgentOS instance. Full behavior defined in [../ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md); this file is its roster entry.

## Default tier & provider
`deep` — scheduling/escalation decisions have high leverage over everything downstream; default provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
The full live task set and [../TASK_GRAPH.md](../TASK_GRAPH.md), [../PROJECT_SPEC.md](../PROJECT_SPEC.md), and relevant [../MEMORY_ARCHITECTURE.md](../MEMORY_ARCHITECTURE.md) tiers when assembling context for dispatch. The only role that sees the whole backlog, not just one task.

## Tools / mcp_capabilities
Read/write access to the task store and dashboard backing state; no direct code-editing tools — it dispatches, it doesn't implement (see [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §1 "What you must NOT do" equivalent in [../ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md)).

## Outputs
Task assignments, routing/escalation decisions, dashboard state updates. Does not itself produce [../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output — it consumes it from every other role.

## Typical dependencies / handoffs
Upstream of every other role. Downstream of `planner` for decomposition and of every role's returned output for the next scheduling pass.

## Escalation triggers
See [../ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md) §3 — the orchestrator is who escalates, not who gets escalated to.

## Typical review_flags
None — the orchestrator is never itself subject to [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md); it enforces that pipeline on everyone else.

## Prompt
[../prompts/orchestrator.md](../prompts/orchestrator.md)
