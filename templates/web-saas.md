# Project Spec — Web SaaS Template

> Copy over `PROJECT_SPEC.md`, then fill in the bracketed specifics. Structure follows [PROJECT_SPEC.md](../PROJECT_SPEC.md); defaults below reflect a typical multi-tenant, subscription-billed web application.

## 1. Summary
[One paragraph: product, target customer, core value proposition.]

## 2. Goals / non-goals
- Goals: ship a usable multi-tenant web product with account/billing/core-feature flows working end to end.
- Non-goals (default, adjust as needed): native mobile app, offline support, on-prem/self-hosted deployment — unless the project actually needs these, in which case move them to goals and pull in `mobile-app.md` sections.

## 3. Users & use cases
[Who signs up, who's the day-to-day user vs. the admin/billing owner, top use cases per role.]

## 4. Architecture overview
- Stack: [framework], server-rendered or SPA, [database], [hosting].
- Multi-tenancy model: [row-level tenant_id / schema-per-tenant / db-per-tenant] — this materially changes `database` and `security` agent scope, decide early.
- Auth: [provider/library] — session vs. token-based, SSO requirements if any.
- Billing: [Stripe/other] — subscription tiers, metered usage if applicable.

## 5. Constraints
- Compliance: [GDPR/CCPA if handling EU/CA user data — triggers `privacy`/`legal` review flags by default on any task touching user data export/deletion].
- Security: session/auth flows require `security` review flag by default; payment flows require both `security` and `legal` (PCI scope).
- Performance: [Core Web Vitals targets if public-facing marketing pages are in scope].
- Browser support: [modern evergreen browsers, unless specified otherwise].

## 6. Milestones
1. Auth + tenant provisioning working end to end.
2. Billing integration (signup → paid plan → cancellation) working end to end.
3. Core feature vertical slice #1 shipped.
4. First real customer onboarded.

## 7. Open questions
[Multi-tenancy model finalized? Billing provider chosen? SSO required for launch or v2?]

## 8. Review requirements
- `security` review flag mandatory on: auth, session handling, billing, any tenant-isolation-relevant code.
- `privacy` review flag mandatory on: user data export/deletion, any new PII field, analytics/tracking additions.
- `legal` review flag mandatory on: billing/ToS-adjacent changes, new third-party data processor integrations.

## Suggested default roster involvement
[agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md) roles most active on this archetype: `backend`, `frontend`, `database`, `security`, `privacy`, `legal`, `api-designer`, `auth-identity-engineer`, `accessibility-engineer`, `performance-engineer`, `ui-designer`, `qa`, `docs`.
