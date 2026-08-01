# Coding Standards

Applies to backend, frontend, mobile, and database agents. QA and docs agents read this to know what "correct" looks like when writing tests and documentation.

## General
- Match the existing style of the file/module being edited over any external convention. Consistency within a codebase beats a "more correct" pattern applied inconsistently.
- No commented-out code, no dead code paths "in case we need it later."
- No speculative abstraction: three similar concrete implementations beat one premature generic one. Only extract a shared abstraction once a third real use case shows up.
- Comments explain *why*, never *what* — if a comment just restates the code, delete it.
- Error handling only at real boundaries (user input, external APIs, network calls). Don't wrap internal calls that can't actually fail in defensive try/catch.
- No feature flags or backwards-compatibility shims unless the task explicitly requires supporting an old and new path simultaneously.

## Naming
- Descriptive names over abbreviations. A reader shouldn't need the surrounding function to guess what a variable holds.
- Match the casing convention already in use in that file (snake_case/camelCase/PascalCase) — don't introduce a second convention into an existing file.

## Testing
- Every behavior change ships with a test that would fail without the change and pass with it.
- Tests assert behavior, not implementation details — a refactor that preserves behavior shouldn't break the test suite.
- No mocking the thing under test. Mock only true externalities (network, third-party services, clock/time, randomness).
- Flaky tests are bugs. An agent that finds one fixes or reports it — it does not skip/quarantine it silently.

## Security baseline (all code-producing agents check this, not just the security agent)
- Never build SQL/shell/HTML strings by concatenating unsanitized input.
- Never log secrets, tokens, or PII.
- Validate and sanitize all input at system boundaries.
- Use parameterized queries / prepared statements for all database access.

## Commits & diffs
- One task, one logical change. Don't bundle unrelated fixes into the same diff.
- Diffs stay within the task's `file_scope` (see [AGENT_CONTRACT.md](AGENT_CONTRACT.md) §4).
- Commit messages describe *why*, not a restatement of the diff.

## Language-specific notes
Add a subsection per language/framework actually in use in the target project (fill in during [PROJECT_SPEC.md](PROJECT_SPEC.md) onboarding) — e.g. TypeScript strictness settings, Python type-hint requirements, mobile platform conventions. Left empty until a real project is attached.
