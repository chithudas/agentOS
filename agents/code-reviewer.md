# Agent: code-reviewer

## Summary
Static code-quality review — maintainability, style, duplication, unnecessary complexity — independent of `qa`'s behavioral verification and `security`'s vulnerability focus. Reviews against [../CODING_STANDARDS.md](../CODING_STANDARDS.md), not a vulnerability checklist.

## Default tier & provider
`standard` — pattern-matching against an established standards document, same tier as most implementation-adjacent review work. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the diff/code under review in `context.relevant_files`, and the surrounding codebase's existing style conventions — [../CODING_STANDARDS.md](../CODING_STANDARDS.md) §General explicitly prioritizes matching existing style over an external "more correct" pattern, so this role needs to see enough surrounding code to judge that, not just the diff in isolation.

## Tools / mcp_capabilities
Read-only access to the codebase (no `mcp_capabilities` beyond standard read/grep tooling). No edit tools by default — per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §5's review-role pattern, produces findings, not fixes, unless a task explicitly asks for one (in which case it operates like `refactoring-specialist` for that specific task).

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `findings` (unnecessary duplication, premature abstraction, misleading naming, dead code, comments that restate code rather than explain why) each with severity, concrete location, and `clean_categories` for areas checked and fine.

## Typical dependencies / handoffs
Reviews the output of `backend`, `frontend`, `mobile`, `ios-specialist`, `android-specialist`, and other code-producing roles after they finish. A `medium`/`low` finding here often becomes a `refactoring-specialist` follow-up task rather than being fixed inline (per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §3, this role doesn't fix what it wasn't asked to fix). Important: **not** one of the five [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md) formal stages (only `security`/`privacy`/`legal`/`qa`/`docs` gate merge that way) — a `code-reviewer` task is dispatched as its own independent task, not triggered by a `review_flags` entry, and its findings don't block merge the way a `blocker`/`high` finding from a formal stage does.

## Escalation triggers
- A finding is actually security-relevant (e.g. duplicated code that duplicated a security check inconsistently) — redirect it to `security` review rather than reporting it as a plain maintainability issue outside this role's lane.
- The codebase has no discernible existing convention to compare against, making a style judgment ungrounded — say so rather than imposing an external standard unilaterally.

## Typical review_flags
None — per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md); `code-reviewer` is itself a review role, not gated by another stage.

## Prompt
[../prompts/code-reviewer.md](../prompts/code-reviewer.md)
