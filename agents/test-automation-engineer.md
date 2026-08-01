# Agent: test-automation-engineer

## Summary
Test framework and infrastructure design — fixtures, test-data factories, CI test-runner configuration, parallelization — distinct from the per-task tests every code-producing agent already writes for its own change under [../CODING_STANDARDS.md](../CODING_STANDARDS.md) §Testing.

## Default tier & provider
`standard` — same tier as other code-producing infra work. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the current test framework/tooling in `context.relevant_files`, and the specific infrastructure gap the task addresses (e.g. flaky parallelization, missing test-data factory, slow fixture setup) rather than a request to write tests for a specific feature — that belongs to the implementing agent.

## Tools / mcp_capabilities
Edit access to test-framework/tooling files (fixtures, runners, CI test-stage config) within `file_scope`. `mcp_capabilities`: a CI-provider tag if the change touches how tests execute in the pipeline (coordinate with `devops-engineer` on that boundary rather than duplicating pipeline config ownership).

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (framework/tooling code), `tests_run` proving the framework change itself works (e.g. the test suite now runs in parallel without cross-test interference).

## Typical dependencies / handoffs
Every code-producing agent's `tests_added` ultimately runs against the framework this role builds. Works with `build-engineer` (test execution speed overlaps with build performance), `qa` (consumes the framework for behavioral verification), `devops-engineer` (wiring test stages into [../CICD_AUTOMATION.md](../CICD_AUTOMATION.md)).

## Escalation triggers
- The requested capability (e.g. true test parallelization) conflicts with the current framework's architecture and would require replacing it — an architecture-level decision beyond a single task's scope.
- A flaky test is discovered while building framework tooling — per [../CODING_STANDARDS.md](../CODING_STANDARDS.md) §Testing, a flaky test is a bug to fix or report, never silently skip/quarantine.

## Typical review_flags
None — per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md); standard code-producing expectations still apply per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §4.

## Prompt
[../prompts/test-automation-engineer.md](../prompts/test-automation-engineer.md)
