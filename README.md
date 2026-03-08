# GreenStep Sustainability Challenge - Admin Console

Administrative management console for Minnesota GreenStep Cities, enabling staff to create and manage sustainability challenges, oversee user participation, and generate data-driven reports.

**Team:** Khue Vo, Rudy Vergara, Eli Goldberger, Josh Dunlap  
**Client:** Kristin Mroz-Risse, Minnesota Pollution Control Agency (MPCA)  
**Semester:** Spring 2026

---

## Project Overview

This is the **admin-side** application for the GreenStep Sustainability Challenge. A separate team (Team 1) is building the user-facing mobile app. Both teams share a common database (coordination in progress).

### Current Version: v0.5.0 — Challenge Presets

**Status:** Frontend MVP with mock data + localStorage persistence. No backend or database connected yet.

### What's Built

- **Login page** with mock authentication (email/password) and Reset Demo Data button
- **Role-based access control** — SuperAdmin, Admin, GeneralUser with route guards
- **Dashboard** — 4 key metric cards, participation bar chart, category pie chart, monthly trend line chart, Challenge Summary table (with per-challenge points earned), and **Global Leaderboard** (ranked by cumulative points across all challenges)
- **Challenge Management** (renamed from "Events") — list with search/filter by status and group (URL support for groupId), create/edit forms, detail view with **Participants** table (who completed actions), participation log, clickable group link, archive/delete, CSV export
- **Action CRUD** — admins can add, edit, and delete actions within each challenge (name, description, category, points)
- **Group Management** — full CRUD for flexible groups; **Group Detail** page with member list (add/remove), challenges in group, bidirectional links; clickable member/challenge counts on list
- **User Management** — list with search/filter by role and group, create/edit forms with group assignment, detail view with **Change Group** dropdown (Admin/SuperAdmin), clickable group and challenge links, activity log, participation history, **global points** total, and **per-challenge points history** table (earned vs max with progress bars), activate/deactivate, CSV export
- **Challenge Presets** — reusable templates with pre-configured actions; create, edit, delete presets from a dedicated page; applying a preset when creating a new challenge pre-fills form fields and automatically creates all template actions; 3 seed presets (H2O Hero Week, Power Down Challenge, Sustainable Commute Week)
- **Reports** — filter by challenge and date range, category breakdown chart, full participation table, CSV export
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

## Project Structure

```
sp26_team2_greenstepchallenge_admin/
├── README.md                    ← you are here
├── docs/                        ← project documentation
├── meetings/                    ← meeting notes and transcripts
└── src/
    └── admin-app/               ← React application
        ├── public/
        ├── src/
        │   ├── components/
        │   │   ├── layout/      ← Sidebar, TopBar, AdminLayout
        │   │   └── shared/      ← CSVExport, ConfirmDialog, StatCard
        │   ├── features/
        │   │   ├── auth/        ← AuthContext, LoginPage, RequireAuth
        │   │   ├── dashboard/   ← DashboardPage (analytics + leaderboard)
        │   │   ├── challenges/  ← ChallengesPage, ChallengeForm, ChallengeDetail
        │   │   ├── presets/     ← PresetsPage, PresetForm (challenge templates)
        │   │   ├── groups/      ← GroupsPage, GroupForm
        │   │   ├── users/       ← UsersPage, UserForm, UserDetail
        │   │   └── reports/     ← ReportsPage (filters + CSV export)
        │   ├── data/
        │   │   ├── mock/        ← Fake data fixtures (users, events, actions, participation, groups, activityLogs, presets)
        │   │   └── api.js       ← API abstraction layer (localStorage-backed)
        │   ├── hooks/
        │   ├── lib/          ← permissions.js (role-based view/edit rules)
        │   ├── App.jsx
        │   └── main.jsx
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
| Event (Challenge) | id, name, description, category, theme, startDate, endDate, status, createdBy, groupId, participantCount |
| Action         | id, eventId, name, description, category, points            |
| Participation  | id, userId, eventId, actionId, completedAt, notes, photoUrl |
| ActivityLog    | id, userId, action, timestamp, details                      |
| Group          | id, name, description, createdAt                            |
| Preset         | id, name, description, category, theme, status, actions[], createdAt |

### Action Categories (from MPCA taxonomy)
Food, Water, Energy, Transportation, Consumption & Waste

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
