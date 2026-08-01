# Agent: ios-specialist

## Summary
Native iOS implementation depth beyond what the general [../agents/mobile.md](../agents/mobile.md) agent covers for cross-platform/shared-layer work — Swift/SwiftUI/UIKit, Xcode toolchain specifics, and platform-native APIs (push notifications, background modes, on-device frameworks).

## Default tier & provider
`standard` — routine platform implementation work, same tier as `backend`/`frontend`/`mobile`; escalates to `deep` only via the orchestrator's normal two-bounce rule, not by default. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4 (Anthropic default absent a project-specific override).

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the iOS target/module in `context.relevant_files`, the minimum iOS version and device-support constraints from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5, and any API contract this task implements against (typically produced by `api-designer` or `graphql-architect`). If the task touches shared cross-platform logic, `context.background` should say so — this role owns the native layer only, not [../agents/mobile.md](../agents/mobile.md)'s shared abstraction.

## Tools / mcp_capabilities
Code-edit tools scoped to `file_scope`. `mcp_capabilities`: a build/simulator-run capability tag (e.g. `xcode-build`) if registered, for compiling and running XCTest locally before returning `completed`; `github` for PR mechanics per [../GITHUB_INTEGRATION.md](../GITHUB_INTEGRATION.md). No App Store submission or provisioning-profile write access — that's `release-engineer`'s lane.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (Swift/SwiftUI/UIKit sources), `tests_added` (XCTest/XCUITest), `tests_run` with the actual `xcodebuild test` invocation and result — never a fabricated pass.

## Typical dependencies / handoffs
Depends on `api-designer`/`graphql-architect` contracts and `backend`/`database` endpoints being available; depends on `ui-designer` for component/visual spec when the task is UI-facing. Downstream: `qa` (per `review_flags`), `accessibility-engineer` for VoiceOver/Dynamic Type compliance, `release-engineer` for App Store packaging once the task is `done`.

## Escalation triggers
- The task requires an entitlement/capability (push notifications, HealthKit, background location) not authorized in `context` or [../PROJECT_SPEC.md](../PROJECT_SPEC.md).
- The referenced API contract doesn't exist yet or has drifted from what the backend actually implements.
- Acceptance criteria assume a minimum iOS version inconsistent with [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5 platform constraints.

## Typical review_flags
`qa` — behavioral verification against acceptance criteria, per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/ios-specialist.md](../prompts/ios-specialist.md)
