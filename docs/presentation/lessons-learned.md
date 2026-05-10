# Lessons Learned

> Source material: the March 12 4Ls retro
> ([`meetings/2026-03-12-meeting-notes.md`](../../meetings/2026-03-12-meeting-notes.md)),
> the published Lucid board linked from
> [`retrospectives.md`](../../retrospectives.md), and the team's commit /
> issue history Mar–May 2026.

---

## Technical lessons

### 1. We dropped a planned backend; doing it earlier would have saved a sprint

Our project proposal called for a Python (FastAPI) backend in front of a
standalone Postgres. We started building it, then in v0.6.x we replaced it
with **Supabase** (Postgres + Auth + REST + RLS in one managed service).
Outcome: no more middle tier to maintain, magic-link auth + later OTP came
"for free", and we picked up Row-Level Security as an actual security
boundary instead of bolting it on in app code.

**What we'd do differently:** evaluate "does a managed BaaS cover this?"
*before* committing to a custom backend. We lost ~2 weeks on an API layer
we deleted.

### 2. Auth UX is its own mini-project

We shipped magic-link auth first. It worked on desktop but on phones the
link kept opening in a different browser than the one the user was reading
mail in — breaking the session. We rewrote it as **8-digit OTP codes**
(PR #61). Codes work everywhere: any browser, any device, any email client.

**What we'd do differently:** test auth on a real phone in the first sprint
it ships. We wouldn't have built magic-link if we'd done that.

### 3. Row-Level Security is harder to deploy than to write

We enabled RLS, found we had over-restricted the dev login, rolled it back,
re-enabled it, rolled it back again, and finally landed it in PR #63.
Migrations 006 → 011 are the rollback/re-enable paper trail. The lesson
isn't "RLS is bad" — it's that **schema changes need a staging database**.
Pasting SQL into the Supabase dashboard against the only database we have
is how you take prod down at 2am.

**What we'd do differently:** stand up a second Supabase project as
"staging" before any schema change.

### 4. Code structure compounds

We did a 10-PR refactor sprint in v0.7.x because every feature was
re-implementing the same scaffolding by hand: form load/save, list filter
state, confirmation dialogs, header rows. Even after that sprint we still
have **`handleChange = (field) => (e) => setForm(...)` copy-pasted in 4
forms** and an **8-page identical Back-button + title pattern** that only
got extracted in this PR.

**What we'd do differently:** invest in shared CRUD scaffolding (a
`useEntityForm` hook, a `useEntityList` hook, a `<PageHeader>` component)
*the first* time you write a second instance. We waited until the third or
fourth.

### 5. Cross-feature imports are quiet rot

Templates kept importing `ActionFormDialog` and `CategoryFormDialog`
directly from `features/challenges/components/` instead of moving them to
`components/shared/`. Worked fine — but every new contributor had to learn
"this dialog is shared even though it doesn't look shared," and the
documented invariant in our own ARCHITECTURE.md was being violated. Cleaned
up in this PR.

**What we'd do differently:** the moment a second feature imports a
component from another feature's folder, **stop and move it** instead of
adding the import.

---

## Process & teamwork lessons

These come straight from the March 12 retro.

### What worked

- **Cohesion under pressure.** When unexpected blockers came up
  (Christine's feedback on Sprint 1, the FastAPI pivot, the RLS rollback)
  the team adapted instead of arguing about whose plan was right.
- **Complementary strengths.** Database (Josh), UI/UX (Khue), tooling and
  refactor discipline (Eli), feature implementation (Rudy). Nobody had to
  fake expertise outside their lane.
- **Cursor as a force multiplier.** Headless Puppeteer testing of PRs (e.g.
  the May 4 smoke test in `testing/2026-05-04-pr-68/`) caught a regression
  before merge. We wouldn't have written manual scripts of that depth.

### What didn't work

- **Inconsistent meeting attendance** — there was always at least one
  member missing on Tuesdays. We never solved this.
- **Direct-to-main commits early on** — the main branch became messy
  before we adopted the PR-with-review workflow in mid-March.
- **Async coordination** — changes happened without a heads-up, leading to
  merge conflicts that wasted hours. We addressed this with the
  branch-per-issue convention but only after the pain.

### What we'd do differently

- **Pick the meeting time first, not last.** "When can everyone meet?" is a
  4-week problem; we should have solved it in week 1.
- **Mandatory PR reviews from day one**, not "once the codebase gets
  messy."
- **One retro template per person** — `retrospectives.md` lists three
  formats (KALM, Peaks/Valleys, Sailboat) we never got around to running.
  Each member should have facilitated one.

---

## Skills developed (career-relevant)

- **Schema design + migration discipline** (Postgres, Supabase CLI, RLS
  policy authoring) — Josh
- **Information architecture and design systems** (MUI v7 dark theme,
  4-color theming, mobile-first preview) — Khue
- **Refactoring at scale** (10-PR slice methodology, file-size policy
  enforcement, dead-code removal) — Eli
- **Feature implementation across the stack** (Challenge UI, Templates,
  custom Categories) — Rudy
- **Cross-cutting:** Git workflow, code review, headless browser testing,
  agile sprint cadence

---

## What we'd build next (the post-presentation backlog)

In priority order, all already filed as GitHub issues:

1. **Issue #70** (Khue) — extract shared `EntityFieldsSection` so Challenge
   and Template forms share their fields component
2. **Issue #40** — finish absorbing the standalone `/reports` page into the
   dashboard widget catalog
3. **Issue #67** — rebuild SuperAdmin "permanent delete user" via Vercel
   API route (the original lived on a dropped branch)
4. **Issue #9** — persist dashboard layouts to Supabase per user, not
   localStorage
5. **Issue #8** — photo upload support for participation records (Supabase
   Storage)
6. **Issue #51 / #57** — Badges UI and Problem-Ticket UI (data tables
   already exist on `Challenge-UI-#23`)
7. **Coordination with Team 1** — finalize the shared Supabase schema so
   the mobile app can ship against the same database

A larger architectural follow-up not yet ticketed: extract the
`useEntityForm` and `useEntityList` hooks so future features (badges,
tickets, etc.) don't replicate the same 200-line scaffold.
