# Plugin SDK

How a third party extends AgentOS without forking it: new agents, new tools an existing agent can call, or new workflow steps. A plugin never bypasses [AGENT_CONTRACT.md](AGENT_CONTRACT.md) or [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) — it adds capability inside those constraints, it doesn't get to opt out of them.

## 1. Plugin manifest

Every plugin ships a manifest describing what it provides:

```json
{
  "plugin_id": "example-plugin",
  "version": "1.0.0",
  "provides": {
    "agents": ["array of agents/<id>.md-shaped specs this plugin adds"],
    "tools": ["array of tool definitions an existing agent can be granted"],
    "workflow_steps": ["array of workflows/*.md-shaped step definitions"]
  },
  "permissions_requested": ["file_scope patterns, network access, etc. — declared up front"],
  "compatible_agentos_version": "semver range"
}
```

## 2. Adding an agent
- A plugin-provided agent must supply both an `agents/<id>.md`-shaped capability spec (inputs, outputs, tools, escalation rules — see [agents/AGENT_INDEX.md](agents/AGENT_INDEX.md) for the required shape) and a `prompts/<id>.md`-shaped system prompt.
- It is registered into the roster only after: schema validation of both files, and a one-time human approval (a new agent is a standing capability, not a one-off task — this is a deliberate gate, not automatic).
- Once registered, it's dispatched exactly like a built-in agent — the orchestrator ([ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md)) doesn't distinguish built-in vs. plugin agents at dispatch time.

## 3. Adding a tool
- A tool grants an existing agent a new capability (e.g. a specialized linter, a proprietary API client). Declared with: name, description, input/output schema, and the `file_scope`/network permissions it needs.
- Tools are opt-in per agent spec — an agent's `agents/<id>.md` lists which tools it's allowed to use; a plugin tool being installed doesn't automatically grant every agent access to it.
- Tool calls are logged the same way any agent action is, for the same audit trail [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) relies on.

## 4. Adding a workflow step
- A new step in an existing workflow (e.g. a compliance-specific gate for a regulated industry) or an entirely new named workflow, shaped like [workflows/vertical-slice.md](workflows/vertical-slice.md) et al.
- Must declare its position relative to [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) stages — before, after, or replacing which existing stage — so the orchestrator can slot it into [STATE_MACHINES.md](STATE_MACHINES.md) sub-state tracking correctly.

## 5. Permission model
- A plugin declares every permission it needs at install time (`permissions_requested`); nothing is granted implicitly.
- `file_scope` requests are checked against [AGENT_CONTRACT.md](AGENT_CONTRACT.md) §4 the same as any built-in agent's task — a plugin agent doesn't get a wider blast radius than a built-in one performing equivalent work.
- Network/external-service access is explicit and auditable per call, not a blanket grant.

## 6. Versioning & compatibility
- Plugins declare a `compatible_agentos_version` range checked against the running AgentOS core version at install and load time. An incompatible plugin fails closed (doesn't load with degraded behavior) rather than running against a schema it wasn't built for.
- Breaking changes to [TASK_SCHEMA.json](TASK_SCHEMA.json)/[AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json) bump AgentOS's own major version; plugins pin to a range, not a floor, to avoid silent breakage on upgrade.

## 7. Distribution
Out of scope for this spec to mandate a specific registry/marketplace — a deployment may use a private plugin directory, a git-based install, or a package registry. The manifest format above is the only hard requirement for interoperability.
