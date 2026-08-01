# Provider Adapter — Anthropic

Default provider for AgentOS (see [PROVIDER_ADAPTER_SPEC.md](PROVIDER_ADAPTER_SPEC.md) §4). Implements the standard adapter interface against the Claude API.

## 1. Tier mapping
| AgentOS tier | Model | Typical use |
|---|---|---|
| `fast` | Claude Haiku 4.5 | Mechanical fixes, doc updates, simple lint-driven tasks |
| `standard` | Claude Sonnet 5 | Default for backend/frontend/mobile/database/most specialist work |
| `deep` | Claude Opus 5 | Planning, architecture-level tasks, security/privacy/legal review, second-bounce escalations |

Model IDs are resolved via the current Claude API model identifiers at call time — this table names the tier intent, not a pinned version string, so an Anthropic model refresh only requires updating the resolved ID, not any agent spec.

## 2. Transport
- Anthropic Messages API. Tool use via native `tools` parameter — [PROVIDER_ADAPTER_SPEC.md](PROVIDER_ADAPTER_SPEC.md) §3 neutral tool definitions translate directly to Anthropic's tool-schema format with minimal transformation (closest of the three providers to AgentOS's neutral shape).
- Streaming supported natively; used for dashboard sub-state visibility per [STATE_MACHINES.md](../STATE_MACHINES.md) §5.
- Prompt caching: system prompts ([prompts/&lt;id&gt;.md](../prompts/)) and static context (e.g. [AGENT_CONTRACT.md](../AGENT_CONTRACT.md), [CODING_STANDARDS.md](../CODING_STANDARDS.md) excerpts included in context) are cached where the API supports it, since these are stable across many task dispatches to the same role.

## 3. Cost accounting
Token counts and cost reported directly from Anthropic's response usage metadata — no estimation needed for this provider, unlike providers without granular usage reporting.

## 4. Known considerations
- Extended/agentic tool-use loops should respect Anthropic's recommended context-window management guidance for long-running tasks (relevant to [MEMORY_ARCHITECTURE.md](../MEMORY_ARCHITECTURE.md) context-assembly sizing).
- MCP: Anthropic's ecosystem has first-party MCP support, making [MCP_INTEGRATION.md](../MCP_INTEGRATION.md) the most direct path for tool access when this adapter is active.
