# Agent: cloud-architect

## Summary
Multi-service infrastructure design and cloud platform strategy. A design/review role like `planner`'s pattern — produces architecture recommendations and design artifacts, not the infrastructure-as-code implementation itself (that's `devops-engineer`).

## Default tier & provider
`deep` — infra topology decisions are expensive to reverse and cross-cut cost, reliability, and security; same tier bracket as `planner`/security review. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: current architecture from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §4, existing infra-as-code in `context.relevant_files`, and non-functional requirements (cost ceiling, availability target, compliance boundary) from §5.

## Tools / mcp_capabilities
Read-only access to existing infra-as-code and cloud topology (`mcp_capabilities`: a cloud-provider-readonly tag for cost/topology introspection). Write access limited to architecture/design-doc artifacts within `file_scope` — not to production IaC itself, which `devops-engineer` implements from this role's design.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: usually a design/recommendation document (`files_changed` pointing at the architecture doc) with explicit trade-offs stated (cost vs. availability vs. complexity), or `findings` when reviewing an existing design against stated requirements.

## Typical dependencies / handoffs
Upstream of `devops-engineer` (implements the resulting design as IaC). Takes cost input from `finops-engineer` and reliability input from `sre-engineer` as constraints on the design. Mandatory `security` review of any new trust boundary or data flow the design introduces.

## Escalation triggers
- The design requires a new vendor/service not covered by [../PROJECT_SPEC.md](../PROJECT_SPEC.md)'s constraints — a procurement/vendor decision beyond this role's authority.
- Non-functional requirements conflict (e.g. the cost ceiling and the availability target can't both be met) and no priority order is stated — this is a human trade-off call, not an engineering default to pick silently.

## Typical review_flags
`security` — new infra topology is inherently a new set of trust boundaries, per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/cloud-architect.md](../prompts/cloud-architect.md)
