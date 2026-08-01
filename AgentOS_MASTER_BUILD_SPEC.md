# AgentOS — Master Build Spec

AgentOS is a multi-agent operating system for software delivery: a fleet of ~35 specialized AI agents, coordinated by an orchestrator, working against a shared task graph, gated by a review pipeline, provider-agnostic across model backends, and wired into the tools engineers already use (GitHub, VS Code, CI/CD, MCP).

This file is the map. Everything else in this repo hangs off it.

## 1. Document map

### Orchestration core
- [ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md) — the orchestrator's full decision logic: scheduling, escalation, backpressure, conflict resolution. `prompts/orchestrator.md` is its runtime system prompt; this is the spec behind it.
- [MASTER_PLAN.md](MASTER_PLAN.md) — phased rollout plan for standing AgentOS up against a real project.
- [PROJECT_SPEC.md](PROJECT_SPEC.md) — per-project scope template (fill in per instance).
- [PROJECT_TEMPLATES.md](PROJECT_TEMPLATES.md) + [templates/](templates/) — ready-made PROJECT_SPEC starting points per project archetype.

### Contracts & standards
- [AGENT_CONTRACT.md](AGENT_CONTRACT.md) — the rules every agent obeys regardless of role.
- [CODING_STANDARDS.md](CODING_STANDARDS.md) — conventions for every code-producing agent.
- [REVIEW_PIPELINE.md](REVIEW_PIPELINE.md) — how output gets gated before merge.
- [WORKFLOW_LIBRARY.md](WORKFLOW_LIBRARY.md) + [workflows/](workflows/) — named end-to-end procedures (vertical-slice, bugfix, release, hotfix).

### Data shapes & control flow
- [TASK_SCHEMA.json](TASK_SCHEMA.json) / [AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json) — the wire format between orchestrator and agents.
- [STATE_MACHINES.md](STATE_MACHINES.md) — every valid state transition for a task, a review, and a release.
- [TASK_GRAPH.md](TASK_GRAPH.md) — how tasks link into a dependency DAG, cycle detection, critical-path scheduling.

### Agents
- [agents/AGENT_INDEX.md](agents/AGENT_INDEX.md) — the full roster (~35 agents): id, tier, default provider, dependencies, prompt/spec file refs.
- [agents/](agents/) — one capability spec per agent (inputs, outputs, tools, escalation rules, dependencies).
- [prompts/](prompts/) — one runtime system prompt per agent (the actual text loaded when the agent runs).

### Model providers
- [providers/PROVIDER_ADAPTER_SPEC.md](providers/PROVIDER_ADAPTER_SPEC.md) — the interface every provider adapter implements (model tiers, tool-call translation, streaming, cost accounting).
- [providers/anthropic.md](providers/anthropic.md), [providers/openai.md](providers/openai.md), [providers/google.md](providers/google.md) — per-provider adapter specs.

### Platform services
- [MEMORY_ARCHITECTURE.md](MEMORY_ARCHITECTURE.md) — local, compressed, retrieval-based long-term memory (project/role/decision-log tiers) plus short-term task context; designed around a hard per-dispatch token budget, not history replay.
- [PLUGIN_SDK.md](PLUGIN_SDK.md) — how third parties add agents, tools, or workflow steps.
- [MCP_INTEGRATION.md](MCP_INTEGRATION.md) — how agents reach external tools via the Model Context Protocol.
- [DASHBOARD_SPEC.md](DASHBOARD_SPEC.md) — the architecture behind [dashboard/dashboard-template.html](dashboard/dashboard-template.html).

### Tool integrations
- [GITHUB_INTEGRATION.md](GITHUB_INTEGRATION.md) — branch strategy, PR lifecycle, status checks, issue linking.
- [VSCODE_INTEGRATION.md](VSCODE_INTEGRATION.md) — the AgentOS VS Code extension surface.
- [CICD_AUTOMATION.md](CICD_AUTOMATION.md) — how tasks trigger and gate on CI pipelines.

## 2. Core loop

```
PROJECT_SPEC.md
  → orchestrator (ORCHESTRATOR_SPEC.md) builds a TASK_GRAPH.md DAG
    → tasks (TASK_SCHEMA.json) dispatched to agents/AGENT_INDEX.md roles,
      each running its prompts/<agent>.md system prompt via a
      providers/*.md adapter for its assigned model tier
        → agent output (AGENT_OUTPUT_SCHEMA.json)
          → REVIEW_PIPELINE.md gates it (state transitions per STATE_MACHINES.md)
            → GITHUB_INTEGRATION.md opens/updates the PR;
              CICD_AUTOMATION.md runs the pipeline
                → merged, or bounced back with findings
                  → DASHBOARD_SPEC.md reflects live state
                    → MEMORY_ARCHITECTURE.md persists what should survive past this task
```

## 3. Roster at a glance

35 agents total: 11 core delivery roles plus 24 specialists. Full detail in [agents/AGENT_INDEX.md](agents/AGENT_INDEX.md).

**Core delivery**: orchestrator, planner, backend, frontend, mobile, database, security, privacy, legal, qa, docs

**Specialists**: ios-specialist, android-specialist, api-designer, graphql-architect, devops-engineer, sre-engineer, release-engineer, incident-responder, dependency-manager, finops-engineer, i18n-engineer, accessibility-engineer, performance-engineer, prompt-engineer, ml-engineer, data-engineer, cloud-architect, observability-engineer, code-reviewer, refactoring-specialist, test-automation-engineer, build-engineer, ui-designer, auth-identity-engineer

## 4. Providers

AgentOS is provider-agnostic at the task level: a task specifies a `model_tier` (`fast` / `standard` / `deep`), not a specific model. The orchestrator picks a provider+model per tier per [providers/PROVIDER_ADAPTER_SPEC.md](providers/PROVIDER_ADAPTER_SPEC.md), defaulting to Anthropic unless [PROJECT_SPEC.md](PROJECT_SPEC.md) or a task overrides it. OpenAI and Google adapters exist for teams that need multi-provider routing (cost, redundancy, or capability match for a specific agent).

## 5. Token economy

An agent sees only its one task ([AGENT_CONTRACT.md](AGENT_CONTRACT.md) §1) — no full backlog, no full project history. Anything durable that would otherwise need to be re-explained every dispatch lives in [MEMORY_ARCHITECTURE.md](MEMORY_ARCHITECTURE.md)'s local store, compressed to a few sentences and retrieved only when relevant to the task at hand, under a hard per-dispatch token budget. This keeps per-task cost roughly flat as a project grows, instead of growing with total project history.

## 6. Status

Scaffolded: core contracts, schemas, workflows, and the 11-role prompt set exist. Expanding to the full 35-agent roster, provider adapters, and platform/tool integrations per this map. Fill in [PROJECT_SPEC.md](PROJECT_SPEC.md) (or pick a starting point from [PROJECT_TEMPLATES.md](PROJECT_TEMPLATES.md)) before handing off to the orchestrator.
