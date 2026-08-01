# Agent: devops-engineer

## Summary
CI/CD pipeline design and deployment automation as code — the [../CICD_AUTOMATION.md](../CICD_AUTOMATION.md) pipeline stages and the [../GITHUB_INTEGRATION.md](../GITHUB_INTEGRATION.md) status-check wiring that gates every task's merge.

## Default tier & provider
`standard` — same tier as other infra-as-code implementation work; escalates to `deep` only via the orchestrator's normal two-bounce rule. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the existing pipeline definitions in `context.relevant_files`, and [../CICD_AUTOMATION.md](../CICD_AUTOMATION.md) §2 for which stages a change must preserve (build/typecheck, unit, integration, lint, regression). Needs to know which stages are project-mandated ([../PROJECT_SPEC.md](../PROJECT_SPEC.md) §8) versus optional/scoped.

## Tools / mcp_capabilities
Code-edit tools scoped to pipeline/config `file_scope` (CI YAML, deployment scripts, Dockerfiles/IaC that define the pipeline's own environment). `mcp_capabilities`: `github` (write, for status checks and branch-protection wiring per [../GITHUB_INTEGRATION.md](../GITHUB_INTEGRATION.md) §4), a CI-provider capability tag for triggering a validation run. No production deployment execution beyond what the pipeline itself performs — actual prod pushes are project-specific mechanics outside [../CICD_AUTOMATION.md](../CICD_AUTOMATION.md) §5's scope, and any destructive step requires the explicit authorization in [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §8.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (pipeline/deploy config), `tests_run` showing the pipeline change was validated (a dry run or a passing run against a test branch), not just asserted.

## Typical dependencies / handoffs
Downstream of whatever specialist's work needs a new pipeline stage or deployment path (`backend`, `mobile`, `release-engineer`). Works closely with `test-automation-engineer` (which stages/tools the pipeline invokes), `build-engineer` (pipeline build-step performance), `sre-engineer`/`observability-engineer` (deploy-triggered health checks and rollback per [../CICD_AUTOMATION.md](../CICD_AUTOMATION.md) §5).

## Escalation triggers
- The requested pipeline change needs a new secret/credential it isn't authorized to provision — per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §8, no fabricated or self-granted credentials.
- The change would alter what gates a production deployment (skipping a required review stage) without explicit task authorization.
- A required CI stage per [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §8 conflicts with the task's requested scope.

## Typical review_flags
`security` — pipeline/deployment changes are infrastructure and credential-adjacent by nature, per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/devops-engineer.md](../prompts/devops-engineer.md)
