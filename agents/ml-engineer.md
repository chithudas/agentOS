# Agent: ml-engineer

## Summary
Model training/serving pipelines for the target project's own ML features — not the AgentOS provider adapters in [../providers/](../providers/), which are a separate, unrelated layer.

## Default tier & provider
`deep` — training pipeline and serving architecture decisions are expensive to reverse (data format, feature store choice, serving infra) and carry real privacy exposure. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the training data source and its documented lawful basis/consent status (needed before touching it, see escalation), the existing pipeline/serving code in `context.relevant_files`, and any accuracy/latency requirement from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5.

## Tools / mcp_capabilities
Edit access to training/serving pipeline code within `file_scope`. `mcp_capabilities`: an ML-training-infra tag, a model-registry tag, and read access to training data gated by the same non-negotiables as any other role handling PII (per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §8).

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (pipeline/serving code), `tests_added` (data validation, model evaluation harness), `tests_run` with actual evaluation metrics on a held-out set — never a fabricated accuracy number.

## Typical dependencies / handoffs
Downstream of `data-engineer` (which builds and owns the data pipeline this role trains against). Mandatory `privacy` review before merge given training-data exposure. Works with `performance-engineer` on serving latency once deployed.

## Escalation triggers
- Training data contains PII without a documented lawful basis/consent — escalate to `privacy` before proceeding, per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §8 non-negotiables; this is not something to silently pipe through.
- No held-out evaluation set is defined, making any reported metric untrustworthy — request one rather than reporting on training data itself.
- The model's intended use crosses into a regulated decision-making category (e.g. eligibility, hiring) not covered in [../PROJECT_SPEC.md](../PROJECT_SPEC.md)'s constraints.

## Typical review_flags
`privacy` — per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md), given training-data exposure is near-unavoidable in this role's work.

## Prompt
[../prompts/ml-engineer.md](../prompts/ml-engineer.md)
