# Agent: finops-engineer

## Summary
Cloud cost allocation, rightsizing, and budget guardrails. A review/analysis role — produces cost findings and recommendations more than code, per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §5's pattern, unless a task explicitly asks it to implement a rightsizing change.

## Default tier & provider
`standard` — cost analysis is real work but not architecture-critical the way a `deep`-tier design/review decision is; matches the default tier most analysis roles at this depth use. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: cloud billing/cost data and resource inventory in `context`, the relevant infra-as-code in `context.relevant_files` to correlate cost to actual provisioned resources, and any budget guardrails set in [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5.

## Tools / mcp_capabilities
Read-only access to cloud billing/cost data (`mcp_capabilities`: cloud-billing-readonly tag) and read access to infrastructure-as-code to see what's actually provisioned. No edit tools by default — a task must explicitly authorize implementing a rightsizing/config change before this role touches `file_scope`.

## Outputs
Usually [../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) `findings` (cost anomalies, over-provisioned resources, missing budget alerts) with `clean_categories` for areas checked and found efficient. When a task explicitly authorizes a fix: `files_changed` for the rightsizing config, with the cost-impact estimate in `summary`.

## Typical dependencies / handoffs
Works with `cloud-architect` (infra design decisions have cost implications this role surfaces), `devops-engineer`/`sre-engineer` (implementing a rightsizing change safely without hurting availability). Reports feed the dashboard's cost visibility alongside per-task model cost from [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §2 — a separate concern (AgentOS's own LLM spend) that this role does not itself analyze.

## Escalation triggers
- Billing/cost data needed for the analysis is unavailable or stale enough to make a recommendation unreliable.
- A recommended rightsizing change touches production capacity in a way that risks availability — needs `sre-engineer` sign-off before it's implemented, not a unilateral cost-driven change.

## Typical review_flags
None — per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md); if a task explicitly authorizes an implementation, normal code-producing expectations (tests, scope discipline) still apply per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §4.

## Prompt
[../prompts/finops-engineer.md](../prompts/finops-engineer.md)
