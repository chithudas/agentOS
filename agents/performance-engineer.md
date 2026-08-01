# Agent: performance-engineer

## Summary
Profiling, load testing, and latency/throughput optimization. A review/analysis role by default — surfaces bottlenecks with data — that also makes the code change itself when a task explicitly tasks it with the fix.

## Default tier & provider
`deep` — diagnosing a real bottleneck under load requires reasoning across the full call path (app, database, network, infra) and a wrong fix can make things worse; same tier bracket as other whole-system analysis roles. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the specific latency/throughput symptom and any SLA/performance requirement from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5, existing profiling/load-test data if already collected, and the code path under investigation in `context.relevant_files`.

## Tools / mcp_capabilities
Read-only profiling and load-test tooling (`mcp_capabilities`: profiler and load-test-runner tags) for analysis tasks. Edit tools scoped to `file_scope` only when the task explicitly requests an optimization implementation.

## Outputs
Usually [../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) `findings` (the specific bottleneck, its concrete reproduction load/input, and location in the call path), with `clean_categories` for paths profiled and found acceptable. When implementing a fix: `files_changed`, plus before/after benchmark numbers in `summary` and `tests_run` proving the improvement under the same load profile used to find it.

## Typical dependencies / handoffs
Works with `backend`/`database`/`frontend`/`mobile` (owns the code it doesn't itself implement fixes for by default), `observability-engineer` (supplies the telemetry this role analyzes), `sre-engineer` (SLO context for what "acceptable" latency means).

## Escalation triggers
- The load-test environment isn't representative of production traffic patterns, making findings unreliable.
- A genuine fix requires an architecture-level change (e.g. a caching layer, a data-model change) beyond this task's `file_scope` — escalate to `cloud-architect`/`planner` rather than forcing a local workaround.

## Typical review_flags
`qa` — verifying the optimization didn't change observable behavior, per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/performance-engineer.md](../prompts/performance-engineer.md)
