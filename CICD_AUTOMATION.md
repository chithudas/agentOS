# CI/CD Automation

How AgentOS tasks trigger and gate on continuous integration/deployment pipelines. This wraps around, and reports into, [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) rather than replacing it — CI proves the code works mechanically; the review pipeline additionally proves it satisfies the task's intent, scope, and security/privacy/legal/qa bar.

## 1. Trigger points
- A task entering `in_review` ([STATE_MACHINES.md](STATE_MACHINES.md) §1) triggers a CI run against its branch/PR ([GITHUB_INTEGRATION.md](GITHUB_INTEGRATION.md) §3).
- A release entering `regression_pass` ([STATE_MACHINES.md](STATE_MACHINES.md) §3) triggers a full pipeline run against the release branch, not just the per-task CI that already ran individually.
- A hotfix ([workflows/hotfix.md](workflows/hotfix.md)) triggers an expedited pipeline (a defined subset: build + the specific regression test + security-relevant checks) rather than the full suite, with the full suite still required in the retroactive full pass (hotfix workflow step 6).

## 2. Pipeline stages (maps to REVIEW_PIPELINE.md stage 3, "test verification")
1. Build / typecheck.
2. Unit tests (must include the `tests_added` the agent reported in its output).
3. Integration tests relevant to the task's `file_scope`.
4. Lint/static analysis per [CODING_STANDARDS.md](CODING_STANDARDS.md).
5. Full regression suite — required for release ([workflows/release.md](workflows/release.md)), optional per-task if the project's CI budget requires scoping individual-task runs to affected areas.

A failing pipeline run at any stage bounces the task back to `in_progress` with the failure output attached as context — same bounce mechanics as a failed review stage ([STATE_MACHINES.md](STATE_MACHINES.md) §2).

## 3. Status reporting
Each pipeline stage reports as its own GitHub status check ([GITHUB_INTEGRATION.md](GITHUB_INTEGRATION.md) §4) and is reflected on the dashboard's review-pipeline-status view ([DASHBOARD_SPEC.md](DASHBOARD_SPEC.md) §2 item 4) alongside the non-CI review stages, so a human sees one unified picture of what's blocking merge — not CI status in one tool and AgentOS review status in another.

## 4. Flake handling
Per [CODING_STANDARDS.md](CODING_STANDARDS.md) testing standards: a flaky test is a bug, not noise to retry past. CI automation does not auto-retry a failed test run silently to get to green — a failure triggers the bounce; if the owning agent (or `qa`) determines the failure was a flake, fixing/quarantining that flake is itself a task, not a rerun-until-green loop.

## 5. Deployment
- Deployment execution itself (the actual push to staging/production) is project-specific infrastructure outside AgentOS's own scope to prescribe — this document defines what gates a deployment is allowed to proceed (all required CI stages green + all required review stages passed + orchestrator sign-off), not the deployment mechanics themselves.
- Rollback triggers (automated health-check regression post-deploy) feed back into AgentOS as an incident, routed to [workflows/hotfix.md](workflows/hotfix.md) via the `incident-responder`/`sre-engineer` agents (see [agents/AGENT_INDEX.md](agents/AGENT_INDEX.md)).

## 6. Secrets & environment
CI credentials/secrets are never exposed to an agent's task context or logged in [AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json) output — pipelines run with their own scoped credentials, independent of whatever an agent's own tool access looks like per [MCP_INTEGRATION.md](MCP_INTEGRATION.md) §4.
