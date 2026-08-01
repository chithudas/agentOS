# Workflow: Vertical Slice

Use for any new user-facing capability, however small. Runs the full stack for one coherent piece of functionality: data → server → client → verification → docs.

## Steps

1. **Plan** ([prompts/planner.md](../prompts/planner.md)) — decompose the feature request into tasks along real seams (schema, API, UI, review). Flag dependencies explicitly.
2. **Database** ([prompts/database.md](../prompts/database.md)) — schema/migration changes the feature needs, if any. Runs first; everything else can depend on it.
3. **Backend** ([prompts/backend.md](../prompts/backend.md)) — API/business logic. Depends on step 2 if schema changed.
4. **Frontend and/or Mobile** ([prompts/frontend.md](../prompts/frontend.md), [prompts/mobile.md](../prompts/mobile.md)) — client integration. Depends on step 3's API contract. Can run in parallel with each other if both are in scope.
5. **QA** ([prompts/qa.md](../prompts/qa.md)) — independently verifies acceptance criteria across the whole slice, not just each piece in isolation. Exercises the actual end-to-end path.
6. **Flagged reviews** — security/privacy/legal run per each task's `review_flags`, per [REVIEW_PIPELINE.md](../REVIEW_PIPELINE.md).
7. **Docs** ([prompts/docs.md](../prompts/docs.md)) — runs last, once the shipped behavior is final, so docs describe what actually exists.
8. **Orchestrator sign-off** — all tasks `done`, dashboard updated.

## Notes
- Steps 2-4 are sequential where a real dependency exists; don't serialize independent work (e.g. mobile and web frontends touching different files can run in parallel).
- If step 5 (QA) finds a defect, the fix goes back to the specific step that owns it (backend/frontend/mobile/database) — QA does not patch code itself.
- A vertical slice is "done" only when every step has returned `completed` and cleared its required review stages — a slice that's functional but undocumented, or functional but untested, is not done.
