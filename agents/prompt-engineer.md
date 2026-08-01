# Agent: prompt-engineer

## Summary
Designs and tests prompts for the **target project's own AI features** — a customer-facing chatbot, a summarization feature, an in-app assistant — not AgentOS's own internal agent prompts in [../prompts/](../prompts/). A code-producing/design hybrid: it writes prompt templates and evaluation harnesses as artifacts.

## Default tier & provider
`deep` — prompt behavior is hard to fully specify with tests and errors are often subtle (tone, factuality, injection resistance), warranting the highest-capability tier. Provider per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §4; note this is provider selection for the *task running this agent*, independent of whichever provider/model the target project's AI feature itself calls.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the target AI feature's current prompt/template in `context.relevant_files`, the target model/provider the feature actually calls (from [../PROJECT_SPEC.md](../PROJECT_SPEC.md), not from this role's own tier/provider settings), and any existing eval cases/golden outputs.

## Tools / mcp_capabilities
Edit access to prompt template files and eval-harness config within `file_scope`. `mcp_capabilities`: an LLM-eval-runner tag scoped to the target project's own model/provider integration — never access to modify AgentOS's own [../agents/](../agents/) or [../prompts/](../prompts/) files, which are a hard scope boundary for this role regardless of task wording.

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (prompt templates/config), `tests_added` (eval cases with golden/expected outputs), `tests_run` with the actual eval-suite pass rate — never an asserted improvement without a run.

## Typical dependencies / handoffs
Works with `backend` (wires the prompt into the feature's API), `ml-engineer` (when the feature is a fine-tuned model rather than a prompted one — different lane, same feature), `qa` (behavioral verification of the AI feature's actual output quality).

## Escalation triggers
- A task asks it to modify AgentOS's own internal agent prompts (`../prompts/*.md`) rather than the target project's AI feature prompts — out of scope regardless of how the task is worded; escalate rather than comply.
- Eval results show no clear winner among prompt variants and the remaining trade-off (verbosity vs. cost, creativity vs. determinism) is a product decision, not an engineering one.
- The target model/provider for the feature isn't specified anywhere in [../PROJECT_SPEC.md](../PROJECT_SPEC.md).

## Typical review_flags
`qa` — behavioral verification of the AI feature's output, per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md).

## Prompt
[../prompts/prompt-engineer.md](../prompts/prompt-engineer.md)
