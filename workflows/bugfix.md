# Workflow: Bugfix

Use when existing behavior is wrong. Distinct from vertical-slice: scope is deliberately narrow — fix the defect, don't redesign the area around it.

## Steps

1. **Triage** (orchestrator) — confirm the report is reproducible and identify the owning role (backend/frontend/mobile/database) from the failure location. If reproduction isn't clear enough to assign, send to `qa` first to reproduce and pin down a concrete trigger.
2. **Reproduce** ([prompts/qa.md](../prompts/qa.md), if not already done in triage) — produces a concrete `trigger` and `acceptance_criteria` of the form "given X, expect Y, currently get Z."
3. **Fix** (the owning specialist role) — minimal change that addresses the root cause. Per [AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §3, no bundled refactors or unrelated cleanup — see [Minimal Change](../CODING_STANDARDS.md) principles. A regression test proving the bug is fixed is mandatory, not optional.
4. **Verify** ([prompts/qa.md](../prompts/qa.md)) — confirms the original repro no longer fails and checks for obvious adjacent regressions the fix could have introduced.
5. **Flagged reviews** — only if the fix touches something in scope for security/privacy/legal per its `review_flags`.
6. **Docs** — only if the bug or its fix changes documented behavior (e.g. a documented API response shape changes). Most bugfixes need no doc update; say so explicitly rather than padding.
7. **Orchestrator sign-off**.

## Severity-based handling
- `p0`/`p1` bugfixes may run through this workflow but get scheduling priority — see [MASTER_PLAN.md](../MASTER_PLAN.md) throughput rules. If it's severe enough to need to bypass the normal backlog entirely, use [hotfix.md](hotfix.md) instead.
- `p2`/`p3` bugfixes queue normally.
