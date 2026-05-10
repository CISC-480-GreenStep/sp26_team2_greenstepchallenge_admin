# Architecture Diagrams (C4)

> Source-of-truth diagrams for the GreenStep Admin Console. Mermaid is the
> canonical format; update *here* when architecture changes, not in slides.
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
flowchart TD
  classDef feature fill:#1f3a52,stroke:#4DD0E1,color:#fff
  classDef shared fill:#2E7D32,stroke:#66BB6A,color:#fff
  classDef data fill:#5d3a1f,stroke:#FFA726,color:#fff
  classDef ext fill:#37474F,stroke:#90A4AE,color:#fff

  subgraph Features["features/ — one folder per route"]
    auth["auth<br/>(LoginPage, AuthContext,<br/>RequireAuth)"]:::feature
    dash["dashboard<br/>(15 widgets, 2 hooks,<br/>ComparisonMode)"]:::feature
    chal["challenges<br/>(List, Form, Detail,<br/>+ 10 sub-components)"]:::feature
    tmpl["templates<br/>(List, Form,<br/>+ 1 sub-component)"]:::feature
    grps["groups<br/>(List, Form, Detail,<br/>+ 2 sub-components)"]:::feature
    usrs["users<br/>(List, Form, Detail,<br/>+ 5 sub-components)"]:::feature
    rpts["reports<br/>(ReportsPage —<br/>being absorbed by dashboard)"]:::feature
  end

  subgraph Shared["components/shared/"]
    feedback["feedback/<br/>ConfirmDialog"]:::shared
    sdata["data/<br/>StatCard, CSVExport,<br/>EntityLink"]:::shared
    forms["forms/<br/>ActionFormDialog,<br/>CategoryFormDialog"]:::shared
    layout["layout/<br/>PageHeader"]:::shared
    preview["preview/<br/>MobilePreview"]:::shared
  end

  subgraph Lib["lib/"]
    perms["permissions.js<br/>can(role, perm)"]:::shared
    theme["theme.js<br/>MUI dark theme"]:::shared
    consts["constants.js<br/>palettes + status maps"]:::shared
  end

  subgraph DataLayer["data/api/ — barrel"]
    barrel["index.js<br/>(single import surface)"]:::data
    entities["users · challenges · actions ·<br/>participation · groups · templates ·<br/>categories · activityLogs · leaderboard"]:::data
    sb["supabase.js<br/>(only file importing<br/>@supabase/supabase-js)"]:::data
  end

  ext_supabase[("Supabase<br/>Postgres + Auth + RLS")]:::ext

  Features --> Shared
  Features --> Lib
  Features --> barrel
  barrel --> entities
  entities --> sb
  sb --> ext_supabase

  auth -.->|context| Features
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
