# Project Spec

> Template. Copy this file's contents into the top of a real spec for whatever AgentOS is building, and fill in every section. The orchestrator ([prompts/orchestrator.md](prompts/orchestrator.md)) treats this file as ground truth for scope — if it's not here, it's not in scope.

## 1. Summary
One paragraph: what is this project, who is it for, why does it exist.

## 2. Goals / non-goals
- Goals: the outcomes that define success.
- Non-goals: adjacent things explicitly out of scope, so agents don't scope-creep into them.

## 3. Users & use cases
Who uses this, and the top 3-5 things they need to be able to do.

## 4. Architecture overview
- Stack (languages, frameworks, infra).
- Major components/services and how they talk to each other.
- Data stores and what lives where.
- Link to any existing architecture docs instead of duplicating them.

## 5. Constraints
- Compliance/regulatory (triggers [prompts/legal.md](prompts/legal.md), [prompts/privacy.md](prompts/privacy.md)).
- Security posture requirements (triggers [prompts/security.md](prompts/security.md)).
- Performance/SLA requirements.
- Platform constraints (browsers, OS versions, device support).

## 6. Milestones
Ordered list of milestones with a one-line "done" criterion each. Feeds [MASTER_PLAN.md](MASTER_PLAN.md) phases.

## 7. Open questions
Anything the orchestrator should flag back to a human rather than assume.

## 8. Review requirements
Which [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) stages are mandatory for this project regardless of individual task `review_flags` (e.g. "security review on every task touching auth", "legal review on every task touching user data export").
