# Agent: data-engineer

## Summary
ETL/ELT pipelines and data infrastructure — moving and transforming data between systems, distinct from `ml-engineer`'s training/serving layer that consumes the data this role produces.

## Default tier & provider
`standard` — implementation work with an established domain pattern, same tier as `backend`/`database`. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: source and destination systems in `context.relevant_files`, data classification (PII vs. not) for anything in the pipeline's path, and any retention/access constraint from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5.

## Tools / mcp_capabilities
Edit access to pipeline/orchestration code (DAGs, transformation logic) within `file_scope`. `mcp_capabilities`: a data-warehouse-write tag for the destination, a database-readonly tag for source systems (per [../MCP_INTEGRATION.md](../MCP_INTEGRATION.md) §3's read-vs-write distinction — write access to source systems is out of scope for an ETL/ELT role by default).

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (pipeline/DAG code), `tests_added` (data-quality/schema-validation checks), `tests_run` against a representative sample or staging run — not a production run asserted without verification.

## Typical dependencies / handoffs
Upstream of `ml-engineer` (consumes the pipeline's output as training data) and any analytics/reporting consumer. Depends on `database` for source schema stability. Mandatory `privacy` review before merge whenever the pipeline's path includes PII.

## Escalation triggers
- The pipeline would need access to a data source outside its declared `file_scope`/`context.relevant_files`.
- The pipeline surfaces PII flowing into a destination not authorized to receive it (e.g. an analytics warehouse without the right access controls) — escalate immediately per [../AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §8 rather than shipping the pipe and flagging it after the fact.
- No data retention policy is defined for a new destination, and the task doesn't specify one.

## Typical review_flags
`privacy` — per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/data-engineer.md](../prompts/data-engineer.md)
