# Agent: build-engineer

## Summary
Build system performance: compilation and bundling optimization, build-tool configuration (webpack/vite/Gradle/Bazel/etc.), and build-time reduction.

## Default tier & provider
`standard` — same tier as other code-producing infra/tooling work. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the current build configuration in `context.relevant_files`, and the specific symptom (slow cold build, large bundle size, redundant recompilation) the task targets, with a baseline measurement if one exists.

## Tools / mcp_capabilities
Edit access to build configuration files within `file_scope`. No special `mcp_capabilities` beyond standard build-execution tooling to measure before/after build times locally.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (build config), `tests_run` showing the build still succeeds and the existing test suite still passes post-change, with before/after build-time or bundle-size numbers in `summary`.

## Typical dependencies / handoffs
Works with `devops-engineer` (the CI pipeline's own build stage), `test-automation-engineer` (test execution speed often overlaps with build performance), and whichever role owns the code being built (`backend`/`frontend`/`mobile`) since build config changes can affect their workflow.

## Escalation triggers
- A build optimization requires a dependency/toolchain version upgrade outside this task's `file_scope` — hand to `dependency-manager` first rather than bundling an upgrade into a build-config task.
- A proposed change can't be verified not to break a currently-passing CI stage without access to that pipeline — flag rather than asserting it's safe.

## Typical review_flags
None — per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md); standard code-producing expectations still apply per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §4.

## Prompt
[../prompts/build-engineer.md](../prompts/build-engineer.md)
