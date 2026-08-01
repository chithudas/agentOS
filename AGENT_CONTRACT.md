# Agent Contract

Every agent operating under AgentOS — regardless of role — follows this contract. The orchestrator enforces it; an agent's output is rejected before it reaches [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) if it violates one of these.

## 1. Input
An agent receives exactly one task conforming to [TASK_SCHEMA.json](TASK_SCHEMA.json). It does not receive the full backlog, other agents' in-flight work, or the project history beyond what the task's `context` field supplies. If a task is missing information needed to do the work, the agent returns `status: "blocked"` with a specific question — it does not guess and it does not silently expand scope to compensate.

## 2. Output
An agent returns exactly one object conforming to [AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json). No freeform prose outside that structure. The orchestrator and dashboard both parse this mechanically; unstructured output breaks the pipeline.

## 3. Scope discipline
- Do only what the task asks. A task to fix a bug does not include refactoring adjacent code, renaming variables, or adding speculative abstraction.
- If the agent notices unrelated problems while working, it records them in `output.follow_up_findings` (see schema) rather than fixing them inline.
- No task is "done, plus a few extra improvements." Extra improvements are new tasks for the orchestrator to schedule or discard.

## 4. Code-producing agents (backend, frontend, mobile, database)
- Follow [CODING_STANDARDS.md](CODING_STANDARDS.md) without exception.
- Every code change ships with the tests needed to prove it works — not a separate task, not deferred.
- Never touch files outside the task's declared `file_scope` unless the change is truly inseparable (e.g. a shared type both files import); if so, list every extra file touched in `output.files_changed` with a one-line reason.

## 5. Review agents (security, privacy, legal, qa)
- Produce findings, not code changes, unless the task explicitly asks for a fix.
- Every finding must include: severity, concrete reproduction/trigger condition, and file/line reference. No vague "this could be a problem" findings — see [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) for the finding schema.
- Silence on a category is not an implicit "pass" — the agent must explicitly report "no findings in this category" so the dashboard can distinguish "checked, clean" from "not checked."

## 6. Docs agent
- Updates only documentation affected by the actual diff in the task, matched against the project's existing doc structure — it does not invent a new docs system.
- Never documents planned/future behavior as if already shipped.

## 7. Escalation
An agent escalates to the orchestrator (via `status: "blocked"` or `status: "needs_review"`) when:
- The task conflicts with [PROJECT_SPEC.md](PROJECT_SPEC.md) constraints.
- The task requires a decision only a human should make (see [prompts/orchestrator.md](prompts/orchestrator.md) escalation rules).
- Required review flags in the task (`review_flags`) require an agent role that hasn't run yet.

## 8. Non-negotiables (all roles)
- No secrets, credentials, or PII in output, logs, or committed files.
- No destructive operations (data deletion, force-push, dropping tables) without an explicit task field authorizing it.
- No fabricated results — if something wasn't actually run/tested/verified, the output says so.
