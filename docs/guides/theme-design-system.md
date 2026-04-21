# Guide: Theme & Design System (Issue #20)

> **Who this is for:** Khue and Eli
> [Issue #20 — Theme & Design System](https://github.com/CISC-480-GreenStep/sp26_team2_greenstepchallenge_admin/issues/20).
> This guide covers **only** the slice of the codebase that issue touches.
> You do not need to understand the whole app to do this task.
>
> **What's in this guide vs. what's not:**
> - Everything in §4, §6, §9, and §10 is **copied or cited directly from our
>   team's own docs** (`CODING_GUIDELINES.md`, `docs/ARCHITECTURE.md`,
>   `README.md`). The citations tell you where to look if you want the
>   long version.
> - **Start with §2 "Divide the work"** — that's where we actually split
>   who owns what.
> - Everything marked **[TEAM DECISION]** is something the team has **not**
>   decided yet. Ask in the team channel or on the GitHub issue before you
>   start coding that piece — don't pick for us.

---

## 1. What the issue is really asking for

The issue breaks down into four subtasks — one from the issue body, three
from Khue-Vo's follow-up comment. Each one gets its own letter (A–D) that
the rest of this guide refers back to.

### Task A — Configure the MUI v7 theme

> **From the issue body:** *"Configure the Material UI v7 theme and
> @emotion styling to match the project's professional, dark-themed
> aesthetic."*

Expand the very small theme object in `main.jsx` into a real one — palette,
typography, and maybe a couple of component defaults — so the whole app
reads as the intended dark aesthetic.

### Task B — Header color + body color

> **From the comment:** *"Theme color: header color and body color."*

Today a challenge has **one** color field called `theme`. Split it so the
admin can pick a header color *and* a body color separately.

### Task C — Live preview next to the form

> **From the comment:** *"a preview view next to the created challenge and
> template to know how the challenge [is] gonna be like once created."*

The phone-shaped preview component already exists — today it only appears
inside a dialog on the detail page. You're going to also render it live,
beside the create/edit form, so the admin sees the result as they type.

### Task D — Import image as header

> **From the comment:** *"Import Image as header: the image will override
> the solid color header."*

Let the admin attach an image; when one is set, the header area of the
preview (and eventually the real mobile app) shows the image instead of
the solid header color.

---

**Suggested order:** A → C → B → D. Each step builds on the last:

1. **A** sets the dark visual baseline for everything.
2. **C** gives you a live preview to verify the rest of your work visually.
3. **B** splits one color field into two — easy to see the effect with the
   preview already in place.
4. **D** layers the optional image on top.

Each step can ship as its own PR if the team prefers (see §9).

---

## 2. Divide the work (fill this out!)

This section is how we split issue #20 between us. **Don't skip it.**

**The goal is clean ownership.** Whoever picks up a task carries it to a
finished, reviewable PR. Ideally each of the four subtasks below has
exactly one owner.

**Prefer claiming whole features.** If a subtask feels like too much to
own end-to-end, that's fine — but please claim a *specific slice* that
leaves Eli a well-defined piece to finish, not a vague half-built one.
Each task has a "partial-ownership" option pre-drawn for you, with the
cleanest split already picked. Use that over inventing your own.

**If you get stuck mid-task, ask.** Ping Eli in the team channel or drop
a comment on the PR/issue. We'll unblock you on the spot. Asking for
help ≠ giving up ownership — the task is still yours. What we're
*avoiding* is silent hour-long grinds on something that could be
unblocked in five minutes.

**How to use this section:** read through the four subtasks below, check
one box per task, and either send the file back or jump on a quick call
to confirm. Effort estimates below are rough t-shirt sizing, not
deadlines, and assume you're comfortable with the file once you find it.

### Quick-look summary

| Task | What it is, in one line                                  | Effort                                                 | Depends on                |
| ---- | -------------------------------------------------------- | ------------------------------------------------------ | ------------------------- |
| A    | Expand the MUI theme into a full dark palette            | **Medium** (half-day-ish)                              | Nothing — good first task |
| B    | Split the single "theme color" into header + body colors | **Small-Medium** (a few hours, but touches many files) | A, C                      |
| C    | Render the existing phone-preview live next to the form  | **Small** (1–2 hours)                                  | A                         |
| D    | Let admins upload an image as the header                 | **Medium-Large** (depends on storage choice — see §8)  | B, C                      |

---

### Task A — Global MUI theme

**What you'd actually do:**

1. Rewrite the `createTheme({...})` call in `main.jsx` with a real dark
   palette (primary, secondary, background, text, maybe component defaults).
2. Click through every page with the new theme active and fix any
   component that still has hardcoded white/black in its `sx` prop (use
   the grep command in §6A).
3. Maybe set a body background in `index.css` so the browser doesn't
   flash white before React mounts.

**Files touched:** 1 main file (`main.jsx`), plus small edits in maybe
5–10 others you find via grep.

**Skills that help:** basic MUI theming (linked docs in §3), an eye for
color / dark-mode design. No database or Supabase knowledge needed.

**Design decisions required:** Yes — the final palette. You'd propose,
team approves.

**Who's doing it?** (check one)
- [ ] I'll own task A end-to-end
- [ ] Eli owns task A
- [ ] I'll draft the palette + the `createTheme` object (step 1); Eli does
      the hardcoded-color sweep across the rest of the app (steps 2–3)
- [ ] Not sure — want to discuss before committing

---

### Task B — Header + body colors

**What you'd actually do:**

1. Write a 2-statement SQL migration adding `headerColor` and `bodyColor`
   columns to the `challenges` and `presets` tables (see §8).
2. Update the form UI (`ChallengeFieldsSection.jsx`,
   `PresetFieldsSection.jsx`) to show two color pickers instead of one.
3. Update the form state defaults in `ChallengeForm.jsx` and
   `PresetForm.jsx` (the `EMPTY_FORM` objects).
4. Update the two places that *read* the color: `MobilePreview.jsx`
   (twice!) and the color dot in `ChallengeDetail.jsx`.

**Files touched:** 6 existing files + 1 new SQL migration. Mostly
repetitive find-and-replace; the tricky part is not missing the second
`challenge.theme` in `MobilePreview.jsx`.

**Skills that help:** comfort editing React forms, basic SQL
(`ALTER TABLE`). No design work.

**Design decisions required:** Just a sensible default body color
(probably `#FFFFFF` since the mobile app has a white screen).

**Who's doing it?** (check one)
- [ ] I'll own task B end-to-end
- [ ] Eli owns task B
- [ ] I'll do the form UI side — the two `FieldsSection` files + the
      `EMPTY_FORM` defaults (steps 2–3); Eli writes the SQL migration
      and updates the read-side (`MobilePreview` + `ChallengeDetail`)
- [ ] Not sure — want to discuss before committing

---

### Task C — Live preview next to the form

**What you'd actually do:**

1. In `ChallengeForm.jsx`, wrap the existing `<Paper>` in a two-column
   `<Grid>`. On the right side, render `<MobilePreview challenge={form}
   actions={previewActions} />`.
2. Add one line: `const previewActions = isEdit ? actions : presetActions;`
3. Do the same layout change in `PresetForm.jsx` (passing its own local
   `actions` state).
4. Add the import at the top of both files.

**Files touched:** 2 existing files. That's it. No new files, no database,
no new component.

**Skills that help:** Basic MUI `<Grid>` layout (linked docs in §3).
Easiest of the four tasks.

**Design decisions required:** How the preview behaves on mobile —
hide it, or stack below? Either is fine; pick one.

**Who's doing it?** (check one)
- [ ] I'll own task C end-to-end
- [ ] Eli owns task C
- [ ] Not sure — want to discuss before committing

> Task C is small enough that splitting it doesn't help — one person
> should take the whole thing.

---

### Task D — Header image upload

**What you'd actually do:**

1. Write a short SQL migration adding a `headerImageUrl` column.
2. Decide between **URL text field** (simpler) vs **Supabase Storage
   upload** (more work, real feature). See §8 for the fork.
3. If URL: just add a `<TextField label="Header image URL">` to the
   two fields sections. Done.
4. If Storage: also create a storage bucket in Supabase, write a new
   `data/api/storage.js` helper, and wire the upload into the field.
5. In `MobilePreview.jsx`, make the header `<Box>` use
   `backgroundImage` when `headerImageUrl` is set, else fall back to
   `headerColor`.

**Files touched:** 3 existing files + 1 migration + (maybe) 1 new API
helper.

**Skills that help:**
- URL version: same as task B — form fields + migration.
- Storage version: same plus reading the Supabase Storage JS docs
  (linked in §8).

**Design decisions required:** Storage vs URL. This is a team call, not
a coding one — flag it and ask.

**Who's doing it?** (check one)
- [ ] I'll own task D end-to-end, URL version
- [ ] I'll own task D end-to-end, Storage version
- [ ] Eli owns task D
- [ ] I'll do the UI field + migration (steps 1, 3, 5) and leave the
      Supabase Storage upload helper (step 4) for Eli — Storage version
      of the feature but with a clean split
- [ ] Not sure — want to discuss before committing

---

### Any other notes

_Free-form space — anything you want to flag before we lock this in?_

> (write your thoughts here)

---

## 3. If you're new to React / MUI, read this first

This task is mostly (a) editing small React components that already exist and
(b) changing one theme object. You do **not** need to learn all of React to
finish it, but these five concepts will make everything below make sense:

1. **A component is just a function that returns JSX.** Look at
   [`src/admin-app/src/features/presets/components/PresetFieldsSection.jsx`](../../src/admin-app/src/features/presets/components/PresetFieldsSection.jsx) —
   that's a complete component, about 70 lines, no magic.
2. **Props are the arguments to that function.** The parent passes things
   down; the child renders them. You'll see `{ form, onChange }` destructured
   from props in most of our files.
3. **State is what changes when the user types.** Our forms use
   `useState` and a `form` object. Changing a field calls
   `setForm({ ...prev, name: e.target.value })`.
4. **MUI's `sx` prop is our CSS.** Everything visual is styled via
   `sx={{ ... }}` on an MUI component like `<Box>` or `<Paper>`. No `.css`
   files for components — that's a team rule (`CODING_GUIDELINES.md` §1).
5. **The MUI theme is one JavaScript object.** It lives in `main.jsx` and
   every MUI component reads from it automatically. You change the theme
   there; the whole app updates.

**Links worth 20 minutes of your time before you start:**

- React in 5 minutes: <https://react.dev/learn>
- MUI `sx` prop: <https://mui.com/system/getting-started/the-sx-prop/>
- MUI theming: <https://mui.com/material-ui/customization/theming/>
- MUI dark mode: <https://mui.com/material-ui/customization/dark-mode/>

---

## 4. Orienting yourself in our codebase (short version)

Our `docs/ARCHITECTURE.md` is the full contributor map. For this task you
only need to know four things from it:

1. **The React app lives under `src/admin-app/src/`.** Everything you touch
   is in there. (`ARCHITECTURE.md` §2.)
2. **Each feature has its own folder** under `src/admin-app/src/features/`
   (e.g. `challenges/`, `presets/`). Page-level components sit at the
   folder root; their smaller sub-components live under `components/`.
   (`ARCHITECTURE.md` §3.)
3. **Reusable cross-feature components** live under
   `src/admin-app/src/components/shared/`, grouped by intent:
   `feedback/`, `data/`, `preview/`. The phone-frame preview component
   you'll be using lives in `shared/preview/`. (`ARCHITECTURE.md` §3.)
4. **All database reads/writes go through `src/admin-app/src/data/api/`.**
   Components import from the barrel: `from "../../data/api"`, never
   from `@supabase/supabase-js` directly. This is a hard rule
   (`CODING_GUIDELINES.md` §5, "All data access goes through `data/api`").

If you want the whole picture, skim `docs/ARCHITECTURE.md` §4 — "I want to
change X" — once. It lists a recipe for most common change requests. For
this issue, the relevant recipes are "Chart color palettes", "The page-level
MUI theme", and anything under §5 "I want to add X".

---

## 5. The files you will touch

This is the whole list. Anything not here, you don't need to open.

Each task below lists the files in the rough order you'll hit them.
Filenames are clickable links.

---

### Task A — Global MUI theme

- [`main.jsx`](../../src/admin-app/src/main.jsx)
  The `createTheme({ ... })` call near the top. This is the **only** file
  in the repo that creates the MUI theme, so everything else inherits
  from your changes here.

- [`index.css`](../../src/admin-app/src/index.css)
  Tiny global CSS file. Only touch it if you need to set a body background
  so the browser doesn't flash white before React mounts.

- [`lib/constants.js`](../../src/admin-app/src/lib/constants.js)
  Chart / medal / status colors. If you change the brand palette, align
  these so the dashboards don't clash.
  **Do not** move these into the MUI theme — the file header explains why.

> **[TEAM DECISION]** If your new `createTheme` object gets bigger than
> ~60 lines, the team may prefer to extract it to a new file
> `src/admin-app/src/lib/theme.js` and import it into `main.jsx`.
> `docs/ARCHITECTURE.md` §4 already names this as the expected location.
> Ask before splitting.

---

### Task C — Preview next to the form

- [`components/shared/preview/MobilePreview.jsx`](../../src/admin-app/src/components/shared/preview/MobilePreview.jsx)
  **Do not modify for task C.** You're just going to *render* this
  component alongside the form. You'll edit its internals in tasks B and D.

- [`features/challenges/ChallengeForm.jsx`](../../src/admin-app/src/features/challenges/ChallengeForm.jsx)
  Wrap the existing `<Paper>` in a two-column MUI `<Grid>` with
  `<MobilePreview>` on the right.

- [`features/presets/PresetForm.jsx`](../../src/admin-app/src/features/presets/PresetForm.jsx)
  Same two-column change. This form already has a local `actions` state
  you can pass straight to `MobilePreview`.

---

### Task B — Per-challenge header + body colors

**Forms (the UI for editing the colors):**

- [`features/challenges/components/ChallengeFieldsSection.jsx`](../../src/admin-app/src/features/challenges/components/ChallengeFieldsSection.jsx)
  Find the single `<TextField label="Theme Color" type="color" ... />`.
  Replace it with two fields bound to `form.headerColor` and
  `form.bodyColor`.

- [`features/presets/components/PresetFieldsSection.jsx`](../../src/admin-app/src/features/presets/components/PresetFieldsSection.jsx)
  Same change, same pattern.

**Form state (the default values):**

- [`features/challenges/ChallengeForm.jsx`](../../src/admin-app/src/features/challenges/ChallengeForm.jsx)
  The `EMPTY_FORM` object near the top — add `headerColor` and `bodyColor`
  keys with hex defaults. Also update the preset-apply handler so presets
  copy both colors over.

- [`features/presets/PresetForm.jsx`](../../src/admin-app/src/features/presets/PresetForm.jsx)
  Same `EMPTY_FORM` update.

**Places that read the colors (the UI that shows them):**

- [`components/shared/preview/MobilePreview.jsx`](../../src/admin-app/src/components/shared/preview/MobilePreview.jsx)
  **Two** references to `challenge.theme` in this file:
  1. the header `<Box>`, and
  2. the small dot on the faux tab-bar at the bottom.

  Change **both** to `challenge.headerColor`. Then add a body background
  (`bgcolor: challenge.bodyColor`) on the inner content `<Box>`
  (the one with `sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}`).

- [`features/challenges/ChallengeDetail.jsx`](../../src/admin-app/src/features/challenges/ChallengeDetail.jsx)
  Find the small colored circle in `ChallengeSummaryCard` (search the file
  for `borderRadius: "50%"`). It reads `challenge.theme`. Point it at
  `challenge.headerColor`.

**Database:**

- `supabase/migrations/004_theme_colors.sql` &nbsp;— &nbsp;**new file.** See §8 for the SQL.

> **Nothing** in `src/admin-app/src/data/api/challenges.js` or `presets.js`
> needs to change. Our Supabase queries pass columns through unchanged —
> if the column exists in Postgres, the JS object will have the same key.

---

### Task D — Header image upload

**Forms (the UI for uploading):**

- [`features/challenges/components/ChallengeFieldsSection.jsx`](../../src/admin-app/src/features/challenges/components/ChallengeFieldsSection.jsx)
  Add a file-upload field: MUI `<Button component="label">` wrapping a
  hidden `<input type="file" accept="image/*">`.

- [`features/presets/components/PresetFieldsSection.jsx`](../../src/admin-app/src/features/presets/components/PresetFieldsSection.jsx)
  Same addition.

**Places that render the image:**

- [`components/shared/preview/MobilePreview.jsx`](../../src/admin-app/src/components/shared/preview/MobilePreview.jsx)
  In the header `<Box>`, use `backgroundImage` when
  `challenge.headerImageUrl` is set; fall back to `headerColor` otherwise.

**Database + storage helper:**

- `src/admin-app/src/data/api/storage.js` &nbsp;— &nbsp;**new file,** *only if* the team
  picks Supabase Storage. See §8.

- `supabase/migrations/005_header_image.sql` &nbsp;— &nbsp;**new file.** See §8.

---

## 6. Step-by-step walkthroughs

### 6A. Global MUI theme (task A)

1. Open [`src/admin-app/src/main.jsx`](../../src/admin-app/src/main.jsx). The
   existing `createTheme(...)` call is very small (primary/secondary color
   + font family). You're going to expand it.
2. Here is a **starting skeleton** — copy this, then iterate on the colors
   until it looks right. The hex values below are placeholders, not a final
   palette.

   ```jsx
   const theme = createTheme({
     palette: {
       mode: "dark",
       primary:   { main: "#4CAF50" },
       secondary: { main: "#00BCD4" },
       background: {
         default: "#0F1419",
         paper:   "#1A1F26",
       },
       text: {
         primary:   "#E8EAED",
         secondary: "#9AA0A6",
       },
     },
     typography: {
       fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
       h5: { fontWeight: 700 },
       h6: { fontWeight: 600 },
     },
     shape: { borderRadius: 10 },
     components: {
       MuiPaper:  { styleOverrides: { root: { backgroundImage: "none" } } },
       MuiButton: { defaultProps: { disableElevation: true } },
     },
   });
   ```

   > **[TEAM DECISION]** The exact palette is a design call. The team has
   > **not** agreed on one yet. Before you pick final hex values, post your
   > proposed palette (a screenshot is fine) on the GitHub issue or in the
   > team channel and wait for a thumbs-up.
3. Run the app (see §7), click through every page, and look for places
   that still look wrong. The usual culprit is a component with a
   hard-coded white or black color in its `sx` prop. You can find them with
   plain `grep`:

   ```bash
   cd src/admin-app
   grep -rn -E 'bgcolor:\s*"#fff"|color:\s*"#000"' src/
   ```

   (If you have [ripgrep](https://github.com/BurntSushi/ripgrep) installed,
   `rg 'bgcolor: "#fff"|color: "#000"' src/` is faster.)

   Each hit is a decision: does this element *have* to be that color
   (e.g. the `MobilePreview` phone screen is meant to look like a real
   phone, so white stays), or should it use `"background.paper"` /
   `"text.primary"` from the theme? The `CODING_GUIDELINES.md` §2
   "Styling" checklist says:
   > Use theme tokens over hardcoded colors (`"primary.main"` not `"#2E7D32"`).
4. If you change the global background, also update
   [`src/admin-app/src/index.css`](../../src/admin-app/src/index.css):
   set `body { background-color: <your default>; }` so the browser
   doesn't flash the old light color before React finishes mounting.

### 6C. Live preview next to the form (task C)

The preview component [`MobilePreview.jsx`](../../src/admin-app/src/components/shared/preview/MobilePreview.jsx)
already exists and takes `{ challenge, actions }` as props. It's currently
only rendered inside a dialog on `ChallengeDetail`. You're going to also
render it live next to `ChallengeForm` and `PresetForm`.

In [`ChallengeForm.jsx`](../../src/admin-app/src/features/challenges/ChallengeForm.jsx),
find the `<Paper>` that wraps the form (look for `<Paper sx={{ ..., maxWidth: 700 }}>`).
Replace that `<Paper>` and everything inside it with:

```jsx
<Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 7 }}>
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      {/* existing <form> ... </form> here, unchanged */}
    </Paper>
  </Grid>
  <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: "none", md: "block" } }}>
    <Box sx={{ position: "sticky", top: 80 }}>
      <MobilePreview challenge={form} actions={previewActions} />
    </Box>
  </Grid>
</Grid>
```

`previewActions` is derived from state that already exists in the file.
Add this one line inside the component, right after the other state hooks:

```jsx
const previewActions = isEdit ? actions : presetActions;
```

- `actions` state is set by the existing `getActionsByChallenge(...)` call
  in the `useEffect` when editing.
- `presetActions` state is set by `handleApplyPreset` when the user picks
  a preset on the create flow; it's `[]` otherwise.

Do the same shape in [`PresetForm.jsx`](../../src/admin-app/src/features/presets/PresetForm.jsx),
passing its local `actions` state to `MobilePreview`.

Add the import at the top of both files:

```jsx
import { MobilePreview } from "../../components/shared/preview";
```

(The exact relative path depends on file location — `ChallengeForm.jsx`
is two levels deep from `src/`, so `../../` is right.)

No extra state wiring is needed: `form` is already React state, so the
preview re-renders automatically as the user types.

### 6B + 6D. New columns + image upload

Handled together because they're both data-layer changes.

---

## 7. Running and testing your changes

All commands run **from `src/admin-app/`** (same as the quickstart in
[`README.md`](../../README.md) §"Getting Started"):

```bash
cd src/admin-app
npm install          # only the first time, or after someone adds a dep
npm run dev          # Vite dev server on http://localhost:5173
npm run lint         # must pass before you push (CODING_GUIDELINES §6)
npm run lint:fix     # auto-fixes most import-order and formatting issues
npm run format       # re-runs Prettier on your edits
npm run build        # production build; the review checklist asks for this to pass
```

**Manual QA checklist** for this task:

1. Go to `/challenges/new` — the preview should appear on the right on
   desktop, and be hidden on mobile (stacked is also acceptable; design
   call).
2. Type a name — the preview title updates instantly.
3. Change the header color — the preview's top banner changes.
4. Change the body color — the preview's body area changes.
5. Upload or paste an image URL — the image covers the header, replacing
   the color.
6. Click "Create Challenge" — the new row persists all four new fields.
7. Visit `/challenges/:id` — the small color dot in the summary card
   uses the **header** color. The "View as User" dialog still opens and
   looks right.
8. With your new dark theme applied, click through every page in the app.
   No page should have white-on-white or dark-on-dark text.

---

## 8. Database + image storage

### The SQL migrations

New migration files go under [`supabase/migrations/`](../../supabase/migrations/).
Keep the numbering going (existing files are `001…` through `003…`):

```sql
-- supabase/migrations/004_theme_colors.sql
alter table challenges add column if not exists "headerColor" text default '#4CAF50';
alter table challenges add column if not exists "bodyColor"   text default '#FFFFFF';
alter table presets    add column if not exists "headerColor" text default '#4CAF50';
alter table presets    add column if not exists "bodyColor"   text default '#FFFFFF';

-- Backfill from the existing `theme` column so nothing ever has a NULL header.
update challenges set "headerColor" = theme where "headerColor" is null;
update presets    set "headerColor" = theme where "headerColor" is null;
```

```sql
-- supabase/migrations/005_header_image.sql
alter table challenges add column if not exists "headerImageUrl" text;
alter table presets    add column if not exists "headerImageUrl" text;
```

> **[TEAM DECISION]** Running a migration touches the shared Supabase
> database that the whole team uses. **Do not run these yourself until
> the team agrees on both the migrations and who is running them.**
> Post the SQL on the PR and wait for a green light.
>
> **[TEAM DECISION]** The existing `challenges.theme` column stays for
> now. Whether to keep it long-term, rename it to `headerColor`, or drop
> it in a later PR is a call for the team — flag it in your PR
> description and let the team pick.

### Image storage (task D)

There are two reasonable approaches. The team has not picked one yet:

- **Option 1: Supabase Storage.** Create a public bucket in the Supabase
  dashboard (e.g. `challenge-headers`). Upload via
  `supabase.storage.from("challenge-headers").upload(path, file)` and
  save the returned public URL into `headerImageUrl`.

  ⚠️ `CODING_GUIDELINES.md` §5 says **components never import `supabase`
  directly**. If you go this route, put the upload call in a **new**
  file at `src/admin-app/src/data/api/storage.js` (with a file-header
  docblock) and re-export it from the barrel at
  `src/admin-app/src/data/api/index.js`. The form component then imports
  `uploadHeaderImage` like any other API function.

- **Option 2: paste a URL.** Add a plain `<TextField label="Header image URL">`.
  Zero backend work. Good enough to unblock the preview while the team
  figures out storage. This is the "Future Goals #2" note in
  `README.md` anyway — photo uploads are already a known follow-up.

> **[TEAM DECISION]** Ask which option to implement. Either is fine for
> this PR.

---

## 9. The team conventions you must follow

These are **not** my opinions — they are copied from
[`../../CODING_GUIDELINES.md`](../../CODING_GUIDELINES.md). If you're
about to do something that feels wrong, that file is the authority.

- **File header.** Every `.js` / `.jsx` file under `src/` starts with:

  ```js
  /**
   * @file <name>.jsx
   * @summary <one-sentence description of what the file owns>
   */
  ```

  Any new file you add (like `src/lib/theme.js` or `src/data/api/storage.js`)
  needs this. (`CODING_GUIDELINES.md` §3, "File-header docblock".)

- **File size: ≤ 300 lines.** ESLint warns at 301 and errors at 501.
  `ChallengeForm.jsx` is already well past half that budget; if your
  edits push it over 300, extract the new layout into a sub-component
  under `src/admin-app/src/features/challenges/components/`.
  (`CODING_GUIDELINES.md` §3, "Tiered file-size policy".)

- **Import order — five groups with a blank line between each:**
  React → React Router → third-party (MUI, etc.) → internal `data/api` →
  internal components/utils. `npm run lint:fix` fixes most of this
  automatically. (`CODING_GUIDELINES.md` §2, "Import Order".)

- **Naming.** `PascalCase.jsx` for components, `camelCase.js` for
  utilities, `SCREAMING_SNAKE_CASE` for module-level constants,
  `handle*` for event handlers, `is/can/has/show*` for booleans.
  (`CODING_GUIDELINES.md` §2, "Naming".)

- **Styling: use theme tokens, not raw hex.** Prefer `color: "text.primary"`
  over `color: "#000"` and `bgcolor: "background.paper"` over
  `bgcolor: "#fff"`. Use the `sx` prop, never `style={{...}}` or a `.css`
  file. (`CODING_GUIDELINES.md` §2, "Styling".)

- **Comments explain *why*, not *what*.** Never add a comment that
  paraphrases the next line. Good comments point at issue links, trade-offs,
  or non-obvious invariants. `// TODO` without an issue number is
  rejected — write `// TODO(#20): …`. (`CODING_GUIDELINES.md` §3,
  "Cohesive Comment Standard".)

- **Only `data/supabase.js` imports `@supabase/supabase-js`.** If you
  build an image uploader, the Supabase Storage call goes in a new
  `data/api/storage.js` — not inside the React component.
  (`CODING_GUIDELINES.md` §5, "All data access goes through `data/api`".)

- **Branch naming** — `<type>/<short-kebab-description>`, lowercase,
  ≤ 50 characters. For this issue:
  `feature/theme-design-system` if you're doing everything in one branch,
  or something narrower like `feature/mui-dark-theme`,
  `feature/inline-challenge-preview`, `feature/challenge-header-image`
  if the team splits the issue. (`CODING_GUIDELINES.md` §4, "Branch Naming".)

- **Commit messages** — `<Verb> <description>`, capitalized imperative,
  no trailing period, first line ≤ 72 chars. Examples from our repo:
  `Add magic link authentication`, `Replace user deletion with
  deactivation-only approach`. Bad: `fixed stuff`, `WIP`.
  (`CODING_GUIDELINES.md` §4, "Commit Messages".)

- **Pull requests** — title ≤ 70 chars, body has a Summary and a Test
  Plan, squash merge, delete the branch after merge.
  (`CODING_GUIDELINES.md` §4, "Pull Requests".)

> **[TEAM DECISION]** The issue has two assignees. Do the two of you
> want one big PR for issue #20 or one PR per subtask? Either is fine by
> the guidelines — just decide up front.

---

## 10. Updating the docs in the same PR

This repo treats docs as part of the product. `docs/ARCHITECTURE.md`
§"When to update this file" lists the triggers exactly:

> Update `docs/ARCHITECTURE.md` in the same PR if you:
> - add or rename a top-level folder under `src/admin-app/src/`,
> - move a file across feature boundaries,
> - add a new entity module to `data/api/`,
> - add or remove a top-level route,
> - add a new dashboard widget, permission key, or shared component,
> - change one of the invariants in Section 6.

For *this* issue, the ones that apply:

- If you extract the theme into `src/admin-app/src/lib/theme.js`, add it
  to `ARCHITECTURE.md` §3 (one-line annotation) and update the
  "Look & feel" table in §4 (it currently names `src/lib/theme.js` as
  the *expected* location — your PR makes that real).
- If you add `src/admin-app/src/data/api/storage.js` for image upload,
  add a one-line entry for it in `ARCHITECTURE.md` §3 (the source tree).
  The `data/api/` rows in §4's "Data + permissions" table are
  entity-focused, so a storage helper doesn't obviously belong there —
  leave that table alone unless a reviewer asks for a row.
- `README.md` — add a bullet under the current version's "What's Built"
  section describing the new theme fields, live preview, and (if
  shipped) header image upload. Match the existing entry style. Also
  add a new version entry in "Version History" if the team bumps the
  version number.

Adding the migration files under `supabase/migrations/` does **not**
trigger an `ARCHITECTURE.md` update — just add the files.

---

## 11. If you get stuck

1. Search the file you're editing for `@summary`. Every file under `src/`
   has a one-line summary at the top that tells you exactly what the file
   owns. That alone answers most "what is this doing?" questions.
2. Check `docs/ARCHITECTURE.md` §4 "I want to change X" — there's a
   recipe for most change requests.
3. If the UI looks right but a field doesn't persist, the migration
   probably didn't run yet, or the JS field name doesn't exactly match
   the SQL column name. Our helpers pass columns through verbatim —
   `"headerColor"` in SQL is `headerColor` in JS. No translation.
4. If you've been stuck for more than ~30 minutes: drop a comment on
   the GitHub issue (or the team's usual channel) with (a) the file
   and line you're on, (b) the last thing you tried, and (c) what you
   expected vs. what you got. That's enough for anyone on the team to
   help you in one reply.

---

## Summary of the [TEAM DECISION] items

Before you start coding, get answers to these — they are the only
things in this guide I deliberately did **not** make a choice on:

1. Are you doing all four subtasks, or splitting with the other assignee?
2. Final dark-theme palette (hex values). Propose; team approves.
3. One big PR for issue #20, or one PR per subtask?
4. Who runs the SQL migrations, and when?
5. Do we keep, rename, or drop the existing `challenges.theme` column?
6. For the image header: Supabase Storage, or URL text field?
