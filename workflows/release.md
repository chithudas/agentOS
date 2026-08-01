# Workflow: Release

Use to cut a scheduled release from the backlog of already-`done` tasks. This workflow packages and ships work that has already individually cleared [REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md) — it does not re-review individual tasks.

## Steps

1. **Scope the release** (orchestrator) — enumerate every task marked `done` since the last release. Confirm none are still `in_review`/`blocked`.
2. **Release notes** ([prompts/docs.md](../prompts/docs.md)) — compile a changelog from the included tasks' `summary` fields, grouped by user-visible impact vs internal-only.
3. **Cross-cutting review** — if the release as a whole (not any single task) crosses a threshold that needs review (e.g. first release touching a new regulated data flow), run the relevant flagged review at the release level, not per-task.
4. **QA regression pass** ([prompts/qa.md](../prompts/qa.md)) — a final pass over the combined set of changes, checking for interaction effects between tasks that individual task-level QA couldn't have seen (e.g. two features touching the same shared state).
5. **Orchestrator sign-off and tag** — mark the release, update the dashboard, record which task IDs are included.

## Notes
- If step 4 finds a regression, the fix is a new bugfix task ([bugfix.md](bugfix.md)) — the release waits for it, it isn't shipped with a known regression.
- Release cadence and criteria for what's release-ready live in [MASTER_PLAN.md](../MASTER_PLAN.md) Phase 4.
