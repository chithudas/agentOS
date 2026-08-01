# Workflow: Hotfix

Use only for an active, customer-impacting production incident that cannot wait for the normal [bugfix.md](bugfix.md) queue or the next [release.md](release.md). Shortens *scheduling*, never *review*.

## Steps

1. **Declare** (orchestrator, coordinated through [agents/incident-responder.md](../agents/incident-responder.md)) — confirm the incident meets the hotfix bar: active production impact, not just severity-on-paper. If it can wait for the next normal release cycle, it's a `p1` bugfix, not a hotfix.
2. **Diagnose** (`incident-responder` leads, pulling in [prompts/qa.md](../prompts/qa.md), `sre-engineer`, and/or the likely-owning specialist as the telemetry points to) — fastest path to a concrete root cause and a minimal fix scope, using signal from `observability-engineer`-built instrumentation where available. No speculative fixes shipped "in case this is it."
3. **Fix** (owning specialist role) — the smallest change that resolves the incident. Same [AGENT_CONTRACT.md](../AGENT_CONTRACT.md) and [CODING_STANDARDS.md](../CODING_STANDARDS.md) rules apply — a hotfix under pressure is exactly when scope discipline matters most.
4. **Mandatory fast-path review** — `security` review runs if the incident or fix touches auth/data/access control, no exceptions, even under time pressure. Other flagged reviews run if applicable but can run in parallel with deployment prep rather than strictly gating it, at the orchestrator's judgment — never skipped, only reordered.
5. **Deploy** — outside AgentOS's scope to define here; follows the project's actual deployment process.
6. **Retroactive full pass** — within the same day, run the fix through the normal [REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md) stages that were reordered/deferred in step 4, plus [prompts/qa.md](../prompts/qa.md) regression coverage and [prompts/docs.md](../prompts/docs.md) if documented behavior changed.
7. **Postmortem task** (`incident-responder` drafts, orchestrator files as a follow-up task) — root cause, why it wasn't caught earlier, and any process/test gap to close. This is a required output of every hotfix, not optional.

## Notes
- A hotfix is not an excuse to skip tests — it's the same regression-test-required rule as [bugfix.md](bugfix.md), just compressed in time.
- If a hotfix bounces at step 4 with a blocker-severity finding, it goes back to step 3 immediately — under no circumstance does a known blocker-severity issue ship because of time pressure.
