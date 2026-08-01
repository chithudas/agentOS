# Memory Architecture

AgentOS agents are stateless per invocation ([AGENT_CONTRACT.md](AGENT_CONTRACT.md) §1: an agent sees only its task, not the full backlog or history). Memory is how anything survives past a single task without every agent re-deriving it from scratch — and it is designed first for token economy: nothing here works by replaying history at an agent. It works by compressing what mattered down to a few sentences, storing it locally with an embedding, and retrieving only the handful of entries relevant to the task in front of it.

This is the same shape of idea as [claude-mem](https://github.com/thedotmack/claude-mem): compress at write time, index once, retrieve on demand, never re-inject a full transcript.

## 1. Design goals
1. **Local-first** — a single on-disk store per deployment, no hosted service dependency for read/write.
2. **Compress at write time** — a closed task's durable takeaway is a few sentences, not its full context/output. If it can't be said in a few sentences, it isn't a memory entry, it's a doc ([docs/](prompts/docs.md) territory) or it's not actually durable.
3. **Retrieve, don't replay** — context assembly is a similarity search against the new task, not a dump of everything ever written. An agent that doesn't need a memory entry never sees it and never pays tokens for it.
4. **Hard token budget** — every dispatch has a ceiling on how many memory tokens ride along in `context.background`. Exceeding it means curating harder, never silently ballooning the prompt.
5. **Decay, don't accumulate forever** — old, rarely-retrieved entries get rolled up into coarser summaries rather than piling up untouched, so the store and the retrieval cost stay flat over the life of a project, not linear in tasks-ever-run.

## 2. Storage layer
- A single local file per deployment: `.agentos/memory.db` (SQLite; a vector-capable extension such as `sqlite-vec`, or an adjacent flat embedding index keyed the same way, provides the similarity search in §4). One file, one process owns writes, trivially backed up/inspected/diffed — no separate vector-DB service to run.
- One table per tier from §3, common columns: `id`, `tier`, `project_id`, `role` (nullable — only set for role memory), `text` (the compressed entry, a few sentences), `embedding`, `tags`, `source_task_id`, `created_at`, `superseded_by` (nullable, points to the entry that corrected/replaced this one — see [MEMORY_ARCHITECTURE.md](MEMORY_ARCHITECTURE.md) §6 staleness).
- Per-project isolation by `project_id` — a deployment running multiple [PROJECT_SPEC.md](PROJECT_SPEC.md) instances keeps their memories from bleeding into each other, except the cross-project subset of role memory explicitly promoted per §3.

## 3. Tiers

### Task context (ephemeral, per-invocation — not stored here at all)
Lives entirely in the dispatched [TASK_SCHEMA.json](TASK_SCHEMA.json) `context` field for the duration of that one task. Never written to `.agentos/memory.db`; if it matters afterward, it must be compressed and promoted to a tier below.

### Project memory (durable, per PROJECT_SPEC.md instance)
- Holds: architectural decisions made along the way, constraints discovered that weren't in the original [PROJECT_SPEC.md](PROJECT_SPEC.md), naming/pattern conventions specialists have actually converged on, and known-risky areas of the codebase flagged by prior review findings.
- Written by: the orchestrator's compression step (§4) when closing a task whose output or findings reveal something durable.
- Decay: revisited at each [workflows/release.md](workflows/release.md) cycle per §6.

### Agent-role memory (durable, per role, project-scoped by default)
- Holds: role-specific operating lessons — e.g. `security` learning "this project's auth layer has a known false-positive pattern around X, don't re-flag it every time."
- Cross-project promotion only when a lesson is genuinely provider/framework-level rather than project-specific, and only with explicit orchestrator/human review before promotion — this is a deliberate, logged action, not automatic.

### Human decision log (durable, append-only)
- Every escalation and its resolution ([ORCHESTRATOR_SPEC.md](ORCHESTRATOR_SPEC.md) §3), recorded verbatim, not compressed — decisions are short by nature and precision matters more than brevity here.
- Never edited after the fact; corrections are new entries with `superseded_by` pointing forward.

## 4. Write path: compress, then store
Only the orchestrator writes to `.agentos/memory.db` — no individual agent writes directly, keeping writes single-authored and auditable (same principle as [STATE_MACHINES.md](STATE_MACHINES.md): one actor mutates shared state).

On closing a task:
1. The orchestrator looks at the agent's [AGENT_OUTPUT_SCHEMA.json](AGENT_OUTPUT_SCHEMA.json) `summary`, `findings`, and `follow_up_findings` for anything durable per the promotion criteria in §3.
2. If something qualifies, it runs a **cheap, `fast`-tier** compression pass (per [providers/PROVIDER_ADAPTER_SPEC.md](providers/PROVIDER_ADAPTER_SPEC.md) §1) that reduces it to a 1-3 sentence entry — this is a small, low-cost call, not a re-summarization of the whole task transcript.
3. The compressed entry is embedded once (small/cheap embedding call) and written to the appropriate tier's table alongside its embedding and tags.
4. Nothing is stored raw. If a finding needs full fidelity to be useful later (rare), it stays where it already lives — the PR/commit/task record via [GITHUB_INTEGRATION.md](GITHUB_INTEGRATION.md) — and the memory entry is a pointer-plus-summary, not a duplicate of the original.

## 5. Read path: retrieve, don't replay
Before dispatching a task, the orchestrator assembles `context.background` like this, not by attaching a memory dump:
1. Embed the new task's `title` + `description` + `file_scope` once.
2. Run a similarity search against project memory and (if the assigned role has entries) role memory, plus a recency-boosted check of the human decision log for anything touching the same `file_scope`/subject area.
3. Take the top-K entries per tier (K small — a handful, not dozens) ranked by similarity, and apply the token budget: default **800 tokens total** across all tiers combined per dispatch, configurable per [PROJECT_SPEC.md](PROJECT_SPEC.md). If the top-K entries would exceed the budget, cut by lowest similarity first, never truncate an individual entry mid-sentence.
4. Only this curated, budget-capped set becomes `context.background`. An agent never receives "everything AgentOS has ever known" — if nothing is relevantly similar, `context.background` is empty, and that's correct behavior, not a gap to fill.

## 6. Decay & compaction
- At each [workflows/release.md](workflows/release.md) cycle, the orchestrator runs a compaction pass: entries that were never retrieved since the last compaction and are older than a configurable threshold (default: 3 release cycles) get merged into a single coarser roll-up entry per tier (e.g. ten stale project-memory entries about a now-settled area become one "settled: X works this way" entry), with the originals marked `superseded_by` the roll-up rather than deleted outright (so provenance is traceable if ever needed).
- This keeps the embedding index small and retrieval fast and cheap indefinitely — the store's relevant-working-set size is bounded by "what's been useful lately," not by total tasks ever run.
- A memory entry that a later task's actual findings contradict is corrected at the point of contradiction (new entry, old one `superseded_by`-linked), never left standing — live code/review findings are ground truth over a stored entry, matching [AGENT_CONTRACT.md](AGENT_CONTRACT.md)'s "no fabricated results": memory describes what was true when written and must be checked against current reality before a human acts on it.

## 7. What does NOT belong in memory
- Anything derivable by reading the current codebase — agents read the code; memory doesn't cache a snapshot of it that can go stale.
- Git history/blame — the git log is authoritative and free to query; memory doesn't duplicate it.
- In-progress task state — that's [TASK_SCHEMA.json](TASK_SCHEMA.json)/[STATE_MACHINES.md](STATE_MACHINES.md)'s job.
- Secrets, credentials, or PII, full stop — a compression pass that would embed one is a bug in that pass, not an acceptable memory entry; see [AGENT_CONTRACT.md](AGENT_CONTRACT.md) §8.

## 8. Cost accounting
Both the compression call (§4) and the embedding calls (§4, §5) are logged the same way any provider call is, per [providers/PROVIDER_ADAPTER_SPEC.md](providers/PROVIDER_ADAPTER_SPEC.md) `cost_of()` — memory overhead is visible on the dashboard's cost view, not a hidden tax on every dispatch. Because compression and retrieval both run at the cheapest tier against a few sentences at a time, this overhead stays small relative to the actual task-execution call it's supporting.
