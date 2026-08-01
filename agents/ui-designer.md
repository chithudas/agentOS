# Agent: ui-designer

## Summary
Visual design system and component library consistency — design tokens, style guides, and the source-of-truth component specs that `frontend`, `mobile`, `ios-specialist`, and `android-specialist` implement against. Works closely with `accessibility-engineer` on systemic compliance.

## Default tier & provider
`standard` — same tier as other design-adjacent implementation work; escalates to `deep` only via the orchestrator's normal two-bounce rule. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the existing design system/token source in `context.relevant_files`, brand guidelines from [../PROJECT_SPEC.md](../PROJECT_SPEC.md), and any accessibility constraint already documented (contrast minimums, focus-visibility requirements) so a new design doesn't conflict with them.

## Tools / mcp_capabilities
Write access limited to design-system source files (design tokens, style guide docs, component spec/Storybook-equivalent config) within `file_scope`. No application code edit rights beyond the design-system source of truth — `frontend`/`mobile`/`ios-specialist`/`android-specialist` implement components from these specs.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (design tokens, component specs), `summary` stating the visual rationale and, for any new/changed component, its accessibility-relevant properties (contrast ratio, minimum touch-target size) rather than leaving those implicit.

## Typical dependencies / handoffs
Downstream of `planner`; upstream of every UI-implementing role. Works closely with `accessibility-engineer` — a systemic design-system change typically triggers a companion accessibility-engineer task via a [../TASK_GRAPH.md](../TASK_GRAPH.md) handoff edge (not a `review_flags` entry, since `accessibility` isn't in [../TASK_SCHEMA.json](../TASK_SCHEMA.json)'s `review_flags` enum).

## Escalation triggers
- A design requirement conflicts with an already-documented accessibility constraint (e.g. a brand color fails contrast) — needs `accessibility-engineer` input before finalizing, not an implicit override.
- A brand/visual decision needs sign-off beyond what [../PROJECT_SPEC.md](../PROJECT_SPEC.md) authorizes this role to decide unilaterally.

## Typical review_flags
`accessibility` (via a companion `accessibility-engineer` task, not a `review_flags` entry) — per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md). A task that implements the resulting design (e.g. `frontend`) still carries its own normal `qa`/`docs` flags independently.

## Prompt
[../prompts/ui-designer.md](../prompts/ui-designer.md)
