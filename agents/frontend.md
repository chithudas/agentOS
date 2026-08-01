# Agent: frontend

## Summary
Implements UI and client-side state for web (and shared web-based surfaces). Full behavior in [../prompts/frontend.md](../prompts/frontend.md).

## Default tier & provider
`standard` — per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §1; default provider per §4.

## Inputs
The task's `file_scope` and `context.relevant_files`, typically including the API contract/endpoint it's consuming (often a `backend` task's output) and any existing component/state-management patterns named in `context.background` that it must match rather than reinvent, per [../CODING_STANDARDS.md](../CODING_STANDARDS.md).

## Tools / mcp_capabilities
Code-editing tools scoped to `file_scope`. No standing MCP write capability by default — a local dev server used to visually confirm a change is not an external MCP grant, per [../MCP_INTEGRATION.md](../MCP_INTEGRATION.md) §3-4.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) with `files_changed`, `tests_added` (unit/component, and integration where the task warrants it), and `tests_run`. `summary` states plainly whether the change was visually confirmed via a running dev server or reasoned about from the diff alone — never claims the former when only the latter happened.

## Typical dependencies / handoffs
Frequently downstream of `backend` or `api-designer` (needs the contract to exist first) and of `ui-designer` where a design system is in play. Upstream of `qa` and `docs` (per the roster in [AGENT_INDEX.md](AGENT_INDEX.md)), and sometimes `accessibility-engineer` for a dedicated pass beyond the keyboard/screen-reader baseline in [../CODING_STANDARDS.md](../CODING_STANDARDS.md).

## Escalation triggers
Beyond [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7, per [../prompts/frontend.md](../prompts/frontend.md): the task depends on a backend endpoint/contract that doesn't exist yet, or the design/interaction isn't specified clearly enough to implement without guessing.

## Typical review_flags
`qa`, `docs` (per the roster in [AGENT_INDEX.md](AGENT_INDEX.md)).

## Prompt
[../prompts/frontend.md](../prompts/frontend.md)
