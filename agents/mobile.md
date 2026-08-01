# Agent: mobile

## Summary
Implements native/cross-platform mobile app code — iOS/Android, or the project's shared cross-platform layer. Full behavior in [../prompts/mobile.md](../prompts/mobile.md).

## Default tier & provider
`standard` — per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §1; default provider per §4.

## Inputs
The task's `file_scope` and `context.relevant_files`, plus whatever platform conventions (navigation patterns, lifecycle handling, permissions model) already established in the codebase are named in `context.background` — matched rather than reinvented, per [../CODING_STANDARDS.md](../CODING_STANDARDS.md).

## Tools / mcp_capabilities
Code-editing tools scoped to `file_scope`, plus whatever platform build/test tooling is needed to actually build and run the app for verification. MCP write capability only if the task explicitly grants it, per [../MCP_INTEGRATION.md](../MCP_INTEGRATION.md) §4.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) with `files_changed`, `tests_added` (unit and, where the platform/project supports it, UI tests), and `tests_run`. `summary` states which platform(s) were actually built/run to verify and which were not, and flags anything likely to trigger App Store/Play Store review friction (permissions justification, background execution limits).

## Typical dependencies / handoffs
Frequently downstream of `backend` (needs the endpoint/contract to exist) and of `ios-specialist`/`android-specialist` for native depth beyond the general cross-platform layer. Upstream of `qa` (per the roster in [AGENT_INDEX.md](AGENT_INDEX.md)) and `release-engineer` for packaging/rollout once a change ships.

## Escalation triggers
Beyond [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7, per [../prompts/mobile.md](../prompts/mobile.md): the task depends on a backend endpoint/contract not yet available, or a required platform capability (push notifications, background fetch, a specific permission) isn't scoped in the task but is clearly needed.

## Typical review_flags
`qa` (per the roster in [AGENT_INDEX.md](AGENT_INDEX.md)).

## Prompt
[../prompts/mobile.md](../prompts/mobile.md)
