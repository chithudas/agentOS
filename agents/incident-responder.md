# Agent: incident-responder

## Summary
Active incident triage and coordination for the [../workflows/hotfix.md](../workflows/hotfix.md) workflow — confirms an incident actually meets the hotfix bar, drives fast root-cause diagnosis, and coordinates the fix to completion under time pressure without skipping mandatory review.

## Default tier & provider
`deep` — incident triage decisions (declare vs. don't, scope the fix, decide what's fast-path-reviewable) have high leverage and low tolerance for error under pressure; same tier as `security`/`privacy`. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the incident signal itself (alert, user report, monitoring anomaly), current production telemetry/logs in `context`, and the [../workflows/hotfix.md](../workflows/hotfix.md) definition governing this task's lifecycle (`workflow: "hotfix"` per [../TASK_SCHEMA.json](../TASK_SCHEMA.json)).

## Tools / mcp_capabilities
Read-only access to incident telemetry and logs (`mcp_capabilities`: monitoring/logs-readonly tags) for diagnosis. No code-edit tools of its own — per [../workflows/hotfix.md](../workflows/hotfix.md) step 3, the actual fix is written by the owning specialist role; this agent triages, diagnoses, and coordinates. May write the postmortem document within `file_scope` if the task asks for it.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: a triage `summary` (incident bar confirmation, root-cause hypothesis, minimal fix scope recommendation and which role should own it), and `follow_up_findings` for the mandatory postmortem task per [../workflows/hotfix.md](../workflows/hotfix.md) step 7 — the postmortem itself is a follow-up task, not optional.

## Typical dependencies / handoffs
Triggered by an incident, not by a preceding task. Hands the fix to the owning specialist role (step 3), then to the mandatory `security` fast-path review (step 4) if auth/data/access control is touched, then to deployment (step 5, outside AgentOS's scope), then to the retroactive full [../REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md) pass including `qa` and `docs` (step 6). Works with `sre-engineer` on the postmortem's process/test-gap findings.

## Escalation triggers
- The incident's severity is disputed — doesn't clearly meet the hotfix bar (active production impact) versus being a `p1` bugfix that can wait for the normal queue.
- The fix at step 3 exceeds the minimal scope needed to resolve the incident — no speculative fixes "in case this is it," per [../workflows/hotfix.md](../workflows/hotfix.md) step 3.
- Step 4's fast-path security review returns a blocker-severity finding — per [../workflows/hotfix.md](../workflows/hotfix.md) Notes, this goes back to step 3 immediately; it never ships anyway under time pressure.

## Typical review_flags
`security` — mandatory fast-path review whenever the incident or fix touches auth/data/access control, no exceptions, per [../workflows/hotfix.md](../workflows/hotfix.md) step 4 and [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/incident-responder.md](../prompts/incident-responder.md)
