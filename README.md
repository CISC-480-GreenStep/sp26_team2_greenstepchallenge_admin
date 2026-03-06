# GreenStep Sustainability Challenge - Admin Console

Administrative management console for Minnesota GreenStep Cities, enabling staff to create and manage sustainability challenges, oversee user participation, and generate data-driven reports.

**Team:** Khue Vo, Rudy Vergara, Eli Goldberger, Josh Dunlap  
**Client:** Kristin Mroz-Risse, Minnesota Pollution Control Agency (MPCA)  
**Semester:** Spring 2026

---

## Project Overview

This is the **admin-side** application for the GreenStep Sustainability Challenge. A separate team (Team 1) is building the user-facing mobile app. Both teams share a common database (coordination in progress).

### Current Version: v0.2.0 — Feature-Complete UI

**Status:** Frontend MVP with mock data + localStorage persistence. No backend or database connected yet.

### What's Built

- **Login page** with mock authentication (email/password) and Reset Demo Data button
- **Role-based access control** — SuperAdmin, Admin, GeneralUser with route guards
- **Dashboard** — 4 key metric cards, participation bar chart, category pie chart, monthly trend line chart, Challenge Summary table (with per-challenge points earned), and **Global Leaderboard** (ranked by cumulative points across all challenges)
- **Challenge Management** (renamed from "Events") — list with search/filter by status and group, create/edit forms, detail view with participation log, archive/delete, CSV export
- **Action CRUD** — admins can add, edit, and delete actions within each challenge (name, description, category, points)
- **Group Management** — full CRUD for flexible groups (e.g., "MPCA Staff", "April 2026 Cohort"), with member and challenge counts; group filter on Challenges and Users pages
- **User Management** — list with search/filter by role and group, create/edit forms with group assignment, detail view with activity log, participation history, **global points** total, and **per-challenge points history** table (earned vs max with progress bars), activate/deactivate, CSV export
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
| Data       | Mock data + localStorage           |

### Planned (not yet implemented)

| Layer    | Technology          |
|----------|---------------------|
| Backend  | Python (FastAPI)    |
| Database | PostgreSQL          |
| Auth     | TBD (OAuth/JWT)     |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Install and Run

```bash
cd src/admin-app
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

### Demo Accounts

| Email                           | Password | Role        |
|---------------------------------|----------|-------------|
| kristin.mroz@mpca.mn.gov       | admin    | SuperAdmin  |
| sarah.johnson@mpca.mn.gov     | user     | GeneralUser |

### Reset Demo Data

Click the "Reset Demo Data" button on the login page to clear all localStorage changes and restore the original sample data.

---

## Project Structure

```
sp26_team2_greenstepchallenge_admin/
├── README.md                    ← you are here
├── data/                        ← sample data files (from client)
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
        │   │   ├── groups/      ← GroupsPage, GroupForm
        │   │   ├── users/       ← UsersPage, UserForm, UserDetail
        │   │   └── reports/     ← ReportsPage (filters + CSV export)
        │   ├── data/
        │   │   ├── mock/        ← Fake data fixtures (users, events, actions, participation, groups, activityLogs)
        │   │   └── api.js       ← API abstraction layer (localStorage-backed)
        │   ├── hooks/
        │   ├── lib/
        │   ├── App.jsx
        │   └── main.jsx
        ├── package.json
        └── vite.config.js
```

---

## Role Permissions

| Feature                     | SuperAdmin | Admin | GeneralUser |
|-----------------------------|:----------:|:-----:|:-----------:|
| View Dashboard + Leaderboard|     ✓      |   ✓   |      ✓      |
| View Challenges             |     ✓      |   ✓   |      ✓      |
| Create/Edit Challenges      |     ✓      |   ✓   |             |
| Manage Actions in Challenge |     ✓      |   ✓   |             |
| Archive/Delete Challenges   |     ✓      |   ✓   |             |
| View/Manage Groups          |     ✓      |   ✓   |      ✓ (view only) |
| View Users                  |     ✓      |   ✓   |      ✓      |
| Create Users                |     ✓      |       |             |
| Edit/Deactivate Users       |     ✓      |   ✓   |             |
| View Reports                |     ✓      |   ✓   |      ✓      |
| Export CSV                  |     ✓      |   ✓   |      ✓      |

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
