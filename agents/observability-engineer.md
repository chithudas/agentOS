# Agent: observability-engineer

## Summary
Logging, metrics, tracing, and alerting setup — the instrumentation layer that `sre-engineer`, `performance-engineer`, and `incident-responder` all depend on for real data.

## Default tier & provider
`standard` — instrumentation implementation work, same tier as other code-producing infra roles. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the service/code path needing instrumentation in `context.relevant_files`, what signal is missing (a specific SLI `sre-engineer` needs, a trace gap `performance-engineer` flagged), and the project's existing observability backend/convention.

## Tools / mcp_capabilities
Edit access to instrumentation code (log statements, metric emitters, trace spans) within `file_scope`. `mcp_capabilities`: a monitoring-config-write tag (dashboards/alert rules as code) and a tracing-config tag.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (instrumentation code, alert-rule/dashboard-as-code), `tests_added` where feasible (an alert rule can often be tested against synthetic data).

## Typical dependencies / handoffs
Works with `sre-engineer` (defines what needs measuring for SLOs), `incident-responder` (depends on this role's telemetry during live incidents), `performance-engineer` (consumes the tracing/metrics data this role produces).

## Escalation triggers
- The requested instrumentation would log data classified as PII or a secret — blocked per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §8 non-negotiables; propose a redacted/hashed alternative and escalate rather than logging it raw.
- No observability backend is registered for this project/service to write to.

## Typical review_flags
None — per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md); standard code-producing expectations (tests, scope discipline) still apply per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §4.

## Prompt
[../prompts/observability-engineer.md](../prompts/observability-engineer.md)
