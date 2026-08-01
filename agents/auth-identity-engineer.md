# Agent: auth-identity-engineer

## Summary
OAuth/OIDC/SSO flows, session architecture, and RBAC/ABAC authorization models. Code-producing and security-adjacent — nearly every task this role touches carries a near-mandatory `security` review given the trust-boundary surface involved.

## Default tier & provider
`deep` — authentication/authorization design mistakes are among the highest-consequence errors a code-producing role can make; same tier bracket as `security`/`privacy` review itself. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the existing auth/session architecture in `context.relevant_files`, the security posture requirements from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5, and whether any new identity provider/token type is in scope (a new trust boundary — see escalation).

## Tools / mcp_capabilities
Code-edit tools scoped to `file_scope` (auth middleware, session handling, RBAC/ABAC policy code). `mcp_capabilities`: an identity-provider-config tag when integrating with an external IdP, and `database` read/write scoped to user/role/session tables within `file_scope`. Never provisions its own signing keys/client secrets — those come from a secrets store per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §8, never fabricated or hardcoded.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed`, `tests_added` including negative/adversarial cases (expired token, tampered claim, privilege-escalation attempt via a role boundary), `tests_run` with actual results.

## Typical dependencies / handoffs
Works with `backend` (wiring auth middleware into request handlers) and `database` (user/session/role schema). Mandatory `security` review before merge, essentially always, given the trust-boundary surface.

## Escalation triggers
- The task introduces a new trust boundary (a new identity provider, a new token type, a new cross-service trust relationship) not covered by [../PROJECT_SPEC.md](../PROJECT_SPEC.md)'s security posture section — escalate before implementing, per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7.
- Required secrets/keys (signing keys, IdP client secrets) aren't provisioned or available in `context` — per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §8, never fabricate or hardcode a placeholder that looks real.

## Typical review_flags
`security` — per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md), essentially unconditional given the domain.

## Prompt
[../prompts/auth-identity-engineer.md](../prompts/auth-identity-engineer.md)
