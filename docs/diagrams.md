# Architecture Diagrams (C4)

> ## ⚠️ DRAFT — Work In Progress
>
> **Status:** baseline for the team to review and personalize before the
> presentation. Nothing here is final.
>
> **Things to decide / adjust together:**
> - Are the box labels at the right level of detail for a non-technical
>   audience? (Kristin, faculty)
> - Should L3 be split into "what" vs "how" — one diagram for Kristin, one
>   technical for faculty?
> - Color palette — currently blues/greens/orange. Match the rest of our
>   brand?
> - Anything missing? (e.g. should the mobile app sibling have a stronger
>   callout in L1?)
>
> Source-of-truth: this file. Mermaid is the canonical format; update
> *here* when architecture changes, not in slides.
>
> An older image-based snapshot lives in
> [Issue #4](https://github.com/CISC-480-GreenStep/sp26_team2_greenstepchallenge_admin/issues/4)
> from before the FastAPI → Supabase migration; treat that as historical.

---

## L1 — System Context

Who interacts with the system, and which neighbouring systems it talks to.

```mermaid
flowchart TB
  classDef person fill:#08427b,stroke:#052e56,color:#fff
  classDef personExt fill:#686868,stroke:#4a4a4a,color:#fff
  classDef system fill:#1168bd,stroke:#0b4884,color:#fff
  classDef systemExt fill:#999,stroke:#6b6b6b,color:#fff

  staff(["MPCA Staff<br/><br/>SuperAdmin / Admin /<br/>GeneralUser roles"]):::person
  participant(["Challenge Participant<br/><br/>Logs sustainability actions"]):::personExt

  admin["GreenStep Admin Console<br/><br/>Web app for managing challenges,<br/>users, groups, templates, reports"]:::system

  mobile["GreenStep Mobile App<br/><br/>Team 1 user-facing app<br/>(shares the database)"]:::systemExt
  supabase["Supabase<br/><br/>Postgres + Auth + REST + RLS"]:::systemExt
  vercel["Vercel<br/><br/>Hosts SPA +<br/>serverless functions"]:::systemExt

  staff -->|"Manages challenges,<br/>runs reports (HTTPS)"| admin
  participant -->|"Logs actions (HTTPS)"| mobile
  admin -->|"Reads/writes via<br/>@supabase/supabase-js (HTTPS)"| supabase
  mobile -->|"Reads/writes<br/>(shared schema, HTTPS)"| supabase
  admin -.->|"Hosted on"| vercel
```

---

## L2 — Containers

Deployable units inside the Admin Console boundary.

```mermaid
flowchart TB
  classDef person fill:#08427b,stroke:#052e56,color:#fff
  classDef container fill:#438dd5,stroke:#2e6295,color:#fff
  classDef containerDb fill:#438dd5,stroke:#2e6295,color:#fff
  classDef systemExt fill:#999,stroke:#6b6b6b,color:#fff

  staff(["MPCA Staff<br/><br/>Browser-based"]):::person

  subgraph boundary["GreenStep Admin Console (deployed on Vercel)"]
    spa["React SPA<br/><br/>React 19 + Vite + MUI v7<br/><br/>Renders all admin pages;<br/>talks to Supabase directly<br/>via supabase-js"]:::container
    fns["Vercel Serverless Functions<br/><br/>Node.js (api/)<br/><br/>Privileged ops only:<br/>invite-user, set-user-active<br/>(uses Supabase service-role key)"]:::container
    local[("Browser localStorage<br/><br/>Per-user dashboard<br/>layout cache")]:::containerDb
  end

  supabase["Supabase<br/><br/>Postgres + Auth + RLS"]:::systemExt

  staff -->|"Uses (HTTPS)"| spa
  spa -->|"Reads/writes<br/>(anon key, RLS-enforced, HTTPS)"| supabase
  spa -->|"Calls for invites +<br/>activate/deactivate (HTTPS)"| fns
  fns -->|"Admin ops with<br/>service-role key (HTTPS)"| supabase
  spa -.->|"Persists dashboard layout"| local
```

**Key design decision (called out for the rubric):** the SPA talks to Supabase
directly using the anon key. Authorization isn't enforced in the React code —
it lives in **Postgres Row-Level Security policies** keyed off the JWT role
claim. That's why we don't need a separate backend API container.

---

## L3 — Components inside the React SPA

How the SPA is organized internally. Matches the source tree under
`src/admin-app/src/`.

```mermaid
flowchart LR
  classDef feature fill:#1f3a52,stroke:#4DD0E1,color:#fff
  classDef shared fill:#2E7D32,stroke:#66BB6A,color:#fff
  classDef data fill:#5d3a1f,stroke:#FFA726,color:#fff
  classDef ext fill:#37474F,stroke:#90A4AE,color:#fff
  classDef hub fill:#0d47a1,stroke:#42a5f5,color:#fff,stroke-width:2px

  subgraph Features["features/ — route-level UI"]
    direction TB
    auth["<b>auth</b><br/>LoginPage · AuthContext · RequireAuth"]:::feature
    dash["<b>dashboard</b><br/>15 widgets · 2 hooks · ComparisonMode"]:::feature
    chal["<b>challenges</b><br/>List · Form · Detail · +10 sub"]:::feature
    tmpl["<b>templates</b><br/>List · Form · +1 sub"]:::feature
    grps["<b>groups</b><br/>List · Form · Detail · +2 sub"]:::feature
    usrs["<b>users</b><br/>List · Form · Detail · +5 sub"]:::feature
    rpts["<b>reports</b><br/>ReportsPage<br/><i>(being absorbed by dashboard)</i>"]:::feature
  end

  page(("Any page<br/>component")):::hub

  subgraph Shared["components/shared/"]
    direction TB
    feedback["feedback/ — ConfirmDialog"]:::shared
    sdata["data/ — StatCard · CSVExport · EntityLink"]:::shared
    forms["forms/ — ActionFormDialog · CategoryFormDialog"]:::shared
    layout["layout/ — PageHeader"]:::shared
    preview["preview/ — MobilePreview"]:::shared
  end

  subgraph Lib["lib/"]
    direction TB
    perms["permissions.js — can(role, perm)"]:::shared
    theme["theme.js — MUI dark theme"]:::shared
    consts["constants.js — palettes · status maps"]:::shared
  end

  subgraph DataLayer["data/api/ — single import surface"]
    direction TB
    barrel["<b>index.js (barrel)</b><br/>components import only from here"]:::data
    entities["per-entity modules:<br/>users · challenges · actions · participation<br/>groups · templates · categories<br/>activityLogs · leaderboard"]:::data
    sb["<b>supabase.js</b><br/>only file importing<br/>@supabase/supabase-js"]:::data
    barrel --> entities --> sb
  end

  ext_supabase[("<b>Supabase</b><br/>Postgres + Auth + RLS")]:::ext

  Features --> page
  page -->|"composes UI from"| Shared
  page -->|"checks roles · reads theme"| Lib
  page -->|"reads/writes data via"| barrel
  sb -->|"@supabase/supabase-js"| ext_supabase
  auth -.->|"useAuth() context<br/>used by every page"| page
```

### Verified architectural invariants

These are the rules that keep the diagram clean. All currently hold:

1. **Only `data/supabase.js` imports `@supabase/supabase-js`.** Verified by
   grep (1 match).
2. **No component bypasses the `data/api` barrel** to import a sub-module
   directly. Verified by grep (0 matches).
3. **Cross-feature components live in `components/shared/`.** As of this PR,
   no feature folder imports another feature's components.
4. **`lib/` stays small.** 3 files: `constants.js`, `permissions.js`,
   `theme.js`. No feature-specific code.

### What this view intentionally simplifies

- The 15 dashboard widgets are not drawn individually — see
  `features/dashboard/config/widgets.js` for the registry.
- Per-feature internal sub-components are summarized as a count; the source
  tree in [`ARCHITECTURE.md`](./ARCHITECTURE.md) §3 lists each one.
- The `reports/` feature is shown but flagged for absorption into `dashboard/`
  (tracked in [issue #40](https://github.com/CISC-480-GreenStep/sp26_team2_greenstepchallenge_admin/issues/40)).

---

## When to update this file

- A new top-level feature folder is added or removed under `features/`
- A shared component category (`feedback`, `data`, `forms`, `layout`,
  `preview`) is added or removed
- The "SPA talks to Supabase directly" invariant changes (e.g. introducing a
  middle-tier API)
- A new external system enters the picture (e.g. Supabase Storage for photos,
  a notification provider, etc.)
