# Agent: refactoring-specialist

## Summary
Behavior-preserving structural cleanup — deduplication, extraction, simplification — performed only when a task explicitly requests it, per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §3's scope-discipline rule. Never a side effect of another task.

## Default tier & provider
`standard` — same tier as other code-producing implementation work; escalates to `deep` only via the orchestrator's normal two-bounce rule. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the specific refactor requested (often sourced from a `code-reviewer` finding turned into a task) and the existing test coverage for the code being touched, in `context.relevant_files`.

## Tools / mcp_capabilities
Code-edit tools scoped strictly to `file_scope`. No `mcp_capabilities` beyond standard test-execution tooling — this role's entire job is provable behavior preservation via the existing test suite, not new external integrations.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (the restructured code), `tests_run` showing the *existing* test suite still passes unchanged — per [../CODING_STANDARDS.md](../CODING_STANDARDS.md) §Testing, "a refactor that preserves behavior shouldn't break the test suite." If coverage was too thin to actually confirm preservation, that gap is reported via `follow_up_findings`, not silently accepted.

## Typical dependencies / handoffs
Usually dispatched from a `code-reviewer` finding or an explicit human/`planner` request — never self-initiated by noticing messy code while doing something else. Downstream: `qa` regression pass to confirm no behavior actually changed.

## Escalation triggers
- Completing the requested refactor turns out to require an accompanying behavior change (e.g. removing dead code reveals a latent bug depended on elsewhere) — escalate rather than silently expanding scope to "fix" it too, per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §3.
- Existing test coverage for the code being refactored is too thin to actually confirm behavior preservation — flag before proceeding rather than refactoring on faith.

## Typical review_flags
`qa` — regression verification that behavior truly didn't change, per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/refactoring-specialist.md](../prompts/refactoring-specialist.md)
