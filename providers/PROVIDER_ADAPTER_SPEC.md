# Provider Adapter Spec

The interface every model provider adapter implements, so the orchestrator ([ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md) §6) can dispatch a task to any provider without agent prompts or task/output schemas changing. An agent's [agents/&lt;id&gt;.md](../agents/AGENT_INDEX.md) spec and [prompts/&lt;id&gt;.md](../prompts/) system prompt are provider-agnostic; the adapter is the only layer that knows provider-specific request/response shapes.

## 1. Model tiers (provider-agnostic)
Tasks specify a tier, not a model:
- `fast` — cheap/low-latency, for narrow well-specified tasks (simple bugfixes, doc updates, mechanical refactors).
- `standard` — default tier for most backend/frontend/mobile/database work.
- `deep` — highest-capability tier, for architecture-level planning, security/privacy/legal review, and anything the orchestrator routes back after two bounces (see [ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md) §3).

Each provider adapter maps these three tiers to its own specific model IDs (see per-provider files) and that mapping is the only place a concrete model name lives — nothing else in AgentOS hardcodes a model name.

## 2. Required adapter interface
Every adapter implements:
- `resolve_model(tier) -> model_id` — tier-to-model mapping for this provider, versioned so upgrading a provider's recommended model for a tier doesn't require touching agent specs.
- `invoke(model_id, system_prompt, task_context, tools) -> raw_response` — sends the agent's `prompts/<id>.md` system prompt plus the dispatched [TASK_SCHEMA.json](../TASK_SCHEMA.json) task as context, with the agent's authorized tool set attached.
- `normalize(raw_response) -> AGENT_OUTPUT_SCHEMA.json-shaped object` — translates the provider's native response/tool-call format into the standard output schema. This is where provider-specific quirks are absorbed so nothing downstream ever sees a non-standard shape.
- `stream(...)` — optional; if supported, streams partial output for dashboard "agent-instance sub-state" visibility ([STATE_MACHINES.md](../STATE_MACHINES.md) §5), but the final result is always reconciled against the full `normalize()` output before the task advances state.
- `cost_of(raw_response) -> {tokens_in, tokens_out, estimated_cost}` — for [FinOps](../agents/AGENT_INDEX.md) tracking and dashboard cost visibility.

## 3. Tool-call translation
Agents declare tools in provider-neutral form (name, description, JSON-schema input/output). Each adapter translates that neutral form into its provider's native tool/function-calling format at `invoke()` time, and translates tool-call results back at `normalize()` time. An agent spec is never written against a specific provider's tool-call syntax.

## 4. Defaults
- Deployment-wide default provider is set once (see [AgentOS_MASTER_BUILD_SPEC.md](../AgentOS_MASTER_BUILD_SPEC.md) §4); [PROJECT_SPEC.md](../PROJECT_SPEC.md) or a specific task may override it.
- Override priority order (highest first): task-level explicit `provider` field → project-level per-role override → global default.
- Anthropic is the recommended default (see [anthropic.md](anthropic.md)) unless a project has a specific reason (cost, redundancy, a capability only another provider offers for a given specialist role) to route elsewhere.

## 5. Failure & fallback
- An adapter that fails to reach its provider (timeout, outage, rate limit) reports the failure up as a `blocked` agent output, per [AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §1 — it does not silently fall back to a different provider on a task already in flight.
- The orchestrator may reroute a *newly dispatched* task to a fallback provider if the primary is degraded, logged as an explicit routing decision (see [ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md) §6) — never a silent, unlogged substitution.

## 6. Per-provider specs
- [anthropic.md](anthropic.md)
- [openai.md](openai.md)
- [google.md](google.md)
