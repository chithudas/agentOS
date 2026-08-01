# Project Spec — Mobile App Template

> Copy over `PROJECT_SPEC.md`, then fill in the bracketed specifics. Structure follows [PROJECT_SPEC.md](../PROJECT_SPEC.md); defaults below reflect an iOS/Android app backed by an API, distributed through app stores.

## 1. Summary
[One paragraph: what the app does, target platforms, backing API relationship if any.]

## 2. Goals / non-goals
- Goals: ship an app-store-ready build for [iOS / Android / both] satisfying the core use cases below.
- Non-goals (default, adjust as needed): web client, offline-first sync — unless the project needs these.

## 3. Users & use cases
[Who uses the app, top 3-5 in-app tasks, any platform-specific behavior expected (e.g. push notifications, background sync).]

## 4. Architecture overview
- Platform(s): [iOS native / Android native / cross-platform framework — name it].
- Backing API: [existing service / new — link to its own PROJECT_SPEC.md or `api-service.md` if this app pairs with a new backend build].
- Local storage/offline behavior: [what must work without connectivity, if anything].
- Push notifications: [provider, use cases requiring them].

## 5. Constraints
- App store review guidelines relevant to the app's category (permissions justification, background execution, in-app purchase rules if applicable).
- Device/OS version support floor: [minimum iOS/Android version].
- Accessibility: platform accessibility APIs (VoiceOver/TalkBack) supported for core flows — not optional polish.

## 6. Milestones
1. Core navigation + auth working on both target platforms.
2. Primary feature vertical slice shipped to a test build (TestFlight/internal track).
3. App store submission accepted.
4. First public release live.

## 7. Open questions
[Cross-platform vs. fully native decided? Push notification requirements finalized? Minimum OS version locked?]

## 8. Review requirements
- `security` review flag mandatory on: token storage, any biometric/auth flow, deep-link handling.
- `privacy` review flag mandatory on: any permission requiring user disclosure (location, contacts, camera, etc.), analytics/tracking SDKs.
- `qa` review flag mandatory on every task — mobile regressions are costly to patch post-store-review, verify before merge, not after.

## Suggested default roster involvement
[agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md) roles most active on this archetype: `mobile`, `ios-specialist`, `android-specialist`, `backend` (for the pairing API), `database`, `security`, `privacy`, `accessibility-engineer`, `performance-engineer`, `release-engineer`, `qa`, `docs`.
