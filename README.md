# AgentOS

A multi-agent operating system for software delivery: ~35 specialized AI agents coordinated by an orchestrator, working against a shared task graph, gated by a review pipeline, provider-agnostic across model backends (Anthropic / OpenAI / Google), and wired into the tools you already use (GitHub, VS Code, CI/CD, MCP).

This repo is the spec: a complete set of markdown/JSON documents defining how such a system operates — contracts, schemas, state machines, the full agent roster, and integration points. There's no bundled runtime here; it's the blueprint you point an orchestrator (a Claude Code session, a custom agent runner, whatever you're using) at.

## Quickstart

**Option A — npm (recommended):**

```bash
npx agentos-kit
```

**Option B — curl into an existing project:**

```bash
curl -fsSL https://raw.githubusercontent.com/chithudas/agentos-kit/main/install.sh | bash -s -- agentos
```

**Option C — clone directly:**

```bash
git clone https://github.com/chithudas/agentos-kit.git
```

All three do the same thing: drop the full framework into `./agentos` (or a target directory you name), with no runtime dependencies pulled in — it's markdown and JSON, not code.

Then:

1. Pick the closest starting point from [`templates/`](templates/) (`web-saas.md`, `mobile-app.md`, `api-service.md`, `data-pipeline.md`) and copy it over [`PROJECT_SPEC.md`](PROJECT_SPEC.md).
2. Fill in the bracketed specifics — summary, architecture, constraints, milestones.
3. Hand [`AgentOS_MASTER_BUILD_SPEC.md`](AgentOS_MASTER_BUILD_SPEC.md) and your filled-in `PROJECT_SPEC.md` to whatever you're using as the orchestrator ([`prompts/orchestrator.md`](prompts/orchestrator.md) is its system prompt) and let it start decomposing work.

## What's in here

| Path | What it is |
|---|---|
| [`AgentOS_MASTER_BUILD_SPEC.md`](AgentOS_MASTER_BUILD_SPEC.md) | Entry point — the map of every other document |
| [`ORCHESTRATOR_SPEC.md`](ORCHESTRATOR_SPEC.md) | Scheduling, escalation, backpressure, conflict resolution |
| [`AGENT_CONTRACT.md`](AGENT_CONTRACT.md) | Rules every agent follows, regardless of role |
| [`CODING_STANDARDS.md`](CODING_STANDARDS.md) | Conventions for every code-producing agent |
| [`REVIEW_PIPELINE.md`](REVIEW_PIPELINE.md) | How output is gated before merge |
| [`STATE_MACHINES.md`](STATE_MACHINES.md) | Every valid task/release/review state transition |
| [`TASK_GRAPH.md`](TASK_GRAPH.md) | How tasks form a dependency DAG and get scheduled |
| [`TASK_SCHEMA.json`](TASK_SCHEMA.json) / [`AGENT_OUTPUT_SCHEMA.json`](AGENT_OUTPUT_SCHEMA.json) | The wire format between orchestrator and agents |
| [`MEMORY_ARCHITECTURE.md`](MEMORY_ARCHITECTURE.md) | Local, compressed, retrieval-based memory (not history replay) |
| [`PLUGIN_SDK.md`](PLUGIN_SDK.md) | How to add third-party agents, tools, or workflow steps |
| [`MCP_INTEGRATION.md`](MCP_INTEGRATION.md) | Reaching external tools via the Model Context Protocol |
| [`DASHBOARD_SPEC.md`](DASHBOARD_SPEC.md) + [`dashboard/dashboard-template.html`](dashboard/dashboard-template.html) | Live task/review status view |
| [`GITHUB_INTEGRATION.md`](GITHUB_INTEGRATION.md), [`VSCODE_INTEGRATION.md`](VSCODE_INTEGRATION.md), [`CICD_AUTOMATION.md`](CICD_AUTOMATION.md) | Tool integrations |
| [`providers/`](providers/) | Model provider adapters (Anthropic, OpenAI, Google) and the interface they implement |
| [`agents/`](agents/) + [`prompts/`](prompts/) | The full 35-agent roster: capability specs + runtime system prompts |
| [`workflows/`](workflows/) | Named end-to-end procedures: vertical-slice, bugfix, release, hotfix |
| [`templates/`](templates/) | Starting-point `PROJECT_SPEC.md` drafts per project archetype |

## The roster

**Core delivery (11):** orchestrator, planner, backend, frontend, mobile, database, security, privacy, legal, qa, docs

**Specialists (24):** ios-specialist, android-specialist, api-designer, graphql-architect, devops-engineer, sre-engineer, release-engineer, incident-responder, dependency-manager, finops-engineer, i18n-engineer, accessibility-engineer, performance-engineer, prompt-engineer, ml-engineer, data-engineer, cloud-architect, observability-engineer, code-reviewer, refactoring-specialist, test-automation-engineer, build-engineer, ui-designer, auth-identity-engineer

Full detail, tiers, and default review requirements: [`agents/AGENT_INDEX.md`](agents/AGENT_INDEX.md).

## Core loop

```
PROJECT_SPEC.md
  → orchestrator builds a task graph (TASK_GRAPH.md)
    → tasks dispatched to agents, each running its own system prompt
      → agent output validated against AGENT_OUTPUT_SCHEMA.json
        → REVIEW_PIPELINE.md gates it
          → GitHub PR opened/updated, CI runs
            → merged, or bounced back with findings
              → dashboard reflects live state
                → durable takeaways compressed into local memory
```

## Extending AgentOS

- **New agent or tool:** see [`PLUGIN_SDK.md`](PLUGIN_SDK.md).
- **New project type:** add a file to [`templates/`](templates/) following the existing ones' structure.
- **New provider:** implement the interface in [`providers/PROVIDER_ADAPTER_SPEC.md`](providers/PROVIDER_ADAPTER_SPEC.md).

## License

[MIT](LICENSE)
