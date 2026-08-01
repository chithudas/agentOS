# Building NexusChat with AgentOS: a real run-through

This is not a hypothetical walkthrough. It's what actually happened installing `agentos-kit` into an empty repo and building a real app with it — including the mistakes, the false starts, and the bugs a review pass actually caught. Every claim below is traceable to a real command, a real curl request, or a real subagent report.

## The setup

An empty repo (`chatoNex`) had one thing in it: a `doc/` folder — about 120 markdown files that looked like a complete product spec for **NexusChat**, a WhatsApp-style messaging app. First surprise: most of it wasn't real. `03_Functional_Requirements.md` was 200 lines of `FR-042: Functional requirement placeholder.` The Prisma schema file was a single line: `// TODO: Full Prisma schema with 40-60 models`. Only four files had actual content — the README, the product vision, the feature list, and the architecture stack list.

**Lesson 1: read before you trust a doc folder.** A large `doc/` tree is not evidence of a real spec. Before filling in `PROJECT_SPEC.md`, we opened a dozen of the "real-looking" files and found most were scaffolding. AgentOS's `PROJECT_SPEC.md` template exists specifically so you write down what's *actually* true, not what a folder structure implies.

## Step 1 — install

```bash
npx agentos-kit
```

Dropped `agentos/` (the framework) plus `agentos-status.html` at the project root — automatic, no flags needed.

## Step 2 — ground `PROJECT_SPEC.md` in what's real

Instead of trying to build the full WhatsApp-clone feature list (auth, groups, calls, E2EE, media, offline queue — a multi-month build), `PROJECT_SPEC.md` was filled in with:
- What was actually real in the source docs (vision, feature list, stack: Next.js, NestJS, Prisma/Postgres, Redis, WebSocket/WebRTC)
- An explicit, small first milestone: phone-OTP auth + realtime 1:1 messaging
- Explicit non-goals: groups, calls, E2EE, media — named as deferred, not silently dropped

This is the single highest-leverage step. A vague spec produces vague, sprawling task decomposition. A spec that says "here's the real signal, here's exactly what we're building first, here's what we're deliberately not doing yet" gives every downstream agent a scope boundary to hold to.

## Step 3 — act as orchestrator, dispatch the first slice

Per `AGENT_CONTRACT.md` §3, an agent does only what its task asks — no scope creep. The first slice (database schema → backend API → frontend UI) was dispatched as **three sequential subagent tasks**, each one reading its own role's prompt (`prompts/database.md`, `prompts/backend.md`, `prompts/frontend.md`) plus `AGENT_CONTRACT.md` and `CODING_STANDARDS.md` before doing anything.

Sequential, not parallel — deliberately. The backend agent needed the Prisma model the database agent hadn't created yet; the frontend agent needed the API contract the backend agent hadn't built yet. This is exactly the dependency-respecting scheduling `ORCHESTRATOR_SPEC.md` §2 describes: **independent tasks in parallel, dependent tasks in order.**

Each subagent's report included real verification — curl output, a real Prisma migration applied against a real dockerized Postgres, a `tsc --noEmit` pass — not "I think this works."

## Step 4 — the parallelism mistake, and the correction

Once auth + messaging was running, a "message reactions" vertical slice was added the same way: database → backend → frontend → qa, sequential, for the same dependency reason.

Then came direct feedback: *"there are not parallel run for sub agents, at least 20 agents should run parallel."*

The instinct to push back was right in one sense and wrong in another. The 4 reaction-slice tasks genuinely couldn't be parallelized — they had real dependencies. But the broader point was correct: nothing had demonstrated real parallel dispatch, and blindly running 20 agents in parallel on this small monorepo would have had them all editing `chat.service.ts` at the same time and clobbering each other's work. `ORCHESTRATOR_SPEC.md` §5 exists precisely to prevent this: **tasks with overlapping file_scope are never dispatched concurrently.**

**The fix:** find work that's *actually* safe to parallelize. Read-only review is safe — 20 reviewers reading 20 different files can't collide, because none of them write anything. So 20 tasks were dispatched in one batch — one per file or tightly-scoped area, each running a real AgentOS role (`security`, `qa`, `code-reviewer`, `privacy`, `performance-engineer`, `accessibility-engineer`, `dependency-manager`, `database`) — genuinely in parallel, for real.

**Lesson 2: "run more agents in parallel" is a question about file_scope, not agent count.** The number of agents you can safely run at once is bounded by how many of them can touch disjoint files. Read-only review work parallelizes almost unboundedly. Write work parallelizes only along real seams in the codebase.

## Step 5 — what the review pass actually found

This wasn't theater. The 20-agent review pass surfaced real, exploitable bugs in code that earlier smoke tests had called "verified working":

| Severity | Bug |
|---|---|
| **Blocker** | OTP verification had no rate limiting — a 6-digit code is brute-forceable well within its 5-minute expiry window |
| **High** | `/auth/otp/request` had no throttling at all — anyone could spam OTP requests against any phone number |
| **High** | One method (`getMessageConversationId`) skipped the participant check every sibling method in the same file had |
| **High** | Switching conversations in the UI without a page reload leaked messages from the previous conversation into the new one — the client never told the server to leave the old room |
| **High** | Logging out and back in as a different user, without a full reload, kept the *old* user's auth token cached on the WebSocket connection |

Every one of these passed the earlier "smoke test" — auth worked, messages sent and arrived in real time, reactions worked. None of the earlier tests happened to try the specific sequence that broke things. This is exactly why AgentOS's review pipeline is a separate, mandatory stage (`REVIEW_PIPELINE.md`) rather than something folded into "did the feature work when I tried it once."

The review pass also found something about itself: `status-server.js` — the live dashboard's own server — was listening on all network interfaces with no authentication, exposing the review findings above to anyone on the same network. Fixed immediately, verified, and the corrected binding (`127.0.0.1`-only) is what ships in `agentos-kit` today.

## Step 6 — fixing findings without repeating the parallelism mistake

Four fixes were needed for the blocker/high findings. Before dispatching them, the file overlaps were mapped again:
- Rate limiting touches `auth.controller.ts` + `auth.service.ts`
- The authz fixes touch `chat.service.ts` + `chat.gateway.ts`
- The stale-socket-auth fix touches `lib/socket.ts` + `chats/page.tsx`

Three independent file groups → three tasks dispatched in parallel. A fourth fix (wiring the frontend to actually call the new `leave` event) depended on the gateway change existing first, so it waited and ran after — one real dependency, correctly sequenced.

Each fix was verified the same way the original build was: real curl requests, a real multi-socket test proving a user who leaves a room stops receiving its messages, a real brute-force simulation proving the lockout actually triggers. One subagent, asked to fix a suspected `message:send` authorization gap, discovered on inspection that the underlying service method already guarded it — and reported that instead of adding a redundant, pointless check. That's the behavior `AGENT_CONTRACT.md` asks for: report what's actually true, not what was assumed.

## Step 7 — the live status board

Every task above updated `agentos-tasks.json` — a flat array shaped like `TASK_SCHEMA.json` + `AGENT_OUTPUT_SCHEMA.json` — as it moved through `queued → in_progress → done`. `status-server.js` (a zero-dependency Node server, now shipped in every `agentos-kit` install) polls that file and serves it to `agentos-status.html`, which re-renders every few seconds. Watching the board during the 20-agent review pass meant watching real findings populate in near real time as each reviewer finished — not a demo, the actual mechanism.

## What to take from this if you're starting your own project

1. **Read your own docs before you trust them.** A polished-looking spec folder can be mostly scaffolding. Verify before you plan around it.
2. **Write `PROJECT_SPEC.md` as a scope boundary, not a wish list.** Name the first slice explicitly. Name what you're deliberately not building yet.
3. **Sequence by real dependency, not by habit.** Database → backend → frontend is sequential because each needs the last one's output — not because "that's the order you do things in."
4. **Parallelize along file_scope, not vibes.** If you want more agents running at once, find work that touches disjoint files. Read-only review is the easiest source of real parallelism.
5. **Never skip the review pass.** Smoke tests prove the happy path works. A dedicated, adversarial review pass is what finds the bugs that only show up when someone tries the sequence you didn't think to try.
6. **Trust subagent reports that say "this wasn't actually broken."** An agent that investigates a suspected bug and reports back "the existing code already handles this, here's the proof" is doing its job correctly — that's not a weaker result than a fix.
7. **Watch the dashboard.** A live status board that reflects real task state is the difference between "I think the agents are working" and knowing exactly what's queued, what's running, and what just broke.

## Try it

```bash
npx agentos-kit
node status-server.js
# open http://localhost:4500
```

Everything referenced above — `PROJECT_SPEC.md`, `AGENT_CONTRACT.md`, `ORCHESTRATOR_SPEC.md`, `REVIEW_PIPELINE.md`, the full 35-agent roster in `agents/AGENT_INDEX.md` — is in the repo you just installed.
