# Project Spec — API Service Template

> Copy over `PROJECT_SPEC.md`, then fill in the bracketed specifics. Structure follows [PROJECT_SPEC.md](../PROJECT_SPEC.md); defaults below reflect a headless service/platform API with no first-party UI.

## 1. Summary
[One paragraph: what the API does, who consumes it (internal services, external partners, public developers).]

## 2. Goals / non-goals
- Goals: a stable, versioned API contract satisfying the consumer use cases below, with the reliability/SLA the consumers need.
- Non-goals (default, adjust as needed): any first-party UI — that's a separate `web-saas.md`/`mobile-app.md` instance consuming this API, not part of this spec.

## 3. Users & use cases
[Who calls this API — internal services, external partners, public third-party developers — and their top integration scenarios.]

## 4. Architecture overview
- Stack: [language/framework], [database], [hosting/infra].
- API style: [REST / GraphQL / gRPC] — pulls in `api-designer` or `graphql-architect` accordingly.
- Auth model for consumers: [API keys / OAuth client credentials / mTLS].
- Versioning strategy: [URL-versioned / header-versioned] and deprecation policy.

## 5. Constraints
- SLA/uptime commitments to consumers, if any.
- Rate limiting and quota model.
- Backward compatibility requirements — breaking changes require [deprecation window, migration guide] per consumer contract.
- Data residency/compliance if consumers are in regulated industries or jurisdictions.

## 6. Milestones
1. Core resource model + auth working end to end.
2. First external/partner consumer integrated successfully against a stable contract.
3. Rate limiting, quotas, and monitoring in place.
4. Public API documentation/developer portal live (if externally facing).

## 7. Open questions
[API style finalized? Versioning/deprecation policy agreed? SLA commitments defined before or after first partner signs on?]

## 8. Review requirements
- `security` review flag mandatory on: auth/authz for every endpoint, rate limiting, any endpoint accepting external input.
- `legal` review flag mandatory on: API terms of service, any data-sharing agreement implications for external consumers.
- `docs` review flag mandatory on every task that changes the public contract — an undocumented breaking change is treated as a bug, not a documentation backlog item.

## Suggested default roster involvement
[agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md) roles most active on this archetype: `backend`, `api-designer`, `graphql-architect` (if applicable), `database`, `security`, `legal`, `observability-engineer`, `sre-engineer`, `docs`, `qa`.
