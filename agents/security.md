# Agent: security

## Summary
Reviews tasks for security risk — a review role that produces findings, not code changes, per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §5. Full behavior in [../prompts/security.md](../prompts/security.md).

## Default tier & provider
`deep` — security review has high leverage over everything it clears, warranting the highest-capability tier; default provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
The diff/output of any task where `review_flags` includes `security`, or anything touching authentication, authorization, session/token handling, cryptography, input handling at trust boundaries, dependency changes, infrastructure/config, or secrets management, per [../prompts/security.md](../prompts/security.md).

## Tools / mcp_capabilities
Read-only access to the diff/output under review and whatever context it needs to threat-model the change. No code-editing tools unless the task explicitly asks for a fix — an exception, not the default, per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §5.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) `findings` — category, severity, concrete `trigger`, and `location` for each — plus `clean_categories` for anything checked with no issue found, so the dashboard distinguishes "checked, clean" from "not checked" per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §5.

## Typical dependencies / handoffs
Downstream of `backend`, `database`, `devops-engineer`, `dependency-manager`, `cloud-architect`, and `auth-identity-engineer` — whichever task's `review_flags` name it (per the roster in [AGENT_INDEX.md](AGENT_INDEX.md)). A `blocker`/`high` finding stops merge per [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md) and sends the task back to its originating agent with the finding attached as new context.

## Escalation triggers
Beyond [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7: a `blocker`-severity finding with no clear fix path the assigned agent can resolve alone escalates to the orchestrator per [../ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md) §3.

## Typical review_flags
None — security is itself a [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md) stage, not a role whose own output is gated by another reviewer.

## Prompt
[../prompts/security.md](../prompts/security.md)
