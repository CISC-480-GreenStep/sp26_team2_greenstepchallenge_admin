# Q&A Prep — Anticipated Questions

> ## ⚠️ DRAFT — Work In Progress
>
> **Status:** baseline answers for the team to refine. Adjust the voice,
> add questions you expect, remove ones you don't. Each answer is a
> *draft* — the team should know the substance well enough to answer in
> their own words rather than reading verbatim.
>
> **Convention:** each entry has the question, a 2-3 sentence draft
> answer, and a "see also" pointer to the file with the long version.

---

## 🛠️ Technical questions (from faculty)

### Q: Why Supabase instead of building a real backend?
A short managed BaaS gave us Postgres, Auth, REST, and Row-Level
Security in one piece. Building a separate FastAPI service (the original
plan) would have given us the same capabilities at the cost of weeks of
boilerplate and a second deployment to maintain. We deleted the FastAPI
work in v0.6.x and never regretted it.
**See also:** `lessons-learned.md` §1, `README.md` "Tech Stack" note.

### Q: How does Row-Level Security actually work?
Supabase signs every authenticated user a JWT that includes their app
role. We declared Postgres policies on each table that read
`auth.jwt()->>'role'` and decide whether the row is visible/writable.
The check happens **inside the database** on every query, so even if a
React component forgets to gate a button, the database refuses the
request.
**See also:** `supabase/migrations/006`, `011`, `012`, `013`,
`docs/diagrams.md` §L2 callout.

### Q: What happens when more than ~50 admins use this at once?
Supabase free tier supports 50,000 monthly active users. The bottleneck
in our setup is the front-end bundle size, not the database. We've
profiled the heavy queries (challenge participation aggregation, leader-
board) and added indexes (PR #56) on `activity_logs` and
`participation`. If load grows, the next step is paginating the
dashboard tables and code-splitting the React bundle (issue tracked).
**See also:** `README.md` "Future Goals" §7.

### Q: How do you test this?
Headless Puppeteer smoke tests run against the dev server before each
PR merge. The most recent run is captured in
`testing/2026-05-04-pr-68/RESULTS.md` — 18 steps, all assertions
matched. We don't have unit tests yet; that's tracked as future work.
**See also:** `testing/2026-05-04-pr-68/RESULTS.md`,
`lessons-learned.md` "what's next" §8.

### Q: What if Supabase goes down or changes pricing?
The data model is plain Postgres + REST. The only Supabase-specific
piece in the React app is `data/supabase.js`. Migration to a
self-hosted Postgres + a thin custom API would touch one file in the
front end and the schema migrations are already CLI-managed. We'd lose
RLS-as-a-service but the SQL policies are portable.
**See also:** `docs/ARCHITECTURE.md` §6 invariants.

### Q: Why React 19 + MUI v7 instead of [other framework]?
React was specified in the project proposal. MUI v7 came with the
component breadth we needed (data grid, charts, dialogs, theming) on a
free license. We use Recharts on top for chart variety MUI doesn't
ship.
**See also:** `README.md` "Tech Stack" table.

---

## 👥 Product questions (from Kristin)

### Q: Can I add a new challenge category myself, without calling you?
Yes — that just shipped in PR #66. From the Challenge or Template form
there's a "+ Create New Category" button. The new category persists to
the database and shows up everywhere immediately.
**See also:** demo-script.md beat 3.

### Q: What if I deactivate the wrong user?
Re-activating restores them in one click — same screen, opposite
button. Their participation history and points are not deleted; they're
just blocked from signing in until you reactivate. Only **permanent**
delete is destructive, and that's SuperAdmin-only and tracked as a
follow-up (issue #67) — not in v0.10.0.
**See also:** `README.md` "Role Permissions" matrix.

### Q: How do I get the data into a format I can email to my board?
Every list page and the Reports widget have a **CSV Export** button.
Headers match the format your existing 2019/2020/2022/2024 trackers
use, since we extracted the format from those files when we built the
data model.
**See also:** demo-script.md beat 5.

### Q: Will my staff need training?
The role-based access keeps a GeneralUser from accidentally breaking
anything — they can only view. The Admin role has obvious "Edit",
"Archive", "Delete" buttons with confirmation dialogs. We can put
together a 1-page quick-start once the team rolls this out to your
office; that's a small follow-up.

### Q: Can this work on my phone?
Yes — the sidebar collapses on phones, tables become horizontally
scrollable, and the forms re-flow. We tested at 9 viewport sizes from
360px to 1920px (PR #43, v0.6.1). Heavier admin work (managing
hundreds of users) is still nicer on desktop, but day-to-day is fine
on phone.
**See also:** `README.md` v0.6.1 entry.

### Q: How does this connect to the participant mobile app Team 1 is
building?
We share the Supabase database. Team 1's app reads challenges and
templates from the same tables we write to, and writes participation
records to the same `participation` table our reports query. Schema
coordination is ongoing — that's flagged as the #1 follow-up.
**See also:** `lessons-learned.md` "what's next" §7.

---

## 📋 Process / teamwork questions (from faculty)

### Q: How did you split the work?
Roughly by interest + lane: Josh on database/auth/RLS, Khue on UI/UX
and design system, Eli on tooling/refactoring/architecture, Rudy on
feature implementation across challenges/templates. Lanes were soft —
people stepped across to unblock each other.
**See also:** `lessons-learned.md` "what worked".

### Q: What was your biggest disagreement and how did you resolve it?
The FastAPI → Supabase pivot in v0.6.x. Half the team had already
started the API layer; the other half wanted to drop it. We agreed to
spike Supabase for one sprint and revisit. By the end of the spike the
decision was obvious.
**See also:** `lessons-learned.md` §1.

### Q: What would you do differently?
Top three: (1) test auth on a real phone in sprint 1, (2) stand up a
staging Supabase before any schema migration, (3) invest in shared
CRUD scaffolding (hooks, page templates) the *first* time you write a
second instance — not the third.
**See also:** `lessons-learned.md` "what we'd do differently"
sections.

### Q: How did you handle merge conflicts and async work?
Started without a PR workflow; main got messy. Mid-March we adopted
branch-per-issue + mandatory PR review and the conflict rate dropped
sharply. The v0.7.x sprint was 10 stacked PRs intentionally to
demonstrate the workflow and clean up.
**See also:** `meetings/2026-03-12-meeting-notes.md` "Lacked",
`lessons-learned.md` process section.

### Q: What did you learn that you'll use after graduation?
Each member has their own answer — let everyone speak briefly here.
Common threads: code review practice, Postgres/RLS thinking,
information-architecture and design-system maturity, and the discipline
of small, reviewable commits.

---

## 💸 Business / adoption questions

### Q: How much does this cost MPCA to run?
Supabase free tier covers up to 50,000 monthly active users. Vercel
hobby tier covers our hosting. Total runtime cost: $0/month at MPCA's
expected scale. If usage grows past free-tier limits, Supabase Pro is
$25/month and Vercel Pro $20/month.
**See also:** `meetings/2026-03-12-meeting-notes.md` Technical
Decisions.

### Q: Who maintains this after the semester ends?
That's a question for Kristin + MPCA + the next capstone team. The
codebase is documented (README, ARCHITECTURE, CODING_GUIDELINES,
diagrams) so a new team can onboard. The repo will stay on the
CISC-480-GreenStep GitHub org.

### Q: Can other Minnesota cities use this?
Yes — that's why MPCA wanted "challenges" as flexible reusable
templates instead of one Earth-Month-only app. A new city joins by
becoming a Group, and any GreenStep challenge can be scoped to one or
more groups.
**See also:** `README.md` Group Management feature.

---

## 🚨 "Uncomfortable" questions to be ready for

### Q: Why is the README's previous version "v0.9.0" if you just bumped to v0.10.0?
v0.9.0 (Apr 28) was a consolidation/cleanup release. v0.10.0 (this
PR) packages the eight feature/fix PRs that landed in early May plus
internal cleanup. We don't bump on every PR; we bump when the surface
area changes meaningfully.

### Q: Issue #4 has the C4 diagrams already — why did you redo them?
The Issue #4 diagrams were drawn before we replaced the planned
FastAPI backend with Supabase. They show a "Backend API" container
that doesn't exist in the shipped system. The current diagrams in
`docs/diagrams.md` reflect what's actually deployed.

### Q: Why are there pre-existing lint errors in the codebase?
Seven `react-hooks/set-state-in-effect` advisory errors on list pages
that use `useEffect(() => load(), [])`. The pattern works correctly;
the lint rule fires because there *exists* a more elegant phrasing.
Fixing them properly is on the post-presentation backlog (it's part
of the same `useEntityList` hook extraction that lessons-learned
flags as a "what we'd do differently").

### Q: Why is the standalone `/reports` page still there if there's a
dashboard widget that does the same thing?
PR #68 is "slice 1" of issue #40. The widget reaches feature parity
in slice 1; slice 2 (after the presentation) removes the standalone
page once we're sure no one is bookmarking it. Shipping both
temporarily was the safer choice.

---

## Things to NOT volunteer in Q&A unless asked

- The pre-existing lint errors (above) — don't draw attention to it
- The `Challenge-UI-#23` branch's unmerged tickets-table migration
  (it's exploratory work for a feature that isn't shipped)
- The branch-pruning history in v0.9.0 (interesting to us, irrelevant
  to the audience)
- Any individual teammate's contribution percentage (we present as a
  team)
