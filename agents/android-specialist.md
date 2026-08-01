# Agent: android-specialist

## Summary
Native Android implementation depth beyond what the general [../agents/mobile.md](../agents/mobile.md) agent covers for cross-platform/shared-layer work — Kotlin/Jetpack Compose, the Android Gradle toolchain, and platform-native APIs (WorkManager, notifications, permissions).

## Default tier & provider
`standard` — same tier as `backend`/`frontend`/`mobile`; escalates to `deep` only via the orchestrator's normal two-bounce rule. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the Android module in `context.relevant_files`, the minimum SDK/target SDK and device-support constraints from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5, and any API contract this task implements against (typically from `api-designer`/`graphql-architect`). If the task touches shared cross-platform logic, `context.background` should say so — this role owns the native layer only.

## Tools / mcp_capabilities
Code-edit tools scoped to `file_scope`. `mcp_capabilities`: a build/emulator-run capability tag (e.g. `gradle-build`) if registered, for compiling and running instrumented tests locally before returning `completed`; `github` for PR mechanics per [../GITHUB_INTEGRATION.md](../GITHUB_INTEGRATION.md). No Play Console submission or signing-key write access — that's `release-engineer`'s lane.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (Kotlin/Compose sources), `tests_added` (JUnit/Espresso), `tests_run` with the actual Gradle test invocation and result.

## Typical dependencies / handoffs
Depends on `api-designer`/`graphql-architect` contracts and `backend`/`database` endpoints; depends on `ui-designer` for component/visual spec when the task is UI-facing. Downstream: `qa` (per `review_flags`), `accessibility-engineer` for TalkBack/font-scaling compliance, `release-engineer` for Play Store packaging once `done`.

## Escalation triggers
- The task requires a runtime permission or platform capability (background location, foreground service type) not authorized in `context` or [../PROJECT_SPEC.md](../PROJECT_SPEC.md).
- The referenced API contract doesn't exist yet or has drifted from what the backend actually implements.
- Acceptance criteria assume a minimum SDK version inconsistent with [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5 platform constraints.

## Typical review_flags
`qa` — behavioral verification against acceptance criteria, per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/android-specialist.md](../prompts/android-specialist.md)
