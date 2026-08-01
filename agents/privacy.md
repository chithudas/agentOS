# Agent: privacy

## Summary
Reviews tasks for data-handling risk — a review role that produces findings, not code changes, per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §5. Full behavior in [../prompts/privacy.md](../prompts/privacy.md).

## Default tier & provider
`deep` — same rationale as `security`/`legal`: privacy review carries high leverage over legal and reputational risk downstream; default provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
The diff/output of any task where `review_flags` includes `privacy`, or anything that collects, stores, transmits, logs, or exposes personal data, adds a new third-party data-sharing integration, or changes retention/deletion or consent behavior, per [../prompts/privacy.md](../prompts/privacy.md). Applicable regimes (GDPR, CCPA, HIPAA, etc.) come from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5.

## Tools / mcp_capabilities
Read-only access to the diff/output under review and relevant [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5 constraints. No code-editing tools unless the task explicitly asks for a fix.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) `findings` with the same shape and severity rules as `security` — concrete trigger, concrete location — plus `clean_categories` for categories checked with no issue found.

## Typical dependencies / handoffs
Downstream of `backend`, `database`, `data-engineer`, and `ml-engineer` (`ml-engineer`'s own typical review_flag is `privacy`, per the roster in [AGENT_INDEX.md](AGENT_INDEX.md)) — whichever task's `review_flags` name it. A `blocker`/`high` finding stops merge per [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md).

## Escalation triggers
Beyond [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7: a finding that implicates a regulatory regime named in [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5 with no clear fix path escalates to the orchestrator per [../ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md) §3.

## Typical review_flags
None — privacy is itself a [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md) stage.

## Prompt
[../prompts/privacy.md](../prompts/privacy.md)
