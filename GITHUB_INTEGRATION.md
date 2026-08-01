# GitHub Integration

How AgentOS tasks map onto branches, commits, PRs, and issues. Fulfilled either natively or via a GitHub-capability MCP server per [MCP_INTEGRATION.md](MCP_INTEGRATION.md) §6.

## 1. Branch strategy
- One branch per task, named `agentos/<task_id>-<short-slug>`, cut from the target branch at dispatch time.
- Tasks in the same [TASK_GRAPH.md](TASK_GRAPH.md) dependency chain branch from each other in dependency order when they must (e.g. a frontend task depending on an unmerged backend task branches from that backend branch); independent tasks always branch from the shared target branch.
- Branches are cleaned up automatically once their task reaches `done` and merges — no manual housekeeping.

## 2. Commits
- One commit per meaningful unit of the agent's change, following [CODING_STANDARDS.md](CODING_STANDARDS.md) commit-message guidance (why, not a restatement of the diff).
- Commit trailer includes `AgentOS-Task: <task_id>` for traceability from any commit back to its originating task/agent/output.

## 3. Pull requests
- Opened automatically once a task reaches `in_review` (per [STATE_MACHINES.md](STATE_MACHINES.md) §1), targeting the branch it was cut from.
- PR description is generated from the task's `title`, `description`, `acceptance_criteria`, and the agent's `AGENT_OUTPUT_SCHEMA.json` `summary` — not a placeholder, not hand-written after the fact.
- PR stays in draft state until every [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) stage required by the task's `review_flags` has passed; only then is it marked ready for merge.
- Findings from flagged reviews (security/privacy/legal/qa) post as PR review comments at the relevant file/line, mirroring the `location` field in each finding — a human looking at the PR sees the same findings the dashboard shows, in context.

## 4. Status checks
- Each [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) stage maps to a GitHub status check (`agentos/schema-validation`, `agentos/scope-check`, `agentos/tests`, `agentos/security-review`, etc.) so branch protection rules can require them natively.
- [CICD_AUTOMATION.md](CICD_AUTOMATION.md) pipeline runs report as their own status checks, independent of but alongside AgentOS's own review stages.

## 5. Merge
- Merge is triggered by the orchestrator's sign-off ([REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) stage 5), never by an individual agent, and never auto-merges on green CI alone if a required review stage hasn't independently passed.
- Squash-merge by default, commit message drawn from the task title/summary, `AgentOS-Task` trailer preserved.

## 6. Issues
- Bug reports that seed a [workflows/bugfix.md](workflows/bugfix.md) task link back to their originating GitHub issue; the issue closes automatically when the task reaches `done` and its PR merges.
- Hotfix tasks ([workflows/hotfix.md](workflows/hotfix.md)) create the postmortem as a linked follow-up issue, not just a task — so it's visible outside AgentOS's own dashboard too.

## 7. Release integration
[workflows/release.md](workflows/release.md) tags a release commit and attaches the generated changelog (from included tasks' summaries) as the GitHub release notes.
