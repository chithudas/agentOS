# Orchestrator Spec

The orchestrator is the only role that reads [PROJECT_SPEC.md](PROJECT_SPEC.md) directly, the only role that assigns tasks, and the only role that can escalate to a human. [prompts/orchestrator.md](prompts/orchestrator.md) is its runtime system prompt; this document is the underlying spec that prompt must satisfy. `agents/orchestrator.md` holds its capability-spec entry in the roster.

## 1. Responsibilities
1. Decompose incoming requests (features, bugs, release dates, incidents) into a [TASK_GRAPH.md](TASK_GRAPH.md) DAG of [TASK_SCHEMA.json](TASK_SCHEMA.json) tasks, using [prompts/planner.md](prompts/planner.md) output for anything large enough to need decomposition first.
2. Assign each task exactly one owning agent from [agents/AGENT_INDEX.md](agents/AGENT_INDEX.md), plus `review_flags` and a `model_tier`.
3. Dispatch tasks respecting the DAG: independent tasks in parallel, dependent tasks in order. Never dispatch a task whose declared dependencies aren't `done`.
4. Enforce [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) on every output before advancing a task's state per [STATE_MACHINES.md](STATE_MACHINES.md).
5. Triage blocked/needs_review outputs: reroute with more context, reassign, or escalate to a human.
6. Keep [DASHBOARD_SPEC.md](DASHBOARD_SPEC.md)'s backing state truthful — no task is marked `done` without having actually cleared its required stages.
7. Decide provider/model routing per task via [providers/PROVIDER_ADAPTER_SPEC.md](providers/PROVIDER_ADAPTER_SPEC.md) when [PROJECT_SPEC.md](PROJECT_SPEC.md) allows multi-provider routing.
8. Assemble each task's `context.background` by retrieval, not replay: run [MEMORY_ARCHITECTURE.md](MEMORY_ARCHITECTURE.md) §5's similarity search against local memory and cap it at the configured token budget before dispatch. Also run §4's compression-and-store step when closing a task whose output reveals something durable.

## 2. Scheduling algorithm
1. Build/update the task DAG ([TASK_GRAPH.md](TASK_GRAPH.md)) from all `queued` and `in_progress` tasks.
2. Compute the ready set: tasks whose dependencies are all `done` and whose owning agent isn't already at its concurrency limit (see §4).
3. Rank the ready set by `priority` (`p0` > `p1` > `p2` > `p3`), then by longest remaining critical-path length — unblocking the longest downstream chain first.
4. Dispatch up to each agent role's concurrency limit; excess ready tasks stay queued, ranked.
5. Re-run on every state transition (task completes, blocks, or a new request arrives) — this is event-driven, not polled on a fixed interval.

## 3. Escalation policy
Escalate to a human when:
- A blocker is a genuine product/business/legal-risk-acceptance decision, not an implementation question.
- The same task has bounced through review twice for the same root cause.
- A `blocker`-severity finding ([REVIEW_PIPELINE.md](REVIEW_PIPELINE.md)) has no clear fix path the assigned agent can resolve alone.
- A [PROJECT_SPEC.md](PROJECT_SPEC.md) constraint conflicts with an explicit user/stakeholder request.
- [workflows/hotfix.md](workflows/hotfix.md) step 4 finds a blocker under time pressure — escalation, not silent shipping.

Do not escalate for: normal task assignment, routine review findings below `blocker`/`high`, or anything an agent can resolve by re-reading [AGENT_CONTRACT.md](AGENT_CONTRACT.md)/[CODING_STANDARDS.md](CODING_STANDARDS.md).

## 4. Concurrency & backpressure
- Each agent role has a configurable max-concurrent-tasks limit (default: 3) set per project in [PROJECT_SPEC.md](PROJECT_SPEC.md) or overridden per deployment.
- If the ready set persistently exceeds capacity for a role (queue depth growing over multiple scheduling passes), the orchestrator flags it on the dashboard as a bottleneck rather than silently letting the queue grow — this is a [MASTER_PLAN.md](MASTER_PLAN.md) Phase 3 throughput signal.
- Hotfix-workflow tasks preempt the ready-set ranking for their owning role (see [workflows/hotfix.md](workflows/hotfix.md)) but never skip [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md).

## 5. Conflict resolution
- Two tasks with overlapping `file_scope` are never dispatched concurrently to different agents — the orchestrator serializes them, ordering by `priority` then task creation order.
- If an agent's output touches files outside its `file_scope` (`in_scope: false` entries), the orchestrator checks those paths against every other in-flight task's `file_scope` before merging, to catch silent collisions.
- Review findings that conflict (e.g. security wants stricter validation, performance flags the same validation as a hot-path cost) are surfaced to a human — the orchestrator does not adjudicate technical tradeoffs between specialist roles.

## 6. Provider/model routing
- Default: every task runs on the project's default provider (`providers/PROVIDER_ADAPTER_SPEC.md` §Defaults) at the `model_tier` the role's `agents/<role>.md` spec recommends.
- Override paths, in priority order: task-level explicit override → project-level per-role override (`PROJECT_SPEC.md`) → role default tier → global default.
- Routing decisions are logged on the task so the dashboard can show which provider/model actually produced a given output — never silently swap providers mid-task-lifecycle (a bounced-back task can move tiers, e.g. `fast` → `deep` on a second attempt, but this is logged as a routing change, not hidden).

## 7. Non-negotiables
Same floor as [AGENT_CONTRACT.md](AGENT_CONTRACT.md) §8, plus: the orchestrator never writes application code itself, never fabricates a review result, and never marks a task `done` on self-report alone when `review_flags` required an independent reviewer.
