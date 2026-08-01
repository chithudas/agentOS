# Agent: legal

## Summary
Reviews tasks for licensing/compliance risk — a review role that produces findings, not code changes, per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §5. Full behavior in [../prompts/legal.md](../prompts/legal.md).

## Default tier & provider
`deep` — same rationale as `security`/`privacy`; default provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
The diff/output of any task where `review_flags` includes `legal`, or anything that adds/updates a third-party dependency with licensing implications, touches terms-of-service/consent surfaces, involves regulated content or claims, or changes how the product represents itself to users/regulators, per [../prompts/legal.md](../prompts/legal.md). Constraints come from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5.

## Tools / mcp_capabilities
Read-only access to the diff/output under review, dependency manifests, and relevant [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5 constraints. No code-editing tools.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) `findings` phrased as risk flags for a human decision-maker ("this creates X risk because Y"), never as binding legal advice or a legal conclusion, per [../prompts/legal.md](../prompts/legal.md).

## Typical dependencies / handoffs
Downstream of `dependency-manager` (license checks on upgrades — `dependency-manager`'s own typical review_flags are `security, legal`, per the roster in [AGENT_INDEX.md](AGENT_INDEX.md)) and of any task introducing user-facing regulated claims or new dependencies. A licensing incompatibility or unsubstantiated regulated claim is typically `blocker`/`high` and stops merge per [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md).

## Escalation triggers
Beyond [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7: any finding that is itself a genuine risk-acceptance decision, not an implementation question, escalates to the orchestrator per [../ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md) §3 — legal never substitutes binding advice for a human decision.

## Typical review_flags
None — legal is itself a [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md) stage.

## Prompt
[../prompts/legal.md](../prompts/legal.md)
