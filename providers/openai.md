# Provider Adapter — OpenAI

Optional provider per [PROVIDER_ADAPTER_SPEC.md](PROVIDER_ADAPTER_SPEC.md) §4, for projects that want multi-provider routing (cost comparison, redundancy, or a capability match for a specific role).

## 1. Tier mapping
| AgentOS tier | Model | Typical use |
|---|---|---|
| `fast` | GPT-5 mini (or current small-tier model) | Mechanical fixes, doc updates |
| `standard` | GPT-5 | Default backend/frontend/mobile/database work when routed here |
| `deep` | GPT-5 Pro (or current top-tier reasoning model) | Planning, deep review roles |

Model IDs resolved at call time against OpenAI's current model catalog — this table names tier intent, not a pinned version.

## 2. Transport
- Chat Completions or Responses API (adapter picks the current recommended endpoint) with native function/tool calling.
- [PROVIDER_ADAPTER_SPEC.md](PROVIDER_ADAPTER_SPEC.md) §3 neutral tool definitions translate to OpenAI's function-calling schema — note OpenAI's stricter JSON-schema subset (no `oneOf` at the top level in some tool-schema modes historically); the adapter's `normalize()`/translation layer is responsible for flattening AgentOS's neutral schemas into whatever subset the target OpenAI tool-calling mode requires, not the agent spec author.
- Streaming supported; same dashboard sub-state usage as [anthropic.md](anthropic.md) §2.

## 3. Cost accounting
Token usage from response metadata; cost computed against OpenAI's published per-model pricing at time of call (pricing table refreshed periodically, not hardcoded permanently into the adapter).

## 4. Known considerations
- Tool-call format differs enough from Anthropic's that the adapter's translation layer ([PROVIDER_ADAPTER_SPEC.md](PROVIDER_ADAPTER_SPEC.md) §3) needs its own test coverage independent of the Anthropic adapter's — don't assume shared translation code is bug-for-bug equivalent across providers.
- MCP support: use a bridging MCP client if OpenAI's native tool-calling doesn't yet support the MCP transport directly at the version in use — this is where [MCP_INTEGRATION.md](../MCP_INTEGRATION.md) may need an explicit bridge component for this provider specifically, unlike Anthropic's more direct path.
