# Architecture & Navigation Guide

> The contributor's map. Land here when you're asking
> "where does X live?" or "how do I change Y?"
>
> If something in the codebase moves, update this file in the same PR.
> Conventions and style rules live in [`../CODING_GUIDELINES.md`](../CODING_GUIDELINES.md);
> high-level project overview, setup, and changelog live in
> [`../README.md`](../README.md). This file does not duplicate them.

---

## 1. Repository Layout (top level)

```
sp26_team2_greenstepchallenge_admin/
├── README.md                  ← project overview, setup, version history
├── CODING_GUIDELINES.md       ← naming, imports, comments, file-size policy
├── docs/
│   ├── README.md              ← docs folder index
│   ├── ARCHITECTURE.md        ← you are here
│   └── backups/               ← snapshot copies of merged docs
├── meetings/                  ← meeting notes and transcripts
├── retrospectives.md          ← sprint retros
├── data/                      ← reserved for future migrations / seed data
├── db/                        ← reserved for SQL artifacts
├── supabase/
│   └── migrations/            ← canonical Postgres schema (run against Supabase)
└── src/
    └── admin-app/             ← the React application (everything below this)
```

The single React app lives under `src/admin-app/`. All commands in the README
(`npm install`, `npm run dev`, etc.) run from there.

## 2. Application Layout (`src/admin-app/`)

```
src/admin-app/
├── .env.example                ← copy to .env, fill Supabase URL + anon key
├── eslint.config.js            ← flat config: imports, max-lines, prettier passthrough
├── .prettierrc.json            ← formatting rules Prettier owns
├── package.json                ← deps + scripts (dev / build / lint / format / preview)
├── vite.config.js              ← Vite build config
├── vercel.json                 ← Vercel deploy config (rewrites, etc.)
├── netlify/                    ← serverless function for Supabase user invites
├── api/                        ← Vercel-style equivalent of the same function
├── public/                     ← static assets served as-is
└── src/                        ← all application source (annotated below)
```

## 3. Source Tree (`src/admin-app/src/`)

Every entry has a one-line "what to look for here" annotation. When in doubt
about which file owns a behavior, search for the JSDoc `@summary` line inside
the file -- every source file has one.

```
src/admin-app/src/
├── main.jsx                              ← React entry (createRoot + <App>)
├── App.jsx                               ← Route table (single source of truth for URLs)
│
├── components/
│   ├── layout/                           ← App-shell chrome (auth-gated routes only)
│   │   ├── AdminLayout.jsx                 ← TopBar + Sidebar + <Outlet/> shell
│   │   ├── Sidebar.jsx                     ← Permanent (md+) / temporary (sm) drawer + nav links
│   │   └── TopBar.jsx                      ← Header w/ user chip + sign-out
│   │
│   └── shared/                           ← Cross-feature widgets, grouped by intent
│       ├── feedback/
│       │   └── ConfirmDialog.jsx           ← Reusable destructive-confirm modal
│       ├── data/
│       │   ├── StatCard.jsx                ← KPI tile (value + icon)
│       │   ├── CSVExport.jsx               ← "Export CSV" button for any array of objects
│       │   └── EntityLink.jsx              ← Inline link → /{type}/{id}
│       ├── preview/
│       │   └── MobilePreview.jsx           ← Phone-frame preview of a challenge
│       └── index.js                        ← Top-level barrel (re-exports the three subfolders)
│
├── data/                                  ← Everything that talks to Supabase
│   ├── supabase.js                         ← Supabase client singleton (only file that imports @supabase/supabase-js)
│   └── api/                                ← Per-entity API modules + barrel
│       ├── index.js                        ← Public surface: components import from "../../data/api"
│       ├── constants.js                    ← ROLES, CHALLENGE_STATUSES, ACTIONS, etc.
│       ├── helpers.js                      ← Internal: error wrapping, snake_case ⇄ camelCase
│       ├── users.js                        ← getUsers / createUser / updateUser / ...
│       ├── challenges.js                   ← Challenges + challenge_actions + challenge_participants joins
│       ├── actions.js                      ← Sustainability action catalog
│       ├── participation.js                ← Per-(user, action, challenge) completion events
│       ├── groups.js                       ← Postgres `departments` table (UI calls them Groups)
│       ├── presets.js                      ← Reusable challenge templates + their action templates
│       ├── templates.js                    ← Legacy templates (no UI yet; kept for completeness)
│       ├── activityLogs.js                 ← Admin audit log
│       └── leaderboard.js                  ← Cross-table aggregation queries (points, top users)
│
├── lib/                                   ← Domain-agnostic utilities
│   ├── constants.js                        ← Color palettes (CHART, COMPARISON, MEDAL) + status maps
│   └── permissions.js                      ← can(role, perm) + the PERMS table
│
└── features/                              ← One folder per top-level UI area
    │
    ├── auth/                              ← Sign-in + route gating (split for React Fast Refresh)
    │   ├── AuthContext.jsx                 ← <AuthProvider> only
    │   ├── authContextValue.js             ← Raw createContext value
    │   ├── useAuth.js                      ← Consumer hook (import this from anywhere)
    │   ├── LoginPage.jsx                   ← Magic-link + dev-shortcut sign-in
    │   ├── AuthCallback.jsx                ← Supabase OAuth/magic-link return target
    │   └── RequireAuth.jsx                 ← Route guard (auth + optional minRole)
    │
    ├── dashboard/                         ← Customizable widget grid + comparison mode
    │   ├── DashboardPage.jsx               ← Thin orchestrator (state, snackbar, mode switch)
    │   ├── DashboardGrid.jsx               ← react-grid-layout wrapper
    │   ├── DashboardWidget.jsx             ← Card frame (drag handle + remove button)
    │   ├── WidgetCatalog.jsx               ← Side drawer composing the three catalog sections
    │   ├── ComparisonMode.jsx              ← Multi-challenge comparison orchestrator
    │   ├── config/                         ← Declarative widget + layout registry
    │   │   ├── widgets.js                    ← WIDGETS catalog, WIDGET_CATEGORIES, DEFAULT_VISIBLE
    │   │   ├── layouts.js                    ← autoLayout, buildResponsiveLayouts, LAYOUT_PRESETS
    │   │   └── index.js                      ← Barrel
    │   ├── components/
    │   │   ├── DashboardToolbar.jsx          ← Title row + edit/save/cancel/customize buttons
    │   │   ├── widgetRenderer.jsx            ← widget id → React component mapping
    │   │   ├── catalog/                      ← WidgetCatalog drawer pieces
    │   │   │   ├── CatalogPresets.jsx          ← Quick-Layout chips
    │   │   │   ├── CatalogChallengeFilter.jsx  ← Per-challenge data filter + Comparison Mode toggle
    │   │   │   └── CatalogWidgetList.jsx       ← Search + grouped widget on/off list
    │   │   └── comparison/                   ← Per-chart pieces of ComparisonMode
    │   │       ├── ComparisonCard.jsx          ← Shared card shell (title + minHeight)
    │   │       ├── RelativeEngagementChart.jsx
    │   │       ├── CategoryBreakdownChart.jsx
    │   │       ├── TotalsBarChart.jsx
    │   │       ├── AverageActionsChart.jsx
    │   │       └── ComparisonSummaryTable.jsx
    │   ├── hooks/
    │   │   ├── useDashboardLayout.js         ← Editable grid state + localStorage persistence
    │   │   ├── useDashboardStats.js          ← Loads data, calls aggregations, returns `stats`
    │   │   ├── aggregations.js               ← 13 pure builders consumed by useDashboardStats
    │   │   └── useComparisonData.js          ← Pure aggregation hook for Comparison Mode
    │   └── widgets/                        ← 14 widget components (one per id in the catalog)
    │       ├── StatWidget.jsx                ← Used by all 8 stat-* ids (config-driven)
    │       ├── CategoryPieWidget.jsx, ChallengeStatusWidget.jsx,
    │       ├── ChallengeSummaryWidget.jsx, CompletionRatesWidget.jsx,
    │       ├── GroupPerformanceWidget.jsx, LeaderboardWidget.jsx,
    │       ├── MostActiveUsersWidget.jsx, ParticipationBarWidget.jsx,
    │       ├── PointsByChallengeWidget.jsx, PointsDistributionWidget.jsx,
    │       ├── RecentActivityWidget.jsx, UpcomingChallengesWidget.jsx,
    │       └── UserGrowthWidget.jsx
    │
    ├── challenges/                        ← Challenge CRUD + detail
    │   ├── ChallengesPage.jsx              ← List, search, filter
    │   ├── ChallengeForm.jsx               ← Create / edit (mode driven by URL :id)
    │   ├── ChallengeDetail.jsx             ← Read-only view with participants + leaderboard + log
    │   └── components/
    │       ├── ChallengesToolbar.jsx         ← Title row + CSV / Manage Presets / New buttons
    │       ├── ChallengesFilterBar.jsx       ← Search + status + group filters
    │       ├── ChallengesTable.jsx           ← The list table + row action buttons
    │       ├── ChallengeFieldsSection.jsx    ← Form fields (shared by create + edit)
    │       ├── ActionsEditor.jsx             ← Edit-mode actions table
    │       ├── ActionFormDialog.jsx          ← Add/edit action modal (shared w/ presets)
    │       ├── PresetPicker.jsx              ← "Quick Start" preset dropdown (create flow only)
    │       ├── ParticipantsTable.jsx         ← ChallengeDetail: who has logged ≥1 action
    │       ├── ChallengeLeaderboard.jsx      ← ChallengeDetail: top scorers w/ medals
    │       └── ParticipationLog.jsx          ← ChallengeDetail: per-completion event feed
    │
    ├── presets/                           ← Reusable challenge templates
    │   ├── PresetsPage.jsx                 ← List
    │   ├── PresetForm.jsx                  ← Create / edit (orchestrator)
    │   └── components/
    │       ├── PresetFieldsSection.jsx
    │       └── PresetActionsEditor.jsx       ← Reuses ActionFormDialog from challenges/
    │
    ├── groups/                            ← Group (Postgres `departments`) CRUD
    │   ├── GroupsPage.jsx                  ← List + search
    │   ├── GroupForm.jsx                   ← Create / edit
    │   ├── GroupDetail.jsx                 ← Header + members + challenges-in-group
    │   └── components/
    │       ├── MembersTable.jsx
    │       └── GroupChallengesTable.jsx
    │
    ├── users/                             ← User management
    │   ├── UsersPage.jsx                   ← List + filters + CSV
    │   ├── UserForm.jsx                    ← Create (invite via serverless fn) / edit profile
    │   ├── UserDetail.jsx                  ← Header + points + participation + activity log
    │   └── components/
    │       ├── UsersFilterBar.jsx
    │       ├── UsersTable.jsx
    │       ├── PointsHistoryTable.jsx        ← Global + per-challenge points
    │       ├── ParticipationHistoryTable.jsx ← Logged sustainability actions
    │       └── UserActivityLogList.jsx       ← Admin actions taken on this user
    │
    └── reports/                           ← Cross-challenge participation report
        └── ReportsPage.jsx                  ← Filters + table + category chart + CSV
```

## 4. "I want to change X" — recipes

These are the most common change requests. Each one names exactly the file(s)
to open. If your task isn't here, search for the relevant JSDoc `@summary`
line inside the source tree.

### UI / behavior

- **Sidebar nav links**
  → [`Sidebar.jsx`](../src/admin-app/src/components/layout/Sidebar.jsx) — edit the `NAV_ITEMS` array.

- **Top header content**
  → [`TopBar.jsx`](../src/admin-app/src/components/layout/TopBar.jsx).

- **Routes + which roles can hit each**
  → [`App.jsx`](../src/admin-app/src/App.jsx) — adjust the `<RequireAuth minRole=...>` wrappers.

- **"Confirm before delete" dialog text/style**
  → [`ConfirmDialog.jsx`](../src/admin-app/src/components/shared/feedback/ConfirmDialog.jsx).

- **"Export CSV" button label / behavior**
  → [`CSVExport.jsx`](../src/admin-app/src/components/shared/data/CSVExport.jsx).

- **Inline entity link rendering**
  → [`EntityLink.jsx`](../src/admin-app/src/components/shared/data/EntityLink.jsx).

- **Dashboard's default widgets or layout**
  → [`widgets.js`](../src/admin-app/src/features/dashboard/config/widgets.js) (`DEFAULT_VISIBLE`)
  and [`layouts.js`](../src/admin-app/src/features/dashboard/config/layouts.js) (`LG_DEFAULT`, `LAYOUT_PRESETS`).

- **Which challenge fields appear on the form**
  → [`ChallengeFieldsSection.jsx`](../src/admin-app/src/features/challenges/components/ChallengeFieldsSection.jsx).

- **Participants table on a challenge**
  → [`ParticipantsTable.jsx`](../src/admin-app/src/features/challenges/components/ParticipantsTable.jsx).

### Data + permissions

| What you want to change | Where |
|---|---|
| Who can do what (role gates) | [`src/lib/permissions.js`](../src/admin-app/src/lib/permissions.js) — only edit `PERMS` values |
| The list of action categories (taxonomy) | [`src/data/api/constants.js`](../src/admin-app/src/data/api/constants.js) (`ACTIONS`) |
| Challenge status enum | [`src/data/api/constants.js`](../src/admin-app/src/data/api/constants.js) (`CHALLENGE_STATUSES`) |
| How a single entity is read / written | The matching `src/data/api/<entity>.js` module |
| The Supabase URL / anon key | `src/admin-app/.env` (copy from `.env.example`) — never commit |
| Database schema | [`supabase/migrations/`](../supabase/migrations/) — re-run against your Supabase project |

### Look & feel

| What you want to change | Where |
|---|---|
| Chart color palettes | [`src/lib/constants.js`](../src/admin-app/src/lib/constants.js) (`CHART_COLORS`, `COMPARISON_COLORS`, `MEDAL_COLORS`, `STATUS_COLOR`) |
| Sidebar drawer width | `DRAWER_WIDTH` constant exported from `src/components/layout/Sidebar.jsx` |
| The page-level MUI theme | (none yet — themes are inline `sx` props; if a global theme is added, it should live in `src/lib/theme.js`) |

### Tooling

| What you want to change | Where |
|---|---|
| Lint rules (max-lines, import order) | [`src/admin-app/eslint.config.js`](../src/admin-app/eslint.config.js) |
| Prettier formatting | [`src/admin-app/.prettierrc.json`](../src/admin-app/.prettierrc.json) |
| Vite build / dev-server config | [`src/admin-app/vite.config.js`](../src/admin-app/vite.config.js) |
| Vercel deploy behavior (rewrites, etc.) | [`src/admin-app/vercel.json`](../src/admin-app/vercel.json) |
| The user-invite serverless function | [`src/admin-app/netlify/`](../src/admin-app/netlify/) (Netlify) and [`src/admin-app/api/`](../src/admin-app/api/) (Vercel) — keep both in sync |

## 5. "I want to add X" — playbooks

Each playbook lists the files to touch in order. Keep each step small and
commit-able; if a playbook produces a >300-line file, see Section 3 of
`CODING_GUIDELINES.md`.

### Add a new top-level page (e.g. `/notifications`)

1. Create `src/features/notifications/NotificationsPage.jsx` with a file-header docblock.
2. Register the route in [`src/App.jsx`](../src/admin-app/src/App.jsx). Wrap in `<RequireAuth minRole=...>` if it should be admin-gated.
3. Add a nav link to `src/components/layout/Sidebar.jsx` (`NAV_ITEMS` array).
4. If the page reads data that doesn't exist yet, add an entity module under `src/data/api/` (see next playbook).
5. Add a permission key to `src/lib/permissions.js` if the page is role-gated and gate columns/buttons inside the page with `can(userRole, "...")`.

### Add a new entity to the data layer

1. Create `src/data/api/<entity>.js` (e.g. `notifications.js`) with a file-header docblock.
2. Implement the read / write functions; every function returns plain JS objects (camelCase), never raw Supabase rows. Reuse `helpers.js` for error wrapping.
3. Re-export the new module from [`src/data/api/index.js`](../src/admin-app/src/data/api/index.js) — this is the only file callers import from.
4. If the entity needs SQL changes, add a new file under [`supabase/migrations/`](../supabase/migrations/) following the existing numbering.
5. Add JSDoc `@param` / `@returns` on every exported function.

### Add a new dashboard widget

1. Create `src/features/dashboard/widgets/<Name>Widget.jsx`. The component must accept a single `data` prop (the full `stats` object from `useDashboardStats`) and return a node sized to fill its parent.
2. If it needs derived data, add a builder to `src/features/dashboard/hooks/aggregations.js` and call it from `buildStats` inside [`useDashboardStats.js`](../src/admin-app/src/features/dashboard/hooks/useDashboardStats.js).
3. Register the widget in [`src/features/dashboard/config/widgets.js`](../src/admin-app/src/features/dashboard/config/widgets.js): add an entry to `WIDGETS` (id, title, description, category, defaultLayout, minH, minW). If you want it on by default, add the id to `DEFAULT_VISIBLE`.
4. Add the id → component mapping in [`src/features/dashboard/components/widgetRenderer.jsx`](../src/admin-app/src/features/dashboard/components/widgetRenderer.jsx).
5. (Optional) Add the id to one of the named layouts in [`config/layouts.js`](../src/admin-app/src/features/dashboard/config/layouts.js) (`LAYOUT_PRESETS`).

### Add a new permission gate

1. Add a key to `PERMS` in [`src/lib/permissions.js`](../src/admin-app/src/lib/permissions.js), set the value to the minimum `ROLES.*` allowed.
2. In the consuming component: `import { can } from "../../lib/permissions"` and `const may = can(userRole, "YOUR_KEY");`. Conditionally render based on `may`.
3. Document the gate in the `PERMS` block with a JSDoc one-liner so the role matrix in `README.md` stays accurate.

### Add a shared component

1. Decide intent: feedback (modals/snackbars), data (tables/exports/links), preview (visual previews), or layout (chrome).
2. Create the component under `src/components/shared/<intent>/<Name>.jsx` with a file-header docblock.
3. Re-export it from the matching subfolder `index.js` barrel.
4. Consumers import from the subfolder barrel: `import { ConfirmDialog } from "../../components/shared/feedback";`.

### Add a sub-component to an existing feature

1. Create it under `src/features/<feature>/components/<Name>.jsx`.
2. Import it directly from the feature's parent file (no barrel for feature-internal components).
3. Keep cross-feature components in `src/components/shared/` instead.

## 6. Data & Auth Flow (one diagram)

```mermaid
flowchart LR
  user["User<br/>(browser)"] -->|magic link / dev login| login["LoginPage<br/>features/auth"]
  login -->|sets session| sb["Supabase Auth"]
  sb -->|profile row| api["data/api/users.js"]
  api --> ctx["AuthProvider<br/>features/auth/AuthContext.jsx"]
  ctx -->|useAuth hook| pages["Page components<br/>features/*"]
  pages -->|reads + writes| barrel["data/api<br/>(barrel)"]
  barrel --> entities["data/api/*.js<br/>per-entity modules"]
  entities -->|@supabase/supabase-js| supabase["data/supabase.js<br/>(only place that imports the SDK)"]
  supabase --> postgres["Supabase Postgres"]
```

Key invariants:

- **Only `data/supabase.js` imports `@supabase/supabase-js`.** Every other file
  goes through an entity module so we can swap backends in one place.
- **Every entity module is re-exported from `data/api/index.js`.** Components
  always import from `"../../data/api"`, never from `"../../data/api/users"`.
- **Auth state flows through the `useAuth` hook**, not by reading the
  Supabase client directly.

## 7. Conventions Reference

These are normative; this doc only summarizes. The full text lives in
[`../CODING_GUIDELINES.md`](../CODING_GUIDELINES.md).

- **File header:** every `.js` / `.jsx` file under `src/` starts with a
  JSDoc block containing `@file <name>` and `@summary <one line>`.
- **File size:** ≤300 lines fine, 301–500 needs PR justification, >500 needs
  a top-of-file `eslint-disable max-lines` plus an issue link. Enforced by
  ESLint (`max-lines`).
- **Imports:** five groups, blank line between each (React → Router →
  third-party → `data/api` → internal). Enforced by `eslint-plugin-import`.
- **Naming:** `PascalCase.jsx` for components, `camelCase.js` for utilities,
  `SCREAMING_SNAKE_CASE` for module-level constants, `handle*` for event
  handlers, `is/can/has/show*` for booleans.
- **Comments explain *why*, not *what*.** No `// loop over users`-style
  narration.
- **Branch / commit names:** `feature|fix|chore|refactor/<kebab>` and
  `<Verb> <description>` respectively.

---

## When to update this file

Update `docs/ARCHITECTURE.md` in the same PR if you:

- add or rename a top-level folder under `src/admin-app/src/`,
- move a file across feature boundaries,
- add a new entity module to `data/api/`,
- add or remove a top-level route,
- add a new dashboard widget, permission key, or shared component,
- change one of the invariants in Section 6.

Routine bug fixes and intra-feature refactors do **not** require editing this
file. The goal is to keep the map accurate without making it a chore.
