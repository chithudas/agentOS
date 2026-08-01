# State Machines

Every valid state and transition in AgentOS. The orchestrator ([ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md)) is the only actor permitted to move a task or release between states; agents report outcomes, they don't set state directly.

## 1. Task lifecycle

States: `queued`, `in_progress`, `blocked`, `in_review`, `done`, `rejected` (matches [TASK_SCHEMA.json](TASK_SCHEMA.json) `status` enum).

```
        ┌──────────────────────────────────────────────┐
        ▼                                                │
 [queued] ──dispatch──▶ [in_progress] ──output:completed──▶ [in_review]
    ▲                        │                                 │
    │                  output:blocked                    pipeline pass
    │                        ▼                                 │
    │                   [blocked] ──unblocked, redispatch──▶ [in_progress]
    │                        │                                 ▼
    │                  needs human,                          [done]
    │                  resolved──────────────────────┘
    │
    │                  output:rejected / pipeline reject
    └──────────────────────── [rejected] ◀──────────────────────┘
```

Transition rules:
- `queued → in_progress`: orchestrator dispatch per [ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md) §2. Only when all DAG dependencies ([TASK_GRAPH.md](TASK_GRAPH.md)) are `done`.
- `in_progress → in_review`: agent returned `status: completed` (per [AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json)).
- `in_progress → blocked`: agent returned `status: blocked`.
- `blocked → queued`: the blocking condition is resolved (dependency completed, human answered an escalation) — task re-enters the ready set rather than resuming mid-flight, since context may have changed.
- `in_review → done`: passed every required [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) stage with no unresolved `blocker`/`high` findings.
- `in_review → in_progress`: a review stage bounced it back with findings (first or second bounce; see [ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md) §3 for the second-bounce escalation rule).
- `* → rejected`: agent returned `status: rejected` (task itself invalid), or a human/orchestrator decision kills the task outright. Terminal — a rejected task is not resumed; a corrected version is filed as a new task.
- `done` and `rejected` are terminal. No transitions out.

## 2. Review stage sub-state (per REVIEW_PIPELINE.md stage, within `in_review`)

Each required stage (schema validation, scope check, test verification, each flagged role review, orchestrator sign-off) is independently `pending → passed | failed`. A task only reaches `done` when every required stage is `passed`. A single `failed` stage moves the whole task back to `in_progress` with that stage's findings attached as new context — other already-`passed` stages are not necessarily re-run unless the fix could plausibly affect them (orchestrator judgment call, logged).

## 3. Release lifecycle

States: `scoping → notes_drafted → cross_review → regression_pass → signed_off → shipped` (per [workflows/release.md](workflows/release.md)).

- `scoping → notes_drafted`: task set finalized (no `in_review`/`blocked` tasks included).
- `notes_drafted → cross_review`: only entered if the release as a whole crosses a review threshold (see release workflow §3); otherwise skips straight to `regression_pass`.
- `regression_pass → signed_off`: QA regression pass clean. A regression found sends the release back to `scoping` once the fix (a new bugfix task) is `done`.
- `signed_off → shipped`: deployment executes per the project's actual pipeline ([CICD_AUTOMATION.md](CICD_AUTOMATION.md)).

## 4. Hotfix lifecycle (compressed variant)

States: `declared → diagnosing → fixing → fast_review → deployed → retro_review → postmortem_filed` (per [workflows/hotfix.md](workflows/hotfix.md)).

- `fast_review` may run in parallel with deploy prep for non-blocking flagged reviews, but a `blocker`-severity finding here forces `fast_review → fixing`, never `fast_review → deployed`.
- `retro_review` and `postmortem_filed` are mandatory downstream states — a hotfix is not considered closed until both complete, even though the code has already shipped.

## 5. Agent-instance sub-state (within `in_progress`)

Tracked for dashboard/observability, not gating: `assigned → context_loaded → executing → self_verifying → reporting`. Exposed via [DASHBOARD_SPEC.md](DASHBOARD_SPEC.md) for long-running tasks so a stalled agent is visible before it times out.
