# Agent: sre-engineer

## Summary
SLOs, error budgets, reliability posture, and on-call process. Mostly advisory (findings and recommendations, like a review role) but can implement reliability tooling — alerting rules, runbooks, failover config — when a task explicitly asks.

## Default tier & provider
`deep` — SLO/error-budget decisions and reliability trade-offs have the same architecture-level leverage as `security`/`privacy` review; same tier reasoning as [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §1's "deep" bracket. Provider per §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: current SLIs/SLOs and incident history if tracked in `context.background`, the relevant service's architecture from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §4, and any performance/SLA requirements from §5.

## Tools / mcp_capabilities
Read-only observability access (`mcp_capabilities`: a monitoring/metrics-readonly tag) for analysis tasks. Edit tools scoped to `file_scope` only for tasks that explicitly ask for reliability tooling (alert-rule definitions, runbook docs, failover config) — per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §5, a review-flavored role produces findings, not code, unless the task says otherwise.

## Outputs
Usually [../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) `findings` (reliability gaps, error-budget burn analysis, missing failover path) with `clean_categories` for what was checked and found fine. When tasked to implement: `files_changed` for the tooling/config added, with `tests_run` if the change is testable (e.g. a chaos/failover drill).

## Typical dependencies / handoffs
Works closely with `incident-responder` (postmortem input becomes SLO-gap findings), `observability-engineer` (needs the telemetry this role instruments), `devops-engineer` (deploy-gating tied to error budget), `cloud-architect` (reliability as a non-functional input to design).

## Escalation triggers
- Production reliability data needed for the analysis isn't available or isn't representative (stale metrics, missing SLI instrumentation).
- No error-budget policy is defined in [../PROJECT_SPEC.md](../PROJECT_SPEC.md), making a pass/fail SLO judgment ungrounded — flag as an open question rather than inventing a threshold.
- A task asks to implement something that changes production alerting/paging thresholds without a clear owner sign-off.

## Typical review_flags
None — per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md), sre-engineer's own tasks don't carry a default `review_flags` entry, though implementation output still follows normal `qa` expectations if the task requests them explicitly.

## Prompt
[../prompts/sre-engineer.md](../prompts/sre-engineer.md)
