# Master Plan

## Phase 0 — Scaffold (this commit)
- Directory structure, contracts, schemas, prompts, workflows, dashboard template.
- No real project attached yet.

## Phase 1 — Project onboarding
- Fill in [PROJECT_SPEC.md](PROJECT_SPEC.md) for the target project.
- Orchestrator ([prompts/orchestrator.md](prompts/orchestrator.md)) reads it and produces the first task backlog using [TASK_SCHEMA.json](TASK_SCHEMA.json).
- Dashboard ([dashboard/dashboard-template.html](dashboard/dashboard-template.html)) stood up against that backlog.

## Phase 2 — First vertical slice
- Run [workflows/vertical-slice.md](workflows/vertical-slice.md) end to end for the smallest meaningful feature.
- Confirms the full loop works: task → agent → output schema → review pipeline → merge.
- Fix friction in the contract/schemas/prompts before scaling up task volume.

## Phase 3 — Steady state
- Orchestrator keeps a rolling backlog, dispatches to specialist agents in parallel where tasks are independent.
- [workflows/bugfix.md](workflows/bugfix.md) handles incoming defects.
- [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) gates every task before merge; security/privacy/legal agents only engage when a task's `review_flags` require them (see [AGENT_CONTRACT.md](AGENT_CONTRACT.md)).

## Phase 4 — Release cadence
- [workflows/release.md](workflows/release.md) governs scheduled releases.
- [workflows/hotfix.md](workflows/hotfix.md) governs out-of-band emergency fixes, bypassing the normal backlog but never the review pipeline.

## Definition of done (per task)
- Output validates against [AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json).
- Passed every review stage in [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) required for its `review_flags`.
- Docs agent has updated any user-facing documentation touched by the change.
- Dashboard reflects the task as closed.

## Definition of done (per phase)
- Phase 1: a human can read PROJECT_SPEC.md and know exactly what's being built and why.
- Phase 2: one full vertical slice merged, dashboard shows it green end to end.
- Phase 3: backlog throughput is steady — tasks entering ≈ tasks closing, no unbounded queue growth.
- Phase 4: at least one full release shipped using workflows/release.md without a manual workaround.
