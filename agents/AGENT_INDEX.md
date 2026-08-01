# Agent Index

The full AgentOS roster: 35 agents. Each has a capability spec in this directory (`agents/<id>.md`) and a runtime system prompt in [../prompts/](../prompts/) (`prompts/<id>.md`). This index is the single source of truth for the roster — [AgentOS_MASTER_BUILD_SPEC.md](../AgentOS_MASTER_BUILD_SPEC.md) §3 summarizes it; this file is authoritative.

## Spec file shape

Every `agents/<id>.md` follows the same structure so the orchestrator ([ORCHESTRATOR_SPEC.md](../ORCHESTRATOR_SPEC.md)) and [PLUGIN_SDK.md](../PLUGIN_SDK.md) §2 can validate any agent, built-in or plugin-provided, the same way:

1. **Summary** — one line.
2. **Default tier & provider** — per [providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §1, plus any provider preference.
3. **Inputs** — what task context this role typically needs beyond the base [TASK_SCHEMA.json](../TASK_SCHEMA.json) fields.
4. **Tools / mcp_capabilities** — what it's authorized to call, per [MCP_INTEGRATION.md](../MCP_INTEGRATION.md) §3.
5. **Outputs** — what it typically produces, in [AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json) terms.
6. **Typical dependencies / handoffs** — which roles usually precede or follow it in a [TASK_GRAPH.md](../TASK_GRAPH.md) chain.
7. **Escalation triggers** — role-specific conditions beyond [AGENT_CONTRACT.md](../AGENT_CONTRACT.md) §7.
8. **Typical review_flags** — which [REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md) stages a task owned by this role usually needs.

## Roster

### Core delivery (11)

| id | summary | default tier | typical review_flags |
|---|---|---|---|
| `orchestrator` | Scheduling, dispatch, escalation, dashboard truth | `deep` | — (never itself gated) |
| `planner` | Decomposes requests into task DAGs | `deep` | — |
| `backend` | Server-side APIs, jobs, business logic | `standard` | qa; security if auth/data |
| `frontend` | Web UI and client state | `standard` | qa, docs |
| `mobile` | iOS/Android app code (cross-platform or shared layer) | `standard` | qa |
| `database` | Schema, migrations, queries | `standard` | security if PII-adjacent |
| `security` | Threat/vulnerability review | `deep` | — (is itself a review stage) |
| `privacy` | Data-handling review | `deep` | — (is itself a review stage) |
| `legal` | Licensing/compliance review | `deep` | — (is itself a review stage) |
| `qa` | Independent verification against acceptance criteria | `standard` | — (is itself a review stage) |
| `docs` | User/developer-facing documentation | `standard` | — (is itself a review stage) |

### Specialists (24)

| id | summary | default tier | typical review_flags |
|---|---|---|---|
| `ios-specialist` | Native iOS implementation depth beyond general `mobile` | `standard` | qa |
| `android-specialist` | Native Android implementation depth beyond general `mobile` | `standard` | qa |
| `api-designer` | REST/contract design, versioning, OpenAPI specs | `deep` | docs |
| `graphql-architect` | GraphQL schema/federation design | `deep` | docs |
| `devops-engineer` | CI/CD pipeline design, deployment automation | `standard` | security |
| `sre-engineer` | SLOs, error budgets, reliability, on-call process | `deep` | — |
| `release-engineer` | Release packaging, versioning, phased rollout | `standard` | qa |
| `incident-responder` | Active incident triage and coordination (hotfix workflow) | `deep` | security |
| `dependency-manager` | Dependency upgrades, vulnerability patching, license checks | `fast` | security, legal |
| `finops-engineer` | Cloud cost allocation, rightsizing, budget guardrails | `standard` | — |
| `i18n-engineer` | Localization/internationalization infrastructure | `standard` | qa |
| `accessibility-engineer` | WCAG compliance, assistive-tech support | `standard` | qa |
| `performance-engineer` | Profiling, load testing, latency/throughput optimization | `deep` | qa |
| `prompt-engineer` | Designs/tests prompts for the project's own AI features (not AgentOS's own prompts) | `deep` | qa |
| `ml-engineer` | Model training/serving pipelines for project ML features | `deep` | privacy |
| `data-engineer` | ETL/ELT pipelines, data infrastructure | `standard` | privacy |
| `cloud-architect` | Multi-service infra design, cloud platform strategy | `deep` | security |
| `observability-engineer` | Logging, metrics, tracing, alerting setup | `standard` | — |
| `code-reviewer` | Static code-quality review independent of QA's behavioral verification | `standard` | — (is itself a review stage) |
| `refactoring-specialist` | Behavior-preserving structural cleanup, only when explicitly tasked | `standard` | qa |
| `test-automation-engineer` | Test framework/infrastructure design (distinct from per-task tests written by implementing agents) | `standard` | — |
| `build-engineer` | Build system performance, compilation/bundling optimization | `standard` | — |
| `ui-designer` | Visual design system, component library consistency | `standard` | accessibility (via `accessibility-engineer` task) |
| `auth-identity-engineer` | OAuth/OIDC/SSO flows, session architecture, RBAC/ABAC | `deep` | security |

## Adding an agent
New built-in agents follow the same process as a plugin agent minus the plugin manifest step — see [PLUGIN_SDK.md](../PLUGIN_SDK.md) §2 for the validation/approval gate. Add the row here, the `agents/<id>.md` spec, and `prompts/<id>.md`, then extend the `role` enum in [TASK_SCHEMA.json](../TASK_SCHEMA.json) and [AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json).
