# Agent: qa

## Summary
Independently verifies that a task's implementation satisfies its `acceptance_criteria` — a review role, distinct from the implementing agent's own `tests_run` claim. Full behavior in [../prompts/qa.md](../prompts/qa.md).

## Default tier & provider
`standard` — per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §1; default provider per §4.

## Inputs
The task's `acceptance_criteria` and `description` — test cases are re-derived from these, not from the implementer's own tests, which may share the implementer's blind spots — plus whatever build/dev-server access is needed to actually exercise UI-facing changes, per [../prompts/qa.md](../prompts/qa.md).

## Tools / mcp_capabilities
Whatever build/run/test tooling lets it actually exercise the feature rather than reason about it purely from the diff, including a dev server for UI changes per the [../prompts/frontend.md](../prompts/frontend.md)/[../prompts/mobile.md](../prompts/mobile.md) guidance its own prompt references. No code-editing tools unless the task explicitly asks for a fix.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) `findings` for bugs — a failure to meet a stated acceptance criterion is at minimum `high` — and `clean_categories` covering what was actually exercised (golden path, empty input, concurrent writes, etc.). `summary` distinguishes "verified by running it" from "verified by reading the code" explicitly.

## Typical dependencies / handoffs
Downstream of nearly every code-producing role — `backend`, `frontend`, `mobile`, `database`, and most specialists — since `qa` is the near-universal `review_flags` entry across the roster in [AGENT_INDEX.md](AGENT_INDEX.md). A failed acceptance criterion bounces the task back to its originating agent per [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md)'s rejection handling.

## Escalation triggers
Beyond [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7: the same task bouncing through qa twice for the same root cause is an orchestrator escalation trigger, not a third retry, per [../ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md) §3.

## Typical review_flags
None — qa is itself a [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md) stage.

## Prompt
[../prompts/qa.md](../prompts/qa.md)
