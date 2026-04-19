# GreenStep Sustainability Challenge - Admin Console

Administrative management console for Minnesota GreenStep Cities, enabling staff to create and manage sustainability challenges, oversee user participation, and generate data-driven reports.

**Team:** Khue Vo, Rudy Vergara, Eli Goldberger, Josh Dunlap  
**Client:** Kristin Mroz-Risse, Minnesota Pollution Control Agency (MPCA)  
**Semester:** Spring 2026

---

## Project Overview

This is the **admin-side** application for the GreenStep Sustainability Challenge. A separate team (Team 1) is building the user-facing mobile app. Both teams share a common database (coordination in progress).

### Current Version: v0.6.1 — Responsive Dashboard Optimization

**Status:** Frontend MVP with mock data + localStorage persistence. No backend or database connected yet.

### What's Built

- **Login page** with mock authentication (email/password) and Reset Demo Data button
- **Role-based access control** — SuperAdmin, Admin, GeneralUser with route guards
- **Customizable Dashboard** — 22 available widgets (8 stat cards, 9 charts, 5 tables/lists) arranged in a drag-and-drop grid; click **Customize** to enter edit mode where widgets can be rearranged by dragging and resized from corners; **Widget Library** drawer lets you toggle any widget on/off and apply **Quick Layout Presets** (Default, Executive Summary, Analytics Deep Dive, Compact Overview); layout persists to localStorage per user; HCI-informed design with affordance cues (grip handles, dashed borders in edit mode), feedback (snackbar confirmations), error prevention (can't remove all widgets, cancel/reset available), and progressive disclosure (edit controls only appear when customizing)
- **Challenge Management** (renamed from "Events") — list with search/filter by status and group (URL support for groupId), create/edit forms, detail view with **Participants** table (who completed actions), participation log, clickable group link, archive/delete, CSV export
- **Action CRUD** — admins can add, edit, and delete actions within each challenge (name, description, category, points)
- **Group Management** — full CRUD for flexible groups; **Group Detail** page with member list (add/remove), challenges in group, bidirectional links; clickable member/challenge counts on list
- **User Management** — list with search/filter by role and group, create/edit forms with group assignment, detail view with **Change Group** dropdown (Admin/SuperAdmin), clickable group and challenge links, activity log, participation history, **global points** total, and **per-challenge points history** table (earned vs max with progress bars), activate/deactivate, CSV export
- **Challenge Presets** — reusable templates with pre-configured actions; create, edit, delete presets from a dedicated page; applying a preset when creating a new challenge pre-fills form fields and automatically creates all template actions; 3 seed presets (H2O Hero Week, Power Down Challenge, Sustainable Commute Week)
- **Reports** — filter by challenge and date range, category breakdown chart, full participation table with clickable user/challenge links, CSV export
- **Responsive layout** — collapsible sidebar on mobile, responsive tables and forms
- **localStorage persistence** — all changes survive page refresh; "Reset Demo Data" button restores defaults

### What's NOT Built Yet

- Real authentication (OAuth, JWT, etc.)
- Python backend (Flask/FastAPI)
- PostgreSQL database
- Integration with Team 1's user-facing app
- Photo uploads and content moderation
- Advanced analytics and BI features

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
| Data       | Mock data (from real MPCA files) + localStorage |

### Planned (not yet implemented)

| Layer    | Technology          |
|----------|---------------------|
| Backend  | Python (FastAPI)    |
| Database | PostgreSQL          |
| Auth     | TBD (OAuth/JWT)     |

---

## Getting Started

### Quick Start (3 steps)

1. Make sure you have [Node.js](https://nodejs.org/) 18 or newer installed (`node -v` to check)
2. Open a terminal and run:

```bash
cd src/admin-app
npm install
npm run dev
```

3. Open **http://localhost:5173** in your browser

That's it — the app runs entirely in the browser with mock data, no backend or database needed.

### Logging In

Click **"Quick Login as Kristin (SuperAdmin)"** on the login page to sign in instantly.

Or use one of the demo accounts:

| Email                           | Password | Role        |
|---------------------------------|----------|-------------|
| kristin.mroz@mpca.mn.gov       | admin    | SuperAdmin  |
| sarah.johnson@mpca.mn.gov     | user     | GeneralUser |

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

### Reset Demo Data

Click the **"Reset Demo Data"** button on the login page to clear all changes and restore the original sample data. All data is stored in your browser's localStorage.

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
        │   │   ├── layout/      ← Sidebar, TopBar, AdminLayout
        │   │   ├── shared/      ← CSVExport, ConfirmDialog, StatCard
        │   │   ├── EntityLink.jsx     ← Reusable clickable entity link (user/challenge/group)
        │   │   └── MobilePreview.jsx  ← Phone-frame challenge preview
        │   ├── features/
        │   │   ├── auth/        ← AuthContext, LoginPage, RequireAuth
        │   │   ├── dashboard/   ← Customizable drag-and-drop dashboard
        │   │   │   ├── DashboardPage.jsx    ← Data loading, edit mode, widget renderer
        │   │   │   ├── DashboardGrid.jsx    ← ResponsiveGridLayout wrapper
        │   │   │   ├── DashboardWidget.jsx  ← Card frame with drag handle + remove
        │   │   │   ├── WidgetCatalog.jsx    ← Drawer for widget library + presets
        │   │   │   ├── dashboardConfig.js   ← Widget registry, layouts, presets
        │   │   │   ├── hooks/useDashboardLayout.js ← Layout state + localStorage
        │   │   │   └── widgets/             ← 15 widget components (stat, chart, table)
        │   │   ├── challenges/  ← ChallengesPage, ChallengeForm, ChallengeDetail
        │   │   ├── presets/     ← PresetsPage, PresetForm (challenge templates)
        │   │   ├── groups/      ← GroupsPage, GroupForm, GroupDetail
        │   │   ├── users/       ← UsersPage, UserForm, UserDetail
        │   │   └── reports/     ← ReportsPage (filters + CSV export)
        │   ├── data/
        │   │   ├── mock/        ← Fake data fixtures (challenges, users, actions, participation, groups, activityLogs, presets)
        │   │   └── api.js       ← API abstraction layer (localStorage-backed)
        │   ├── lib/
        │   │   ├── constants.js ← Shared color palettes and status mappings
        │   │   └── permissions.js ← Role-based view/edit rules
        │   ├── App.jsx
        │   └── main.jsx
        ├── .env.example
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
Mock data was extracted from real MPCA client files (2019 & 2020 Commissioner's Challenge scoring templates, 2022 & 2024 Earth Month trackers, and a sustainability challenge mock draft). The original files have been removed from the repo since all relevant data is now embedded in the JavaScript mock files under `src/admin-app/src/data/mock/`.

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

1. Connect to Python (FastAPI) backend with PostgreSQL
2. Real authentication with OAuth/JWT
3. Coordinate shared database schema with Team 1
4. Photo upload support for user-submitted content
5. Content moderation tools (flag/remove comments and photos)
6. Advanced reporting with saved report templates
7. Push notification integration for challenge reminders
8. Save dashboard layouts per-user in the database (currently localStorage only)

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
