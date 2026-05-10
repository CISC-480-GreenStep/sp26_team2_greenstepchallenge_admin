# Slide Deck Outline — Baseline

> ## ⚠️ DRAFT — Work In Progress
>
> **Status:** loose skeleton for the team to personalize. Slide order,
> bullet wording, and presenter splits are all suggestions — change
> anything that doesn't fit how you want to tell the story.
>
> **Time budget:** 15 minutes (rubric allows ±1). Per-section times below
> are starting estimates that should add up to ~14:30, leaving 30s buffer.
> Adjust as a team.
>
> **Conventions in this doc:**
> - `[TBD: presenter]` — replace with a name once the team splits the deck
> - `[TBD: time]` — adjust if you reshuffle sections
> - **bullets** are baseline ideas; cut, reword, expand to taste
> - 🖼️ markers suggest a visual; can be the mermaid diagram, a screenshot,
>   or skipped entirely

---

## Slide 1 — Title (~0:30) · [TBD: presenter — usually whoever opens]

**GreenStep Sustainability Challenge — Admin Console**

- Team: Khue Vo · Rudy Vergara · Eli Goldberger · Josh Dunlap
- Client: Kristin Mroz-Risse, Minnesota Pollution Control Agency (MPCA)
- CISC 480 Senior Capstone · Spring 2026 · University of St. Thomas

🖼️ Optional: brand color block, MPCA logo if you have permission to use it.

---

## Slide 2 — Purpose & Problem (~1:00) · [TBD: presenter]

**The problem we set out to solve**

- MPCA's GreenStep program runs sustainability challenges (Earth Month,
  commute weeks, water-savings weeks) for cities and individuals across
  Minnesota.
- Today the program is run on **manually-maintained spreadsheets and
  email** — every challenge is a copy-paste of last year's, every report
  is a hand-built pivot table.
- Kristin needed a tool a non-developer can run end-to-end.

**Why it matters to the community partner**

- Less staff time on busywork → more time on outreach.
- Reliable participation data → tells the story to MPCA leadership ("900
  actions taken, 12% in transportation").
- Lower barrier for new cities to join the program.

**Primary users**

- MPCA admin staff (3 role tiers: SuperAdmin / Admin / GeneralUser)
- Sister Team 1 is building the participant-facing mobile app (shared
  database)

---

## Slide 3 — System Overview (Bird's-Eye) (~1:00) · [TBD: presenter]

**What it is, in one sentence**

> A web-based admin console where MPCA staff create challenges, manage
> who can participate, and pull reports — backed by a database that the
> participant mobile app shares.

🖼️ **Use C4 L1 from `docs/diagrams.md`** here. Either embed the mermaid
or paste a screenshot.

**Main parts (read left to right on the diagram):**

- **MPCA staff** sign in with an emailed code
- **Admin Console** = a React web app on Vercel (this team's work)
- **Mobile App** = participant-facing (Team 1's work, sibling)
- **Supabase** = the shared database + auth + security layer

---

## Slide 4 — How the Pieces Fit (~1:00) · [TBD: presenter]

🖼️ **Use C4 L2 (container view) from `docs/diagrams.md`.**

**Talking points:**

- The web app talks to Supabase **directly** — no separate backend to
  maintain. ([Design decision #1, slide 6])
- Two small Vercel functions handle the things the browser shouldn't see
  (creating new users, deactivating accounts).
- Authorization is a **database rule, not a JavaScript rule** —
  Postgres Row-Level Security. ([Design decision #2, slide 6])
- Per-user dashboard layouts cache in the browser so customizations
  survive a refresh.

---

## Slide 5 — Key Features (~1:30) · [TBD: presenter]

**Pick 3-5 to highlight; full list lives in `README.md` "What's Built".**

Suggested top 5:

1. **Customizable dashboard** — drag-and-drop grid of 23 widgets;
   per-user layout. *Why it matters:* every admin sees what *they* care
   about, not what we guessed they'd want.
2. **Challenge templates** — reusable pre-configured challenges
   (H2O Hero Week, Power Down, Sustainable Commute). *Why it matters:*
   Earth Month next year is a 30-second clone, not a 2-hour rebuild.
3. **Live mobile preview next to forms** — phone-frame preview updates
   as Kristin types. *Why it matters:* no more "create, save, switch to
   phone, look, edit, repeat."
4. **Custom action categories** — admins add their own taxonomy from
   the form. *Why it matters:* the program will evolve; the database
   shouldn't be a barrier.
5. **CSV reports with audit trail** — every report is filterable +
   exportable; every admin action is logged. *Why it matters:*
   leadership briefings + accountability.

---

## Slide 6 — Two Design Decisions That Mattered (~1:30) · [TBD: presenter]

**Decision 1: Database-enforced security (Row-Level Security)**

- We could have written `if (user.role === 'admin')` checks throughout
  the React code.
- Instead, the rules live in **Postgres** as policies. Even if a future
  developer forgets a check in the UI, the database refuses the query.
- *Why it matters to the community partner:* one less way to
  accidentally leak participant data.

**Decision 2: 8-digit code sign-in (instead of magic links)**

- We shipped magic-link sign-in first. On phones, the link kept opening
  in a different browser than the one Kristin was reading mail in.
- Switched to **8-digit codes**: same security model, works on any
  device, no broken sessions.
- *Why it matters:* reliability beats clever UX every time when the
  user is on a 3-year-old phone in a coffee shop.

---

## Slide 7 — Demo Intro (~0:30) · [TBD: presenter]

**Setup line:** "What you're about to see is a typical Monday for
Kristin: sign in, customize her view, build a new challenge from a
template, lock down a problem account, and pull a report for her board."

Hand off to the demo driver.

---

## Slides 8a–8e — Live Demo (~5:00 total) · [TBD: driver + narrator]

**Use [`demo-script.md`](./demo-script.md) verbatim** — six beats:

1. OTP sign-in (~0:35)
2. Customize dashboard + add Reports widget (~0:55)
3. New challenge from template + live preview (~1:30)
4. Permissions + RLS (~1:00)
5. CSV export (~0:45)
6. Wrap (~0:15)

🖼️ Slides during the demo are usually one big screenshot or a black
slide — the audience watches the live app, not the deck.

If demo gear fails, fall back to:

- 5 captured screenshots from `testing/2026-05-04-pr-68/RESULTS.md`
- Narrate the same beats over them.

---

## Slide 9 — Lessons Learned: Technical (~1:30) · [TBD: presenter]

**Pull from [`lessons-learned.md`](./lessons-learned.md). Suggested 3:**

- **We dropped a planned backend** — replaced FastAPI plan with Supabase
  in v0.6.x. *Saved ~2 weeks.*
- **Auth UX is its own mini-project** — magic-link → OTP rewrite. *Test
  on a real phone in sprint 1.*
- **Schema changes need a staging database** — RLS rollback/redeploy
  story (migrations 006 → 011). *We took prod down once.*

---

## Slide 10 — Lessons Learned: Teamwork (~1:00) · [TBD: presenter]

**Pull from [`lessons-learned.md`](./lessons-learned.md). Suggested:**

- **What worked:** complementary strengths, adaptability under pressure,
  Cursor-driven PR smoke testing caught a regression before merge.
- **What we'd change:** pick the meeting time in week 1 (we never solved
  attendance), mandatory PR reviews from day one (not "once main is
  messy"), one retro-format-per-person.
- **Skills we developed:** Postgres + RLS authoring, design system
  thinking, large-scale refactoring with linting policies, headless
  browser testing.

---

## Slide 11 — What's Next (~0:45) · [TBD: presenter]

**Pull the prioritized backlog from [`lessons-learned.md`](./lessons-learned.md):**

- Issue #70 — extract shared form fields (Khue's lane)
- Issue #40 — fold standalone `/reports` into the dashboard widget
- Issue #67 — SuperAdmin permanent-delete via Vercel API route
- Issues #51 / #57 — Badges UI and Problem Tickets UI
- Issue #9 — persist dashboard layouts to Supabase
- Issue #8 — photo upload for participation records
- Coordinate the shared Supabase schema with Team 1's mobile app

---

## Slide 12 — Conclusion + Thank You (~0:45) · [TBD: presenter]

**Three-bullet wrap:**

- **Problem:** MPCA was running statewide sustainability programs on
  spreadsheets and email.
- **Solution:** a role-aware admin console backed by a shared,
  RLS-protected database that the participant mobile app uses too.
- **Impact:** Kristin can clone last year's Earth Month in 30 seconds,
  pull a board-ready CSV in three clicks, and trust that data privacy
  is enforced at the database — not at the UI.

**Thank you.**

- Kristin Mroz-Risse + MPCA — for the time, the real-world data, and
  the patient feedback.
- Christine + faculty — for the framework that made this a sprint
  cadence instead of a 3-month death march.
- Team 1 — for the cross-team coordination on the shared schema.

---

## Slide 13 — Questions? (~3:00 question budget) · [all team members on stage]

🖼️ Big "Questions?" + the GitHub repo URL.

Have [`qa-prep.md`](./qa-prep.md) open on a laptop or printed.

---

## Time check

| Section | Slides | Time |
|---|---|---|
| Open + Purpose | 1, 2 | 1:30 |
| System Overview | 3, 4 | 2:00 |
| Features + Decisions | 5, 6 | 3:00 |
| Demo intro + live demo | 7, 8 | 5:30 |
| Lessons learned | 9, 10 | 2:30 |
| What's next + Conclusion | 11, 12 | 1:30 |
| **Total** | | **~14:30** |
| Q&A (separate from 15 min) | 13 | 3:00 |

---

## Open questions for the team to answer

- Who opens? (energy + tone-setter)
- Who drives the demo vs. who narrates it?
- Who handles the "uncomfortable" question if it comes (e.g. "what about
  the magic-link rollback")?
- Are we OK leaning into the lessons-learned section, or do we want it
  shorter to leave more room for features?
- Do we need a one-pager / leave-behind for Kristin?
