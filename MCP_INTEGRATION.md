# MCP Integration

How AgentOS agents reach external tools and data sources through the Model Context Protocol, rather than every agent needing a bespoke integration per external system.

## 1. Why MCP here
Agents already declare tool needs in their `agents/<id>.md` capability spec ([agents/AGENT_INDEX.md](agents/AGENT_INDEX.md)). MCP servers are the mechanism for fulfilling those needs against real external systems (issue trackers, databases, cloud consoles, search) without AgentOS core needing a native client for each one. This is the same mechanism [PLUGIN_SDK.md](PLUGIN_SDK.md) §3 tools can be backed by.

## 2. Server registration
- Each MCP server available to a deployment is registered with: server name, transport (stdio/http), and the capability tags it provides (matches AgentOS tool-permission tags, e.g. `github`, `database-readonly`, `cloud-provider-x`).
- Registration is deployment-level (per [PROJECT_SPEC.md](PROJECT_SPEC.md) instance), not per-agent — an agent gets access to a registered server's tools only if its own spec lists that capability tag, same gating as [PLUGIN_SDK.md](PLUGIN_SDK.md) §3.

## 3. Agent access pattern
- An agent's `agents/<id>.md` spec lists `mcp_capabilities: [...]` it needs (e.g. `database.database-readonly` for the database agent doing read-only schema inspection during planning).
- At dispatch, the orchestrator resolves those capability tags to actual registered MCP servers/tools for this deployment and injects only those into the agent's runtime tool list — an agent never gets a raw, unscoped MCP connection.
- Every MCP tool call an agent makes is logged with the same audit trail as any other tool use, so a security review ([prompts/security.md](prompts/security.md)) can inspect exactly what external calls a task's execution made.

## 4. Write access
- MCP tools that can mutate external state (create a GitHub PR, write to a database, trigger a deploy) are treated as elevated — an agent's spec must explicitly request write capability, not just read, and the orchestrator logs write-capable tool grants distinctly on the dashboard.
- Destructive MCP operations follow the same authorization rule as [AGENT_CONTRACT.md](AGENT_CONTRACT.md) §8: never invoked without the task explicitly authorizing that specific class of operation.

## 5. Failure handling
- An MCP server being unreachable/erroring mid-task is not silently retried into a fabricated result — the agent returns `status: blocked` with the specific MCP failure as `blocked_reason`, per [AGENT_CONTRACT.md](AGENT_CONTRACT.md) §1.
- The orchestrator tracks MCP server health and can route around a degraded server if an equivalent-capability alternative is registered, but never substitutes a mocked/fabricated response for a real one.

## 6. Relationship to native integrations
[GITHUB_INTEGRATION.md](GITHUB_INTEGRATION.md) and [CICD_AUTOMATION.md](CICD_AUTOMATION.md) may be fulfilled either via a native AgentOS integration or via a registered MCP server providing equivalent capability tags — this document defines the general mechanism; those documents define the specific capability contracts expected regardless of which transport backs them.
