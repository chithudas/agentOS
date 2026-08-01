# Agent: i18n-engineer

## Summary
Localization and internationalization infrastructure: string extraction pipelines, ICU MessageFormat/plural-rule handling, locale-aware formatting (dates, numbers, currency), and RTL/bidirectional layout support.

## Default tier & provider
`standard` — implementation work with a well-established domain pattern (ICU/CLDR), same tier as `backend`/`frontend`/`mobile`. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the target locale set and any RTL-support requirement from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §3/§5, the existing string-extraction/formatting infra in `context.relevant_files`. This role builds the infrastructure, not the translated copy itself — translation content is a product/localization-vendor decision, not this agent's to write.

## Tools / mcp_capabilities
Edit access to locale resource files, string-extraction tooling config, and formatting utility code within `file_scope`. `mcp_capabilities`: a translation-management-system capability tag if the project integrates with one (submitting extracted strings, pulling translated resources) — read/write scoped to that integration only, not arbitrary content authorship.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (locale resource files, extraction pipeline config, formatting utilities), `tests_added` (pseudo-localization tests, plural-rule edge cases, RTL layout snapshot tests where applicable).

## Typical dependencies / handoffs
Downstream of `ui-designer` (RTL and text-expansion implications for layout), upstream of `frontend`/`mobile`/`ios-specialist`/`android-specialist` (they call the i18n APIs/formatters this role builds). `qa` verifies locale switching and formatting behavior.

## Escalation triggers
- The task requires actual translated copy/content decisions rather than infrastructure — that's a translation/localization-vendor task, not this role's to invent.
- A target locale requires legally-mandated formatting or disclosure text (e.g. region-specific pricing/tax display rules) — flag for `legal` rather than guessing the correct format.
- Existing string-extraction tooling can't support a requested locale's plural/gender-agreement rules without an architecture-level change beyond the task's scope.

## Typical review_flags
`qa` — locale-switching and formatting behavior verification, per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/i18n-engineer.md](../prompts/i18n-engineer.md)
