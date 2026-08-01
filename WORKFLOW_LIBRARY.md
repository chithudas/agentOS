# Workflow Library

Index of the workflows agents and the orchestrator can run. Every task carries a `workflow` field ([TASK_SCHEMA.json](TASK_SCHEMA.json)) naming one of these.

| Workflow | File | Use when |
|----------|------|----------|
| Vertical slice | [workflows/vertical-slice.md](workflows/vertical-slice.md) | Building a new feature end-to-end (db → backend → frontend/mobile → qa → docs) |
| Bugfix | [workflows/bugfix.md](workflows/bugfix.md) | A defect is reported against existing behavior |
| Release | [workflows/release.md](workflows/release.md) | Cutting a scheduled release from the current backlog of `done` tasks |
| Hotfix | [workflows/hotfix.md](workflows/hotfix.md) | Production is broken now and needs an out-of-band fix |

## Choosing a workflow
- New user-facing capability, however small → vertical-slice.
- Existing capability behaving incorrectly → bugfix.
- Time-boxed batch of already-merged work going out → release.
- Active incident, customer-impacting, can't wait for the next release → hotfix.

## Shared rules across all workflows
- Every workflow still goes through [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) — hotfix shortens the *scheduling* path, never the *review* path.
- Every workflow's tasks still conform to [TASK_SCHEMA.json](TASK_SCHEMA.json) / [AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json).
- The orchestrator ([prompts/orchestrator.md](prompts/orchestrator.md)) is the only role that assigns a workflow to a task.
