# Meeting Prep — Sunday, May 10, 2026

**Context:** weekly sync, 3 days before the May 13 capstone presentation.

---

## TL;DR (paste this into chat)

> Pushed a presentation-prep PR last night (#73): C4 diagrams in mermaid, a
> 13-slide outline, demo script, lessons-learned draft, and Q&A prep — all
> flagged WIP so we can personalize. Also two small refactors that close
> #70 (shared dialogs) and address #5 (README accuracy). Nothing in the PR
> changes app behavior.
>
> What's left for the team in the next 3 days:
> 1. Pick which slides each of us owns (table in the PR)
> 2. Skim the lessons-learned + Q&A drafts and flag anything you'd phrase differently
> 3. Run through the demo script once on your own machine
> 4. (Optional) L4 diagram is deferred — whoever wants the auth-flow slide can own it
>
> PR + review guide: https://github.com/CISC-480-GreenStep/sp26_team2_greenstepchallenge_admin/pull/73

---

## What I did last night

### Code (mechanical, no behavior change)

- Renamed `features/presets/` → `features/templates/` so folder name matches the files
- Moved `ActionFormDialog` + `CategoryFormDialog` into `components/shared/forms/` → **closes #70**
- Extracted `<PageHeader>` shared component, replaced 8 copies of the same Back-button + title row
- Cleaned up stale `netlify/` references in docs (we're Vercel-only)

### Docs

- `docs/diagrams.md` — C4 L1 / L2 / L3 in mermaid (renders in Cursor + GitHub) → **partially closes #4** (L4 deferred)
- `README.md` bumped to v0.10.0; corrected magic-link → OTP; added entries for PRs #56, #59, #61, #63, #65, #66, #68 → **closes #5**
- `docs/ARCHITECTURE.md` synced for templates rename + new shared barrels + RLS + OTP
- `docs/presentation/` (new folder):
  - `slides-outline.md` — 13-slide skeleton with `[TBD: presenter]` markers
  - `demo-script.md` — 5-min live walkthrough
  - `lessons-learned.md` — synthesized from the March 12 retro + commit history
  - `qa-prep.md` — anticipated questions with draft answers

All presentation docs carry **DRAFT — Work In Progress** banners. They are baselines, not final copy.

### Verification

- `npm run build` clean
- `npm run lint` 7 errors / 0 warnings (= baseline, all pre-existing)
- All 3 mermaid diagrams render in Cursor preview

---

## What's left (3 days)

### Must-do before May 13

- [ ] **Assign slide owners** — see suggested table in PR #73, change as needed
- [ ] **Each owner**: replace `[TBD: presenter]` markers + flesh out their slides
- [ ] **Demo runner**: dry-run `docs/presentation/demo-script.md` end-to-end at least once
- [ ] **One person reads `lessons-learned.md`** and confirms it accurately reflects how the retro felt — this is the slide most likely to get a follow-up question
- [ ] **One person reads `qa-prep.md`** and flags any answer they'd phrase differently in front of Kristin or faculty

### Nice-to-have

- [ ] L4 (code-level) diagram — issue #4 is only partly addressed; if someone wants the auth-flow code slide, that's the open slot
- [ ] Practice run as a full team (45 min)

### Outstanding PRs to land before the talk

| PR | Author | What it adds | Risk |
|---|---|---|---|
| #68 | Eli | Reports widget (already demoed in script) | tested, low |
| #72 | Rudy | Archive Template Import + Comparison Mode | needs a reviewer |
| #73 | Eli | This presentation prep | docs only |

Suggested merge order: #68 → #73 (rebase) → #72 in parallel.

---

## Discussion items for the meeting

1. Who owns which slides? (decision needed today so people have 2 days to write)
2. Are we OK with the demo flow in `docs/presentation/demo-script.md`, or do we want to demo a different feature?
3. Who runs the demo live vs. who narrates?
4. Do we want a team practice run? When?
5. Anything from `qa-prep.md` we should *not* say if asked? (worth aligning before the room)
