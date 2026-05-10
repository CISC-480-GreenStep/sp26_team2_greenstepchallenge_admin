# Live Demo Script — 5 minutes

> Goal: walk one realistic MPCA admin scenario top-to-bottom while exercising
> the features added in v0.10.0 (OTP auth, RLS, custom categories, dashboard
> reports widget, live mobile preview).

**Total target:** 5:00 (rubric allows 4–6).

**Driver:** one person clicks; another person narrates.

**Pre-flight (do this before the demo starts):**
- Browser at `http://localhost:5173`, logged out
- DevTools closed
- Window at 1440×900 minimum; sidebar visible
- Terminal hidden / not screen-shared
- Test that the Quick Login button works

---

## Beat 1 — Sign in with OTP (0:00 – 0:35)

**Click:** type Kristin's email → "Send Code" → enter the 8-digit code
emailed to her.

**Say:**
> "Kristin signs in with her work email. We just shipped this — until last
> week we were emailing her a magic link, but on phones the link kept opening
> in the wrong browser and breaking the session. Eight-digit codes work
> everywhere — she reads it off her phone and types it in. No password to
> manage."

*(If running offline, use the **Quick Login as Kristin (SuperAdmin)** dev
button and narrate "this skips email for the demo.")*

---

## Beat 2 — The customizable dashboard (0:35 – 1:30)

**Click:** land on `/`. Pause for 2 seconds so the audience sees the default
layout. Then click **Customize** → **Widgets** → toggle **"Participation
Report"** on under "Reports & Analysis" → **Save**.

**Say:**
> "The dashboard is hers, not ours. There are 23 widgets — stat cards, charts,
> tables — and she drags them around to make her own view. Each layout saves
> per-user."
>
> "We just added this Participation Report widget — it's a filterable table
> with CSV export, right on the dashboard, so she doesn't have to leave the
> page she just customized."

**Click:** open the report widget's **Challenge** filter → pick **Clean
Commute Week** → row count drops live.

**Say:**
> "Filter is per-widget. She can drop two of these on the same dashboard with
> different filters — this is what the community partner asked for back in
> March."

---

## Beat 3 — Create a challenge from a template + live mobile preview (1:30 – 3:00)

**Click:** **Challenges** → **New Challenge** → "Quick Start: Select a
Template" → **H2O Hero Week** → form fills in.

**Say:**
> "Templates are reusable challenges. Earth Month, water week, commute
> challenge — they live in the database as templates and pre-fill the form
> when she creates a new one."

**Click:** point at the right-side phone preview. Edit the **Name** field
("H2O Hero Week → Spring Water Challenge"); preview updates as you type.
Change the header background color.

**Say:**
> "The phone on the right is the actual mobile-app rendering — same
> components Team 1 uses. She sees what participants will see, in real time.
> No more 'create, save, switch tabs, look at it on a phone' loop."

**Click:** scroll to **Categories** → **+ Create New Category** → type
"Reuse & Repair" → Save.

**Say:**
> "And until last week our six categories were hard-coded. Now she can add
> 'Reuse & Repair' or anything else MPCA wants for next year — straight from
> the form."

**Click:** Save the challenge.

---

## Beat 4 — Permissions + Row-Level Security (3:00 – 4:00)

**Click:** **Users** → click any GeneralUser → **Deactivate** → confirm.

**Say:**
> "If a user becomes a problem, an Admin deactivates them in one click."

**Click:** sign out → try to sign in as that deactivated user.

**Say:**
> "And here's the part that matters. Even if someone has the email, they
> can't get a code anymore. That's not enforced by us writing 'if deactivated,
> block' in the React app — it's a Postgres rule. Same for everything else:
> what each role can see and do is enforced at the database, so a bug in the
> React app physically can't leak data."

*(Show the OTP request return "no account" error.)*

---

## Beat 5 — Reports + CSV export for leadership (4:00 – 4:45)

**Sign back in as Kristin.** Go to the **Participation Report** widget you
already pinned. Filter to a date range. Click **Export CSV**.

**Say:**
> "This is what she takes to her board. Filter by challenge, by date,
> download a CSV. The columns are exactly what their existing scoring
> templates expect — we extracted the format from real MPCA tracker files
> from 2019, 2020, 2022, and 2024."

---

## Beat 6 — Wrap (4:45 – 5:00)

> "That's the loop: sign in, build a custom dashboard, ship a challenge,
> manage who sees what, and walk out with a CSV. All on a free tier, all on
> Vercel + Supabase, mobile-friendly, role-aware. Happy to take questions."

---

## Backup beats (only if you finish under 4:00)

- **Comparison Mode** — Dashboard → Customize → "Comparison Mode" → pick 2
  challenges → 4 side-by-side charts.
- **Group filter** — Challenges → filter by Group → click into a group → see
  members + the group's challenges.
- **Activity log** — Any user's detail page → scroll to "Activity Log" →
  every admin mutation is recorded with who/when/what.

## Things to NOT show (will eat time and risk a regression)

- Editing actions inside a challenge (works, but the dialog flow is the
  longest in the app)
- Photo upload (not built — issue #8)
- The legacy `/reports` standalone page (it's being absorbed into the widget;
  showing both is confusing)
