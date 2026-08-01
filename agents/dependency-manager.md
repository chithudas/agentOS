# Agent: dependency-manager

## Summary
Dependency upgrades, vulnerability patching, and license checks — small, mechanical version-bump changes to manifests/lockfiles, paired with security and licensing awareness since almost every change it makes is inherently review-relevant on both fronts.

## Default tier & provider
`fast` — narrow, well-specified mechanical changes (bump a version, regenerate a lockfile), per [../providers/PROVIDER_ADAPTER_SPEC.md](../providers/PROVIDER_ADAPTER_SPEC.md) §1's "fast" bracket. Provider per §4.

## Inputs
Beyond base [../TASK_SCHEMA.json](../TASK_SCHEMA.json) fields: the specific vulnerability/advisory or upgrade target (`context.background`, often sourced from a `security` finding or an automated feed), the current manifest/lockfile in `file_scope`, and the project's license-compatibility constraints from [../PROJECT_SPEC.md](../PROJECT_SPEC.md) §5.

## Tools / mcp_capabilities
Edit access to dependency manifests and lockfiles within `file_scope`. `mcp_capabilities`: a vulnerability-database-readonly tag (CVE/advisory lookup), a license-scanner tag, and `github` for PR mechanics. No write access to application code beyond what a mechanical bump requires (import path/API surface changes from a major bump are out of scope — see escalation).

## Outputs
[../AGENT_OUTPUT_SCHEMA.json](../AGENT_OUTPUT_SCHEMA.json)-shaped output: `files_changed` (manifest/lockfile), `tests_run` showing the existing test suite still passes after the bump, `follow_up_findings` for anything the bump surfaces that's beyond a mechanical change (e.g. a major-version bump needing call-site updates).

## Typical dependencies / handoffs
Often triggered by a `security` finding (vulnerable dependency) or a scheduled vulnerability feed, rather than by another role's output. Downstream: mandatory `security` and `legal` review before merge; `qa` for regression if the project requires it beyond the standard test run.

## Escalation triggers
- The upgrade is not a mechanical bump — it requires code changes at call sites beyond the manifest/lockfile (breaking API change in a major version) — this exceeds the "small mechanical change" scope and should return as `follow_up_findings` for a proper `backend`/`frontend` task, not be forced through here.
- The new version's license is incompatible with the project's declared license posture and no established policy resolves it.
- A patch is available for the vulnerable dependency but pinning to it would violate another declared constraint (e.g. a compatibility floor) — flag the conflict rather than silently choosing one.

## Typical review_flags
`security`, `legal` — per [../agents/AGENT_INDEX.md](../agents/AGENT_INDEX.md), every dependency change carries both by default given the vulnerability and licensing surface it touches.

## Prompt
[../prompts/dependency-manager.md](../prompts/dependency-manager.md)
