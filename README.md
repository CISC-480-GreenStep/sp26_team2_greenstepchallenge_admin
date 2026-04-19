# GreenStep Sustainability Challenge - Admin Console

Administrative management console for Minnesota GreenStep Cities, enabling staff to create and manage sustainability challenges, oversee user participation, and generate data-driven reports.

**Team:** Khue Vo, Rudy Vergara, Eli Goldberger, Josh Dunlap  
**Client:** Kristin Mroz-Risse, Minnesota Pollution Control Agency (MPCA)  
**Semester:** Spring 2026

---

## Project Overview

This is the **admin-side** application for the GreenStep Sustainability Challenge. A separate team (Team 1) is building the user-facing mobile app. Both teams share a common database (coordination in progress).

### Current Version: v0.7.2 — Phase 2 Cleanup (Audit Follow-ups)

**Status:** Frontend MVP backed by Supabase. Codebase modularized into per-entity API modules and per-feature sub-components; shared components grouped by intent (`feedback` / `data` / `preview`); dashboard config split into `widgets` + `layouts`; dashboard stats split into hook + pure `aggregations` module; `WidgetCatalog` decomposed into per-section sub-components; auth context decomposed for React Fast Refresh. Every source file now carries a `@file` / `@summary` docblock and **no source file is over 300 lines**. Coding standards enforced via Prettier + ESLint.

### What's Built

- **Authentication** — Supabase magic-link sign-in with role lookup; a "Quick Login as Kristin (SuperAdmin)" dev shortcut is wired up for local development
- **Role-based access control** — SuperAdmin, Admin, GeneralUser with route guards
- **Customizable Dashboard** — 22 available widgets (8 stat cards, 9 charts, 5 tables/lists) arranged in a drag-and-drop grid; click **Customize** to enter edit mode where widgets can be rearranged by dragging and resized from corners; **Widget Library** drawer lets you toggle any widget on/off and apply **Quick Layout Presets** (Default, Executive Summary, Analytics Deep Dive, Compact Overview); layout persists to localStorage per user; HCI-informed design with affordance cues (grip handles, dashed borders in edit mode), feedback (snackbar confirmations), error prevention (can't remove all widgets, cancel/reset available), and progressive disclosure (edit controls only appear when customizing)
- **Challenge Management** (renamed from "Events") — list with search/filter by status and group (URL support for groupId), create/edit forms, detail view with **Participants** table (who completed actions), participation log, clickable group link, archive/delete, CSV export
- **Action CRUD** — admins can add, edit, and delete actions within each challenge (name, description, category, points)
- **Group Management** — full CRUD for flexible groups; **Group Detail** page with member list (add/remove), challenges in group, bidirectional links; clickable member/challenge counts on list
- **User Management** — list with search/filter by role and group, create/edit forms with group assignment, detail view with **Change Group** dropdown (Admin/SuperAdmin), clickable group and challenge links, activity log, participation history, **global points** total, and **per-challenge points history** table (earned vs max with progress bars), activate/deactivate, CSV export
- **Challenge Presets** — reusable templates with pre-configured actions; create, edit, delete presets from a dedicated page; applying a preset when creating a new challenge pre-fills form fields and automatically creates all template actions; 3 seed presets (H2O Hero Week, Power Down Challenge, Sustainable Commute Week)
- **Reports** — filter by challenge and date range, category breakdown chart, full participation table with clickable user/challenge links, CSV export
- **Responsive layout** — collapsible sidebar on mobile, responsive tables and forms
- **Persistence** — all entity data lives in Supabase (Postgres); per-user dashboard layout is cached in `localStorage` so customizations survive refresh

### What's NOT Built Yet

- Integration with Team 1's user-facing mobile app (shared schema in progress)
- Photo uploads and content moderation
- Advanced analytics / saved report templates and BI features
- Push-notification integration for challenge reminders
- Server-side persistence of per-user dashboard layouts (currently `localStorage` only)

---

## Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | React 19 (JavaScript)              |
| Build Tool | Vite                               |
| UI Library | Material UI (MUI) v7               |
| Charts     | Recharts                           |
| Dashboard Grid | react-grid-layout v2 (drag-and-drop) |
| Routing    | React Router v7                    |
| Data       | Supabase (Postgres + Auth)         |
| Quality    | ESLint + Prettier (import order, max-lines, format-on-save) |

> Note: an earlier project plan called for a separate Python (FastAPI) + standalone PostgreSQL backend. That layer was dropped in v0.6.x in favor of Supabase, which provides Postgres + Auth + the REST/Realtime API in one managed service. The "Future Goals" section below tracks what's still left.

---

## Getting Started

### Quick Start (4 steps)

1. Make sure you have [Node.js](https://nodejs.org/) 18 or newer installed (`node -v` to check).
2. Copy `src/admin-app/.env.example` to `src/admin-app/.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (ask a maintainer or grab them from the Supabase project dashboard).
3. Install + start the dev server:

```bash
cd src/admin-app
npm install
npm run dev
```

4. Open **http://localhost:5173** in your browser.

### Logging In

- **Production / shared deploys:** enter your email on the login page, click "Send magic link", and follow the link Supabase emails to you.
- **Local dev shortcut:** click **"Quick Login as Kristin (SuperAdmin)"** on the login page. This runs a Supabase password sign-in against the seeded SuperAdmin account so you don't have to round-trip through email each time.

### Managing Presets

- **View:** From the Challenges page, click "Manage Presets" to see all reusable templates with category, theme, and action count
- **Create:** Manage Presets > "New Preset" > fill in name, description, category, theme, and add action templates > Create
- **Edit:** Click a preset name or the pencil icon to modify fields and actions
- **Delete:** Click the trash icon (confirmation required)
- **Apply:** When creating a new challenge, use the "Quick Start: Select a Template" dropdown — the form fields auto-fill and a preview of actions appears; on submit, all template actions are created automatically

### Managing Challenges

- **Create:** Challenges > "New Challenge" button > fill form > Create
- **Edit:** Click the pencil icon on any challenge row, or change its Status to Active/Completed/Archived from the edit form
- **Archive:** Click the archive icon on any non-archived challenge (one-click)
- **Delete:** Click the trash icon (confirmation required)
- **Manage Actions:** Edit a challenge > scroll to "Actions" section > add/edit/delete actions with name, category, and points

### Resetting Data

There is no in-app "reset" button anymore — entity data lives in Supabase. To reseed a development database, re-run the SQL in `supabase/migrations/` against your Supabase project. The only client-side state is the per-user dashboard layout in `localStorage` under the `dashboardLayout*` keys; clear those in DevTools to get the default layout back.

---

## Coding Standards

All contributors follow [`CODING_GUIDELINES.md`](CODING_GUIDELINES.md) for naming, imports, comments, branch and commit conventions, the tiered file-size policy, and the cohesive comment standard.

---

## Project Structure

```
sp26_team2_greenstepchallenge_admin/
├── README.md                    ← you are here
├── data/                        ← reserved for future DB migrations and seed data
├── docs/                        ← project documentation and backups
├── meetings/                    ← meeting notes and transcripts
└── src/
    └── admin-app/               ← React application
        ├── public/
        ├── src/
        │   ├── components/
        │   │   ├── layout/      ← AdminLayout, Sidebar, TopBar
        │   │   └── shared/      ← Reusable cross-feature widgets, grouped by intent
        │   │       ├── feedback/  ← ConfirmDialog (modal confirmations)
        │   │       ├── data/      ← StatCard, CSVExport, EntityLink
        │   │       ├── preview/   ← MobilePreview (phone-frame challenge preview)
        │   │       └── index.js   ← Barrel re-exports for one-line imports
        │   ├── features/
        │   │   ├── auth/        ← Split for React Fast Refresh:
        │   │   │   ├── AuthContext.jsx       ← AuthProvider component only
        │   │   │   ├── authContextValue.js   ← Raw context object
        │   │   │   ├── useAuth.js            ← Consumer hook
        │   │   │   ├── LoginPage.jsx, AuthCallback.jsx, RequireAuth.jsx
        │   │   ├── dashboard/   ← Customizable drag-and-drop dashboard
        │   │   │   ├── DashboardPage.jsx       ← Thin orchestrator
        │   │   │   ├── DashboardGrid.jsx       ← ResponsiveGridLayout wrapper
        │   │   │   ├── DashboardWidget.jsx     ← Card frame (drag handle + remove)
        │   │   │   ├── WidgetCatalog.jsx       ← Drawer for widget library + presets
        │   │   │   ├── ComparisonMode.jsx      ← Multi-challenge compare orchestrator
        │   │   │   ├── config/                 ← Split dashboard config:
        │   │   │   │   ├── widgets.js             ← Widget registry + categories
        │   │   │   │   ├── layouts.js             ← Auto/preset layout builders
        │   │   │   │   └── index.js               ← Barrel re-exports
        │   │   │   ├── components/             ← DashboardToolbar, widgetRenderer
        │   │   │   ├── components/comparison/  ← Per-chart pieces of ComparisonMode
        │   │   │   ├── hooks/useDashboardLayout.js ← Layout state + localStorage
        │   │   │   ├── hooks/useDashboardStats.js  ← Data load + aggregation pipeline
        │   │   │   ├── hooks/useComparisonData.js  ← Comparison aggregations
        │   │   │   └── widgets/                ← 22 widget components (stat, chart, table)
        │   │   ├── challenges/  ← ChallengesPage, ChallengeForm, ChallengeDetail
        │   │   │   └── components/  ← ChallengesToolbar, ChallengesFilterBar,
        │   │   │                       ChallengesTable, ActionFormDialog,
        │   │   │                       ActionsEditor, ChallengeFieldsSection,
        │   │   │                       ChallengeLeaderboard, ParticipantsTable,
        │   │   │                       ParticipationLog, PresetPicker
        │   │   ├── presets/     ← PresetsPage, PresetForm
        │   │   │   └── components/  ← PresetFieldsSection, PresetActionsEditor
        │   │   ├── groups/      ← GroupsPage, GroupForm, GroupDetail
        │   │   │   └── components/  ← MembersTable, GroupChallengesTable
        │   │   ├── users/       ← UsersPage, UserForm, UserDetail
        │   │   │   └── components/  ← UsersFilterBar, UsersTable,
        │   │   │                       PointsHistoryTable,
        │   │   │                       ParticipationHistoryTable, UserActivityLogList
        │   │   └── reports/     ← ReportsPage (filters + CSV export)
        │   ├── data/
        │   │   ├── api/         ← Per-entity modules (users, challenges, actions,
        │   │   │                   participation, groups, presets, templates,
        │   │   │                   activityLogs, leaderboard, constants, helpers)
        │   │   │                   plus a barrel index.js — components import from `data/api`
        │   │   └── supabase.js  ← Supabase client singleton
        │   ├── lib/
        │   │   ├── constants.js ← Shared color palettes (incl. comparison) + status maps
        │   │   └── permissions.js ← Role-based view/edit rules
        │   ├── App.jsx
        │   └── main.jsx
        ├── .env.example
        ├── eslint.config.js     ← Flat config: imports, max-lines, prettier passthrough
        ├── .prettierrc.json
        ├── package.json
        └── vite.config.js
```

---

## Role Permissions

All logged-in users can see everyone and click any user to view full details. Permissions are centralized in `src/admin-app/src/lib/permissions.js` — change `PERMS` values there to restrict who sees what.

| Feature                     | SuperAdmin | Admin | GeneralUser |
|-----------------------------|:----------:|:-----:|:-----------:|
| View Dashboard + Leaderboard|     ✓      |   ✓   |      ✓      |
| View Challenges             |     ✓      |   ✓   |      ✓      |
| Create/Edit Challenges      |     ✓      |   ✓   |             |
| Manage Actions in Challenge |     ✓      |   ✓   |             |
| Archive/Delete Challenges   |     ✓      |   ✓   |             |
| View/Manage Presets         |     ✓      |   ✓   |             |
| View/Manage Groups          |     ✓      |   ✓   |      ✓ (view only) |
| View Users list + all users |     ✓      |   ✓   |      ✓      |
| View any user detail        |     ✓      |   ✓   |      ✓      |
| View email, role, group, status, points, participation, activity log | ✓ | ✓ | ✓ |
| Create Users                |     ✓      |       |             |
| Edit/Deactivate Users       |     ✓      |   ✓   |             |
| Change user's group         |     ✓      |   ✓   |             |
| View Reports                |     ✓      |   ✓   |      ✓      |
| Export CSV                  |     ✓      |   ✓   |      ✓      |

**Customizing permissions:** Edit `src/admin-app/src/lib/permissions.js`. Each `PERMS` entry sets the minimum role (e.g. `ROLES.ADMIN` to hide from GeneralUser). Set to `ROLES.GENERAL_USER` to allow all.

---

## Data Model

| Entity         | Key Fields                                                  |
|----------------|-------------------------------------------------------------|
| User           | id, name, email, role, status, groupId, createdAt, lastActive |
| Challenge      | id, name, description, category, theme, startDate, endDate, status, createdBy, groupId, participantCount |
| Action         | id, challengeId, name, description, category, points        |
| Participation  | id, userId, challengeId, actionId, completedAt, notes, photoUrl |
| ActivityLog    | id, userId, action, timestamp, details                      |
| Group          | id, name, description, createdAt                            |
| Preset         | id, name, description, category, theme, status, actions[], createdAt |

### Action Categories (from MPCA taxonomy)
General Sustainability, Food, Water, Energy, Transportation, Consumption & Waste

### Data Sources
Mock data was extracted from real MPCA client files (2019 & 2020 Commissioner's Challenge scoring templates, 2022 & 2024 Earth Month trackers, and a sustainability challenge mock draft). The seeded rows now live in Supabase; the original mock JS fixtures under `src/admin-app/src/data/mock/` were removed in v0.7.0 once Supabase became the system of record.

---

## Timeline (from Project Proposal)

| Date       | Milestone                          | Status      |
|------------|-------------------------------------|-------------|
| March 10   | Foundation database and UI          | In Progress |
| March 24   | Feature implementation (event/user) | Pending     |
| March 26   | Feature implementation (report)     | Pending     |
| April 9    | Testing features                    | Pending     |
| April 16   | Polish product                      | Pending     |
| April 28   | Re-test product                     | Pending     |
| May 12     | Final product                       | Pending     |

---

## Version History

### v0.7.2 — Phase 2 Cleanup: Audit Follow-ups (Apr 19, 2026)

Honest follow-up after the Phase 2 self-audit: removes the last "justified" 300+ line file, decomposes the last >300 line page component, and corrects stale README claims. Same umbrella branch / PR #43.

- **`useDashboardStats.js` actually decomposed (393 → 177 lines)** — the previous "splitting would hide the helpers" justification was weak. The 13 pure aggregators (`buildCategoryData`, `buildChallengeSummary`, `buildComparisonData`, `buildStatusBreakdown`, `buildUserGrowth`, `buildGroupPerformance`, `buildCompletionRates`, `buildPointsDistribution`, `buildMostActiveUsers`, `buildRecentActivity`, plus `truncate` / `sumPoints` / `countUsersCreatedThisMonth`) moved to `dashboard/hooks/aggregations.js`. Hook now owns orchestration only; helpers are independently unit-testable.
- **`WidgetCatalog.jsx` decomposed (304 → 88 lines)** — the in-file section dividers (`{/* ── Quick Layout Presets ── */}` etc.) were already extraction markers. Split into `components/catalog/CatalogPresets.jsx` (~39), `CatalogChallengeFilter.jsx` (~120), and `CatalogWidgetList.jsx` (~136). Parent is now a pure orchestrator that composes the four sections + drawer chrome + reset footer.
- **`max-lines` exemption no longer needed** — every source file under `src/admin-app/src/` is now ≤300 lines. The previous in-file justification comment is gone.
- **README correctness pass** — removed "mock authentication" claim (Supabase magic-link auth has shipped), removed the demo-account password table (no longer applicable), removed "Reset Demo Data" instructions (Supabase is the source of truth), removed obsolete "Planned: FastAPI / standalone PostgreSQL / OAuth/JWT" tech-stack table (Supabase covers all three), expanded Quick Start to include the `.env` step, rewrote "Future Goals" to reflect what's actually open (shared schema with Team 1, photos, moderation, code-splitting, tests).

### v0.7.1 — Phase 2 Cleanup: Reorganization and Decomposition (Apr 19, 2026)

Builds on v0.7.0 (PR #43, same umbrella branch). Behavior unchanged; the goal was to push past "comments only" into structural cleanup the team had flagged in code review.

- **Auth context decomposed for React Fast Refresh** — `AuthContext.jsx` was exporting both the `AuthProvider` component and the `useAuth` hook, which broke HMR. Split into three files:
  - `authContextValue.js` — raw `createContext` object only.
  - `useAuth.js` — consumer hook only.
  - `AuthContext.jsx` — `AuthProvider` component only, with `login`/`devLogin`/`logout`/`hasRole` wrapped in `useCallback` and a properly-keyed `useMemo` value.
  All 11 import sites were updated to `from "../auth/useAuth"`.
- **`ComparisonMode` decomposed (391 → 83 lines)** — extracted four chart components (`RelativeEngagementChart`, `CategoryBreakdownChart`, `TotalsBarChart`, `AverageActionsChart`) plus `ComparisonSummaryTable`, the shared `ComparisonCard` wrapper, and a `useComparisonData` hook that owns all the aggregation. Color palettes consolidated into `lib/constants.js` as `COMPARISON_COLORS` / `COMPARISON_AVG_COLORS`.
- **`ChallengesPage` decomposed (322 → 170 lines)** — extracted `ChallengesToolbar`, `ChallengesFilterBar`, `ChallengesTable`; `load` wrapped in `useCallback`.
- **`PresetForm` decomposed (309 → 108 lines)** — extracted `PresetFieldsSection` and `PresetActionsEditor`. The duplicated add/edit dialog markup in `PresetForm` and `ActionsEditor` was lifted into a shared `ActionFormDialog`, which both now consume.
- **Dashboard config split** — the >300-line `dashboardConfig.js` became `config/widgets.js` (registry, categories, defaults) + `config/layouts.js` (auto/preset/responsive layout builders), with a barrel `config/index.js` so import paths stayed `from "../config"`. ESLint's `max-lines` override now points at `config/widgets.js` (declarative data).
- **Shared components reorganized** — flat `components/shared/*` is now grouped by intent: `feedback/` (ConfirmDialog), `data/` (StatCard, CSVExport, EntityLink, including the previously-loose `EntityLink`), `preview/` (MobilePreview). Each subfolder has a barrel `index.js`, plus a top-level `components/shared/index.js`. All 18 import sites were updated.
- **Cohesive comments — completion pass** — every `.js` / `.jsx` source file in `src/` now has a `@file` + `@summary` docblock. Layout, dashboard widgets, hooks, untouched feature pages, root files (`main.jsx`, `App.jsx`), and the Supabase client all received headers. (Verified by lint and a script: 0 files missing.)
- **`ReportsPage` `useMemo` deps fixed** — `userName` / `challengeName` / `actionName` / `actionCategory` are now `useCallback`s with proper deps; `tableData` and `chartData` memos updated to depend on them so they don't go stale on a fresh `users` / `challenges` / `actions` reload.
- **Lint + format clean** — `npm run lint` / `npm run format:check` / `npm run build` all pass; the only remaining warning is the intentional, justified `max-lines` warning on `useDashboardStats.js` (kept cohesive on purpose; covered in its file-header docblock).

### v0.7.0 — Code Cleanup and Refactor (Apr 19, 2026)

Closes #42 (Code Cleanup and Refactor). Behavior unchanged; the goal was to make the codebase easy for the team to extend. Landed as ten stacked PRs into a single umbrella branch.

- **Coding standards restored** — `CODING_GUIDELINES.md` is the single source of truth for naming, imports, comments, branch + commit conventions, the tiered file-size policy (≤300 fine / 301–500 with justification / >500 hard ceiling), and the cohesive comment standard. README now links to it.
- **Tooling baseline** — Prettier added (`.prettierrc.json`, `.prettierignore`, `format` / `format:check` scripts); ESLint tightened with `eslint-plugin-import` (5-group import order), `eslint-config-prettier`, `max-lines` (warn 300 / error 500), `no-console: warn`. New scripts: `lint:fix`, `format`, `format:check`.
- **Data layer modularized** — the 426-line `data/api.js` was split into per-entity modules under `data/api/`: `users`, `challenges`, `actions`, `participation`, `groups`, `presets`, `templates`, `activityLogs`, `leaderboard`, plus `constants` and `helpers`. A barrel `index.js` keeps every existing import (`from "../../data/api"`) working.
- **Page decomposition** (six features, six PRs):
  - `DashboardPage.jsx`: 509 → 178 lines. Extracted `useDashboardStats` (data load + aggregation pipeline), `DashboardToolbar`, and `widgetRenderer`.
  - `ChallengeForm.jsx`: 491 → 182 lines. Extracted `PresetPicker`, `ChallengeFieldsSection`, `ActionsEditor`.
  - `ChallengeDetail.jsx`: 402 → 268 lines. Extracted `ParticipantsTable`, `ChallengeLeaderboard`, `ParticipationLog`.
  - `GroupDetail.jsx`: 355 → 275 lines. Extracted `MembersTable`, `GroupChallengesTable`.
  - `UsersPage.jsx`: 307 → 209 lines. Extracted `UsersFilterBar`, `UsersTable`.
  - `UserDetail.jsx`: 446 → 242 lines. Extracted `PointsHistoryTable`, `ParticipationHistoryTable`, `UserActivityLogList`.
- **Cohesive comments pass** — every `data/api/*` module, both dashboard hooks, and `lib/constants.js` got file-header docblocks and JSDoc on exports; narration-only comments removed in favor of "why-not-what" intent comments.
- **Dead code removal** — deleted the unused `src/data/mock/` fixtures (Supabase has been the data source since v0.6.x); migrated remaining call-sites from the deprecated `CATEGORIES` alias to `ACTIONS`; removed the alias.
- **Bug fixes surfaced by stricter lint** — destructured missing `user` in `ChallengesPage.jsx`, removed an unused local in `ComparisonMode.jsx`, lifted `setIsComparisonModeActive(false)` out of an effect into the toggle/clear handlers in `DashboardPage.jsx`.

### v0.6.1 — Responsive Dashboard Optimization (Mar 24, 2026)
- **Full responsive testing** — headless browser testing across 9 viewport sizes: desktop (1920, 1440, 1280), tablet landscape (1024), tablet portrait (768), and mobile (430, 390, 375, 360)
- **Compact stat cards** — reduced from h=3 to h=2 across all breakpoints, saving ~33% vertical space; stat cards now show 4-across on desktop, 2-per-row on tablet/mobile (previously stacked 1-per-row on mobile, wasting entire screen on just numbers)
- **Explicit responsive layouts** — `autoLayout` helper generates breakpoint-specific layouts for all 5 breakpoints (lg/md/sm/xs/xxs) instead of relying on auto-generation; stats always 2-per-row on small screens, charts/tables go full-width
- **Per-breakpoint grid margins** — margins reduce from 16px (desktop) → 14/12/10/8px (smaller screens) to preserve content space on mobile
- **Compact widget chrome** — smaller title bar height, reduced padding, and responsive font sizes via MUI breakpoint system; fonts scale from 0.7rem (mobile) to 0.8rem (desktop) for titles
- **Preset layouts are now responsive** — all 4 presets (Default, Executive, Analytics, Compact) auto-generate mobile-friendly layouts via `buildResponsiveLayouts`

### v0.6.0 — Customizable Dashboard with Drag-and-Drop Widgets (Mar 24, 2026)
- **Drag-and-drop dashboard** — powered by `react-grid-layout` v2; every dashboard section is now an independent widget that can be rearranged and resized on a responsive 12-column grid
- **22 available widgets** across 3 categories:
  - **Overview Stats (8):** Active Challenges, Total Actions Taken, Active Users, Total Points Earned, Completion Rate, Avg Points Per User, New Users This Month, Top Category
  - **Charts (9):** Actions by Category (pie), Participation by Challenge (bar), Monthly Engagement Trend (line), Challenge Status Breakdown (donut), Points by Challenge (bar), User Registration Timeline (area), Group Performance (bar), Challenge Completion Rates (horizontal bar), Points Distribution (histogram)
  - **Tables & Lists (5):** Challenge Summary, Global Leaderboard, Most Active Users, Recent Activity Feed, Upcoming Challenges
- **Edit mode** — click "Customize" to toggle edit mode; widgets show grip handles and dashed borders; drag title bars to reorder, resize from bottom-right corner; "Save" persists to localStorage, "Cancel" reverts changes
- **Widget Library drawer** — slide-out panel to search, browse by category (with active counts), and toggle any of the 22 widgets on/off with one click
- **Quick Layout Presets** — 4 built-in presets (Default, Executive Summary, Analytics Deep Dive, Compact Overview) that set both widget visibility and arrangement; one click to apply, then customize further
- **HCI principles** — visibility (edit badge, instruction banner), affordance (grab cursors, resize handles, toggle switches), feedback (snackbar confirmations on save/reset/preset), error prevention (can't remove all widgets, cancel button restores previous state, reset to default always available), recognition over recall (widget descriptions in catalog), consistency (unified card-frame design)
- **Widget component architecture** — each widget is a self-contained component under `features/dashboard/widgets/`; data loading centralized in `DashboardPage`; layout state managed by `useDashboardLayout` hook; configuration in `dashboardConfig.js`

### v0.5.2 — Clickable Entity Links & Dynamic Back Navigation (Mar 8, 2026)
- **EntityLink component** — new reusable `<EntityLink>` component renders any entity name (user, challenge, group) as a clickable link that navigates to its detail page; handles missing IDs gracefully and uses `stopPropagation` for proper behavior inside clickable table rows
- **Dynamic back buttons** — all 8 back buttons across detail and form pages now use browser history (`navigate(-1)`) instead of hardcoded paths, so clicking "Back" always returns to the previous page regardless of how you got there
- **Dashboard links** — challenge names in Challenge Summary table, user names in Global Leaderboard, and user names in Most Active Users table are now clickable
- **ChallengeDetail links** — user names in Leaderboard cards and Participation Log table are now clickable
- **UsersPage links** — group name column is now a clickable link to the group detail page
- **ReportsPage links** — User and Challenge columns in the results table are now clickable links to their respective detail pages

### v0.5.1 — Codebase Cleanup (Mar 8, 2026)
- **Renamed "Event" → "Challenge"** throughout the entire data layer — mock files, API functions, and all feature components now use consistent `challenge`/`challengeId` terminology
- Added `'General Sustainability'` to the `CATEGORIES` array (5 of 6 challenges use it)
- Added loading spinners (`CircularProgress`) to all list and detail pages
- Added error handling (`try/catch` + `Alert`) to all pages with API calls
- Added accessibility improvements: `aria-label` on navigation, menus, dialogs, and export buttons; `aria-current="page"` on active nav items; semantic `<main>` wrapper
- Extracted shared color constants into `lib/constants.js` (chart colors, medal colors, status color map)
- Standardized responsive page title sizing across all form pages
- Fixed MUI Grid v7 API consistency (removed deprecated `item` prop usage)
- Presets now use `CHALLENGE_STATUSES.UPCOMING` constant instead of string literal
- Removed unused API functions (`getParticipantCountByEvent`, `getActivityLogs`)
- Updated `package.json` version to `0.5.0`
- Added `meta description` and `theme-color` to `index.html`
- Added `.env.example` for future backend configuration
- Improved all sub-folder READMEs with useful descriptions
- Updated root `.gitignore` with comprehensive patterns
- Data version bumped to v4 (old localStorage data auto-reset)

### v0.5.0 — Challenge Presets (Mar 8, 2026)
- **Presets page** — list, create, edit, delete reusable challenge templates (Admin/SuperAdmin only)
- **Preset actions** — each preset stores action templates (name, description, category, points) that are auto-created on challenge creation
- **ChallengeForm integration** — "Quick Start" dropdown dynamically loads presets from the store; selecting a preset pre-fills form fields and shows an actions preview table; on submit, actions are bulk-created
- 3 seed presets: H2O Hero Week (5 water actions), Power Down Challenge (4 energy actions), Sustainable Commute Week (5 transportation actions)
- "Manage Presets" button on the Challenges page (Admin/SuperAdmin only)
- Back buttons added to all detail and form pages for consistent navigation
- Data version bumped to v3 (old localStorage data auto-reset)

### v0.4.0 — Group & Challenge Management (Mar 7, 2026)
- **Group Detail page** — view group info, members table with add/remove, challenges in group; Edit/Delete buttons
- **Groups** — clickable group name → Group Detail; Members count → Users filtered by group; Challenges count → Challenges filtered by group
- **Challenges** — clickable name → Challenge Detail; clickable Group → Group Detail; clickable Participants count → Challenge Detail; URL filter `?groupId=X`
- **Challenge Detail** — Participants table (users who completed actions with points); clickable Group link
- **User Detail** — Change Group dropdown for Admin/SuperAdmin; clickable group/challenge links in participation and points tables
- Participant counts now derived from participation data

### v0.3.0 — Real Client Data Integration (Mar 5, 2026)
- Replaced fabricated mock data with data extracted from actual MPCA client files
- Challenges now reflect real programs: 2019 & 2020 Commissioner's Challenges, 2022 & 2024 Earth Month Challenges, plus upcoming 2026
- Actions derived from real MPCA scoring templates (weighted points, tiered difficulty levels, daily yes/no tracking)
- Participation data includes real tracker entries from 2024 participant "Carla" mapped to the app format
- Expanded user pool (12 users) with realistic MPCA personas spanning challenge years
- Activity categories updated to match MPCA taxonomy: Food, Water, Energy, Transportation, Consumption & Waste

### v0.2.0 — Feature Additions (Mar 5, 2026)
- Renamed "Events" to "Challenges" throughout the UI
- Added Action CRUD (add/edit/delete actions within each challenge)
- Added full Group management (create, edit, delete groups; assign users and challenges to groups; filter by group)
- Added dual point system: **Global Points** (cumulative across all challenges) and **Challenge Points** (per-challenge history with earned/max/progress)
- Global Leaderboard on Dashboard; per-challenge leaderboard on each Challenge Detail page; per-user points history table on User Detail page
- Added localStorage persistence (changes survive page refresh)
- Added "Reset Demo Data" button on login page

### v0.1.0 — Foundation UI (Mar 5, 2026)
- Initial scaffold with Vite + React + MUI
- Login, Dashboard, Event Management, User Management, Reports
- Role-based access control (SuperAdmin, Admin, GeneralUser)
- CSV export on all data tables
- Mock data layer with async API abstraction

---

## Future Goals

1. Coordinate the shared Supabase schema with Team 1's user-facing mobile app
2. Photo upload support for user-submitted content (Supabase Storage)
3. Content moderation tools (flag/remove comments and photos)
4. Advanced reporting with saved report templates
5. Push notification integration for challenge reminders
6. Persist per-user dashboard layouts to Supabase instead of `localStorage`
7. Route-level code-splitting (`React.lazy` + `Suspense`) to bring the production bundle below the 500 KB warning threshold
8. Test suite — start with unit tests for `data/api/*` modules and `dashboard/hooks/aggregations.js`

---

## Client Requirements (from meetings)

Key requirements from Kristin Mroz-Risse (MPCA):

1. Admins can change content (themes, actions, text) without programming skills
2. Support multiple simultaneous groups/challenges with different themes
3. Download participation data as CSV with clear headers for analysis
4. User management with role tiers and ability to deactivate bad actors
5. Track trends over time (which actions are popular, category breakdowns)
6. Mobile-friendly — usable on phones during breaks/commutes
7. Share impact data with leadership (e.g., "900 actions taken, 12% in transportation")
