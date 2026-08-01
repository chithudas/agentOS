# Project Templates

Ready-made starting points for [PROJECT_SPEC.md](PROJECT_SPEC.md) so a new AgentOS instance doesn't start from a blank template every time. Copy the relevant file from [templates/](templates/) over a fresh `PROJECT_SPEC.md` and adjust — these are pre-filled drafts, not rigid requirements.

| Template | File | Use when |
|----------|------|----------|
| Web SaaS | [templates/web-saas.md](templates/web-saas.md) | Multi-tenant web application, subscription billing, browser-first |
| Mobile app | [templates/mobile-app.md](templates/mobile-app.md) | iOS/Android app, backed by an API, app-store distribution |
| API service | [templates/api-service.md](templates/api-service.md) | Headless service/platform API, no first-party UI |
| Data pipeline | [templates/data-pipeline.md](templates/data-pipeline.md) | Batch/streaming data processing, not a request-serving app |

## Choosing a template
Pick the one matching the project's primary interface, not its full tech stack — a web SaaS with a companion mobile app still starts from `web-saas.md` and adds mobile-specific sections rather than starting from `mobile-app.md`.

## Extending a template
Every template already sets sensible defaults for the roster subset likely needed ([agents/AGENT_INDEX.md](agents/AGENT_INDEX.md)) and typical `review_flags` requirements ([PROJECT_SPEC.md](PROJECT_SPEC.md) §8). Adjust rather than starting over if the project is a close-but-not-exact fit.
