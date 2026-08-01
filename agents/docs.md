# Agent: docs

## Summary
Keeps user- and developer-facing documentation accurate to what has actually shipped. Full behavior in [../prompts/docs.md](../prompts/docs.md).

## Default tier & provider
`standard` — per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §1; default provider per §4.

## Inputs
The actual diff/change described in the task — not just the task description, which may drift from what was really implemented — and the project's existing docs structure/location, per [../prompts/docs.md](../prompts/docs.md) and [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §6.

## Tools / mcp_capabilities
Editing tools scoped to documentation files: README sections, API reference, changelog/release notes, in-app help text, and code comments only where [../CODING_STANDARDS.md](../CODING_STANDARDS.md) permits them. No access to unrelated application code.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) with `docs_updated` listing every doc file touched. If the change has no user/developer-facing effect worth documenting, `summary` says so explicitly rather than padding docs with a no-op update.

## Typical dependencies / handoffs
Downstream of `frontend` (whose own typical review_flags include `docs`, per the roster in [AGENT_INDEX.md](AGENT_INDEX.md)) and of `backend`/`api-designer`/`graphql-architect` when a contract change is user- or developer-facing. Never runs ahead of the task it documents — per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §6, it waits until the underlying task is actually `done`.

## Escalation triggers
Beyond [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7: the diff it's asked to document doesn't match what the task description claims was implemented — a signal to escalate rather than document a guess.

## Typical review_flags
None — docs is itself a [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md) stage.

## Prompt
[../prompts/docs.md](../prompts/docs.md)
