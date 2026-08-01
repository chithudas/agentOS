# Review Pipeline

Every task's output ([AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json)) passes through this pipeline before merge. Which stages run is determined by the task's `review_flags` plus any blanket requirements set in [PROJECT_SPEC.md](PROJECT_SPEC.md) §8.

## Stages

1. **Schema validation** — output must validate against AGENT_OUTPUT_SCHEMA.json. Fails closed: invalid output is bounced back to the originating agent, not passed forward.
2. **Scope check** — every entry in `files_changed` is either inside the task's `file_scope` or has an `in_scope: false` with a `reason`. Unexplained out-of-scope changes are rejected.
3. **Test verification** — if the task touched code, `tests_added` is non-empty and `tests_run.passed` is `true`. No exceptions for "trivial" changes; if truly no test applies, the agent must say why in `summary`.
4. **Flagged reviews** — run only the roles listed in `review_flags` (plus any blanket PROJECT_SPEC.md requirements):
   - `security` → [prompts/security.md](prompts/security.md)
   - `privacy` → [prompts/privacy.md](prompts/privacy.md)
   - `legal` → [prompts/legal.md](prompts/legal.md)
   - `qa` → [prompts/qa.md](prompts/qa.md)
   - `docs` → [prompts/docs.md](prompts/docs.md)
   Each produces `findings` per the output schema. A `blocker` or `high` finding stops the merge; `medium`/`low`/`info` are recorded but don't block unless PROJECT_SPEC.md says otherwise.
5. **Orchestrator sign-off** — orchestrator confirms all required stages ran, no unresolved blocking findings remain, and the task's `acceptance_criteria` are met. Marks task `done` and updates the dashboard.

## Formal gates vs. advisory reviewers
Only the five stages above (schema, scope, tests, the five `review_flags` roles, orchestrator sign-off) can block a `done` transition. Roles like `code-reviewer`, `accessibility-engineer`, `performance-engineer`, and `finops-engineer` (see [agents/AGENT_INDEX.md](agents/AGENT_INDEX.md)) are real reviewers with real findings, but they operate as their own dispatched tasks against a `depends_on` edge in [TASK_GRAPH.md](TASK_GRAPH.md), not as a sixth `review_flags` value — their findings surface on the dashboard and can still stop a *release* (via [workflows/release.md](workflows/release.md) cross-cutting review) even though they don't gate an individual task's `done` state the way `security`/`privacy`/`legal`/`qa`/`docs` do. If a project needs one of these to be a hard per-task gate, that's a [PROJECT_SPEC.md](PROJECT_SPEC.md) §8 blanket requirement, not a change to the `review_flags` enum.

## Rejection handling
- A rejected/blocked output goes back to the originating agent with the specific findings attached as new task context — not a vague "try again."
- If the same task bounces twice for the same reason, the orchestrator escalates to a human rather than retrying a third time (see [prompts/orchestrator.md](prompts/orchestrator.md)).

## Finding severity guide
| Severity | Meaning | Blocks merge? |
|----------|---------|----------------|
| blocker  | Breaks core functionality, data loss risk, active vulnerability | Yes |
| high     | Significant bug, real security/privacy exposure, legal risk | Yes |
| medium   | Real issue, not urgent, should be fixed soon | No — tracked |
| low      | Minor/cosmetic/style | No — tracked |
| info     | Observation, no action required | No |

## Dashboard reflection
Every stage transition updates the task's `status` field and is visible on [dashboard/dashboard-template.html](dashboard/dashboard-template.html): `queued → in_progress → in_review → done` (or `blocked`/`rejected` at any point).
