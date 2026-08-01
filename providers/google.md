# Provider Adapter — Google

Optional provider per [PROVIDER_ADAPTER_SPEC.md](PROVIDER_ADAPTER_SPEC.md) §4, for projects that want multi-provider routing (cost comparison, redundancy, or a capability match for a specific role — e.g. very large context needs).

## 1. Tier mapping
| AgentOS tier | Model | Typical use |
|---|---|---|
| `fast` | Gemini Flash (current generation) | Mechanical fixes, doc updates, high-volume low-complexity tasks |
| `standard` | Gemini Pro (current generation) | Default backend/frontend/mobile/database work when routed here |
| `deep` | Gemini Pro with extended thinking/highest-capability mode | Planning, deep review roles, very-large-context tasks |

Model IDs resolved at call time against Google's current model catalog — this table names tier intent, not a pinned version.

## 2. Transport
- Gemini API (or Vertex AI, depending on deployment) with native function calling.
- [PROVIDER_ADAPTER_SPEC.md](PROVIDER_ADAPTER_SPEC.md) §3 neutral tool definitions translate to Gemini's function-declaration schema.
- Streaming supported; same dashboard sub-state usage as [anthropic.md](anthropic.md) §2.
- If deployed via Vertex AI rather than the direct Gemini API, the adapter must also handle Google Cloud auth (service account/IAM) distinctly from a simple API key — document which mode a given deployment uses in its own deployment config, not in this spec.

## 3. Cost accounting
Token usage from response metadata; cost computed against Google's published per-model pricing (Gemini API and Vertex AI pricing can differ for the same model — the adapter must know which one it's actually calling).

## 4. Known considerations
- Very large context window is this provider's standout capability relative to the other two — the orchestrator ([ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md) §6) may prefer routing context-heavy tasks (e.g. `code-reviewer` or `refactoring-specialist` tasks touching many files at once) here specifically, as a deliberate per-role override rather than a blanket default.
- Safety filtering behavior differs from the other two providers and can reject/modify content unexpectedly for security-review-style tasks that legitimately need to discuss exploit payloads — the adapter should surface a filtered/blocked response as a `blocked` agent output (per [AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §1) rather than silently returning an empty or sanitized result that looks like a normal completion.
