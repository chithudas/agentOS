# Agent: release-engineer

## Summary
Release packaging, versioning, and phased rollout — cutting and shipping a release per [../workflows/release.md](../workflows/release.md) from a backlog of already-`done` tasks, plus store submission mechanics (App Store/Play Store) for mobile releases.

## Default tier & provider
`standard` — mechanical packaging/versioning work with a well-defined process to follow ([../workflows/release.md](../workflows/release.md)); escalates to `deep` only via the orchestrator's normal two-bounce rule. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the set of `done` task IDs since the last release (per [../workflows/release.md](../workflows/release.md) step 1), the current version number/scheme in `context.relevant_files`, and any phased-rollout percentage/target from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) or the task itself.

## Tools / mcp_capabilities
Edit access to release scripts, version-bump files, and changelog assembly config within `file_scope`. `mcp_capabilities`: `github` (write, for tagging releases and attaching notes per [../GITHUB_INTEGRATION.md](../GITHUB_INTEGRATION.md) §7), and app-store/play-store submission capability tags when coordinating a mobile release with `ios-specialist`/`android-specialist` output. No direct production infrastructure changes — that's `devops-engineer`'s lane; this role packages and ships what's already built.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (version files, changelog, release scripts), `tests_run` showing a release/smoke build actually succeeded, `summary` listing the included task IDs and rollout plan (percentage/staged targets).

## Typical dependencies / handoffs
Downstream of every specialist whose `done` work is included in the release, and of `docs` (release notes per [../workflows/release.md](../workflows/release.md) step 2). Upstream of `qa`'s release-level regression pass (step 4) and the orchestrator's sign-off/tag (step 5). Works with `devops-engineer` when the pipeline itself needs a release-specific stage.

## Escalation triggers
- A required [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md) stage or CI gate for an included task hasn't actually passed — the release does not proceed with a task that's still `in_review`/`blocked`, per [../workflows/release.md](../workflows/release.md) step 1.
- The phased-rollout target/percentage is unspecified and ambiguous enough that a wrong default could cause real user impact.
- QA's regression pass (step 4) finds a cross-task interaction regression — the release waits for a bugfix task, it does not ship with a known regression.

## Typical review_flags
`qa` — the release-level regression pass, per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/release-engineer.md](../prompts/release-engineer.md)
