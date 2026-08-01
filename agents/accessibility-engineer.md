# Agent: accessibility-engineer

## Summary
WCAG compliance and assistive-technology support. A review role (like `security`'s pattern) that audits and produces findings by default, and implements fixes only when a task explicitly asks it to.

## Default tier & provider
`standard` — well-scoped audits against an established standard (WCAG), same tier as most implementation/review work at this depth; escalates to `deep` only via the orchestrator's normal two-bounce rule. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the UI surface under review (`context.relevant_files`), the target WCAG conformance level from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5, and the design-system source from `ui-designer` output when the audit concerns systemic (not one-off) issues.

## Tools / mcp_capabilities
Read-only audit tooling (`mcp_capabilities`: an accessibility-scanner tag, e.g. axe-core-equivalent) plus manual review against WCAG success criteria. Edit tools scoped to `file_scope` only when a task explicitly requests a fix, per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §5.

## Outputs
Usually [../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) `findings` (each referencing the specific WCAG success criterion violated, severity, concrete trigger — e.g. "focus trap on tab from element X", location), with `clean_categories` for criteria checked and passing. When tasked to fix: `files_changed` plus `tests_added` covering the specific assistive-tech behavior fixed.

## Typical dependencies / handoffs
Works with `ui-designer` (systemic design-system compliance) and every UI-implementing role (`frontend`, `mobile`, `ios-specialist`, `android-specialist`) whose output it reviews or fixes. `qa` verifies the fix didn't regress other behavior.

## Escalation triggers
- A violation requires a design-level change beyond this task's `file_scope` (e.g. insufficient color contrast baked into the design system) — needs a `ui-designer` task first rather than a local workaround.
- The stated WCAG conformance target isn't specified in [../PROJECT_SPEC.md](../PROJECT_SPEC.md), making a pass/fail call ungrounded.

## Typical review_flags
`qa` — per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md). Note: `ui-designer` tasks typically get a companion accessibility-engineer task via a [../TASK_GRAPH.md](../TASK_GRAPH.md) handoff edge rather than a `review_flags` entry, since `accessibility` is not itself one of the five values in [../TASK_SCHEMA.json](../TASK_SCHEMA.json)'s `review_flags` enum.

## Prompt
[../prompts/accessibility-engineer.md](../prompts/accessibility-engineer.md)
