# Project Spec — Data Pipeline Template

> Copy over `PROJECT_SPEC.md`, then fill in the bracketed specifics. Structure follows [PROJECT_SPEC.md](../PROJECT_SPEC.md); defaults below reflect a batch or streaming data-processing system, not a request-serving app.

## 1. Summary
[One paragraph: what data flows through this pipeline, from where, to where, and why.]

## 2. Goals / non-goals
- Goals: reliable, observable data movement/transformation meeting the freshness and correctness bar the consumers below need.
- Non-goals (default, adjust as needed): serving live user-facing queries — that's a downstream API/app's job, not this pipeline's, unless explicitly in scope.

## 3. Users & use cases
[Who/what consumes the pipeline's output — analytics dashboards, ML training, downstream services — and their freshness/correctness requirements.]

## 4. Architecture overview
- Stack: [batch framework / streaming framework], [orchestration tool], [storage layers: raw/staging/curated].
- Source systems: [where data originates, ingestion method].
- Processing model: [batch cadence / streaming latency target].
- Output destinations: [warehouse, downstream API, ML feature store].

## 5. Constraints
- Data freshness/latency SLA.
- Data quality bar: [acceptable error rate, required validation checks].
- Compliance: PII handling in the pipeline (masking, retention limits) if source data contains personal data — triggers `privacy`/`legal` review flags.
- Cost: [budget ceiling for compute/storage] — relevant to `finops-engineer` involvement.

## 6. Milestones
1. Ingestion from primary source(s) working reliably.
2. Core transformation/curation logic validated against real data.
3. Output consumed successfully by at least one downstream system.
4. Monitoring/alerting on pipeline health and data quality in place.

## 7. Open questions
[Batch vs. streaming decided? Data quality thresholds agreed with downstream consumers? Retention policy for raw data defined?]

## 8. Review requirements
- `privacy` review flag mandatory on: any stage handling PII, retention/deletion logic.
- `security` review flag mandatory on: credentials for source/destination systems, any pipeline stage with external network access.
- `qa` review flag mandatory on: data quality validation logic — a silent data-quality regression is worse than a visible pipeline failure.

## Suggested default roster involvement
[agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md) roles most active on this archetype: `data-engineer`, `database`, `ml-engineer` (if feeding ML training), `observability-engineer`, `finops-engineer`, `privacy`, `security`, `qa`, `docs`.
