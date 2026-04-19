# GreenStep Challenge Admin -- Coding Guidelines

**Team 2 | CISC 480 | Spring 2026**

---

## 1. Industry Standards Adopted

### Airbnb JavaScript Style Guide
**Citation:** [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

We adopt the Airbnb style guide as our baseline for JavaScript and React conventions. This is the most widely used JS style guide in the industry and aligns well with our React + MUI stack. We customize the following:

- **Quotes:** We use double quotes (`"`) instead of Airbnb's single quotes, for consistency with JSX attribute conventions.
- **Semicolons:** Always required (consistent with Airbnb).
- **Trailing commas:** Used in multiline expressions (consistent with Airbnb).

### React Official Documentation
**Citation:** [React Documentation](https://react.dev)

We follow React's recommended patterns: functional components with hooks, composition over inheritance, and lifting state up when needed.

### Material-UI (MUI) Component Library
**Citation:** [MUI Documentation](https://mui.com/material-ui/getting-started/)

All styling uses the MUI `sx` prop and theme system. No raw CSS files, CSS modules, or styled-components.

---

## 2. Quick-Reference Checklist

### Formatting

- [ ] 2-space indentation (no tabs)
- [ ] Semicolons at the end of every statement
- [ ] Double quotes for all strings and imports
- [ ] Trailing commas in multiline objects, arrays, and imports
- [ ] No lines longer than 120 characters
- [ ] One blank line between logical sections of code

### Naming

- [ ] **Files:** PascalCase for components (`UserForm.jsx`), camelCase for utilities (`permissions.js`)
- [ ] **Folders:** kebab-case (`admin-app`, `challenge-actions`)
- [ ] **Components:** PascalCase (`StatCard`, `ConfirmDialog`)
- [ ] **Functions/variables:** camelCase (`handleSubmit`, `isLoading`)
- [ ] **Constants:** SCREAMING_SNAKE_CASE (`ROLES`, `DRAWER_WIDTH`, `CHALLENGE_STATUSES`)
- [ ] **Boolean variables:** prefix with `is`, `can`, `has`, or `show` (`isEdit`, `canManage`, `showEmail`)
- [ ] **Event handlers:** prefix with `handle` (`handleSubmit`, `handleToggleStatus`)

### Component Structure

- [ ] Functional components only (no class components)
- [ ] Default exports for all components (`export default function MyComponent()`)
- [ ] Named exports for utility functions and constants
- [ ] Destructure props in function signature
- [ ] Respect the tiered file-size policy (see Section 3 below)

### Import Order

Imports must follow this order, with a blank line between each group:

1. React and React hooks
2. React Router
3. Third-party libraries (MUI components, MUI icons, etc.)
4. Internal data/API imports
5. Internal components and utilities

```jsx
// 1. React
import { useEffect, useState } from "react";

// 2. React Router
import { useNavigate, useParams } from "react-router-dom";

// 3. Third-party
import {
  Box, Typography, Button, TextField, MenuItem, Stack, Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// 4. Internal data
import { getUsers, createUser, ROLES } from "../../data/api";

// 5. Internal components/utils
import { useAuth } from "../auth/useAuth";
import { ConfirmDialog } from "../../components/shared/feedback";
```

> Note (post-v0.7.1): `useAuth` lives in its own file (not `AuthContext.jsx`) to keep React Fast Refresh happy, and shared components are grouped by intent under `components/shared/{feedback,data,preview}` with barrel exports.

### Styling

- [ ] Use MUI `sx` prop for all styling -- no inline `style` attributes
- [ ] Use theme tokens over hardcoded colors (`"primary.main"` not `"#2E7D32"`)
- [ ] Use MUI responsive breakpoints (`{ xs: 12, sm: 6 }`) for layout
- [ ] No separate `.css` or `.scss` files for components

### State Management

- [ ] React Context for global state (auth, theme)
- [ ] `useState` for local component state
- [ ] `useMemo` for expensive derived values
- [ ] No Redux or external state libraries

### API & Data Layer

- [ ] All database operations go through `src/data/api.js`
- [ ] Components never import `supabase` directly
- [ ] Use `try/catch` around API calls in components
- [ ] Display errors with MUI `<Alert>` components
- [ ] Show `<CircularProgress>` while loading data

### Error Handling

- [ ] Wrap async operations in `try/catch`
- [ ] Store error messages in state: `const [error, setError] = useState("")`
- [ ] Clear errors before retrying: `setError("")` at start of handler
- [ ] Use `<ConfirmDialog>` before any destructive action (deactivate, archive, delete)

### Comments

See Section 3 ("Cohesive Comment Standard") for the full rules. Quick checklist:

- [ ] File-header docblock at the top of every non-trivial file
- [ ] JSDoc on every exported function in `data/api/*`, `lib/*`, and custom hooks
- [ ] Comments explain **why**, not **what**
- [ ] `/** @deprecated <use what instead> */` tag on deprecated exports
- [ ] Section dividers (`// --- Section Name ---`) only when a file has 3+ logical sections
- [ ] `TODO` lines reference an issue: `// TODO(#42): ...`
- [ ] No commented-out code in committed files
- [ ] No emoji in code comments

### Accessibility

- [ ] Use semantic HTML elements (`<form>`, `<nav>`, `<main>`)
- [ ] Add `aria-label` to icon-only buttons
- [ ] Use MUI's built-in accessibility features (Chip, Alert, Dialog)
- [ ] Keyboard-navigable interactive elements

---

## 3. File-Size Policy & Cohesive Comment Standard

### Tiered file-size policy

Cohesion beats line count. A 320-line file with one tight responsibility is better than three artificial 110-line splits.

| Range | Status | Action required |
|-------|--------|-----------------|
| ≤ 300 lines | Fine | None |
| 301–500 lines | Allowed when splitting would hurt readability (cohesive form, registry/config object that *is* the data, switch/router with many small cases) | PR description must justify |
| > 500 lines | Hard ceiling | Add `/* eslint-disable max-lines */` plus a top-of-file comment naming the reason and linking a follow-up issue |

**Exemptions (no cap):** auto-generated files, mock fixtures, configuration registries (e.g., `features/dashboard/config/widgets.js`). The exemption is granted in `eslint.config.js` so it stays explicit and reviewable.

Enforced by ESLint `max-lines` (`warn` at 300, `error` at 500).

### Cohesive Comment Standard

Every PR must leave touched files comment-clean to this standard. Reviewers reject PRs that fail any of these.

#### File-header docblock

Every non-trivial file starts with a JSDoc block that names the module and explains **what it owns** and **how it fits in**:

```js
/**
 * UsersPage -- admin list view for users.
 *
 * Loads users via data/api/users, supports search/filter by role and group,
 * and links to UserDetail / UserForm. Permission gates use lib/permissions.
 */
```

#### JSDoc on exported functions

Every exported function in `data/api/*`, `lib/*`, and any custom hook gets `@param`, `@returns`, and `@throws` when relevant:

```js
/**
 * Update a user's role.
 *
 * @param {string} id   User id.
 * @param {"SuperAdmin"|"Admin"|"GeneralUser"} role
 * @returns {Promise<User>} The updated user row.
 * @throws  When the Supabase update fails.
 */
export async function updateUserRole(id, role) { ... }
```

#### Section dividers

Use `// --- Section name ---` only when a file has **3+ logical sections**. Never as decoration.

#### Inline comments explain *why*, not *what*

Banned phrasings (rejected at review):

```js
// Increment the counter
// Define the function
// Loop over users
// Return the result
// Set state
```

Allowed:

```js
// Refetch on focus because Supabase realtime drops on tab-switch (see #38).
```

#### TODO format

`// TODO(#<issue>): <what>` -- bare `// TODO` without an issue is rejected.

#### Other rules

- No commented-out code in committed files (use git history instead).
- No emoji in code comments (allowed in user-facing strings only).
- Acronyms expanded the first time they appear in a file, e.g. `RBAC (role-based access control)`.
- Deprecations use `/** @deprecated <use what instead> */` and name a planned removal milestone.

---

## 4. Version Control

### Branch Naming

Format: `<type>/<short-description>`

| Type | Use for | Example |
|------|---------|---------|
| `feature/` | New functionality | `feature/auth-magic-links` |
| `fix/` | Bug fixes | `fix/user-deactivation-logic` |
| `chore/` | Maintenance, config, docs | `chore/update-readme` |
| `refactor/` | Code restructuring | `refactor/api-error-handling` |

Rules:
- All lowercase, kebab-case
- Keep under 50 characters
- Branch from `main`, merge back to `main` via PR

### Commit Messages

Format: `<Verb> <description>`

```
Add magic link authentication
Fix challenge form not saving join-by date
Remove deprecated delete user feature
Update README with deployment instructions
```

Rules:
- Start with a capitalized imperative verb (Add, Fix, Remove, Update, Replace, Refactor)
- First line under 72 characters
- No period at the end of the subject line
- If needed, add a blank line then a body explaining **why**
- Never include auto-generated co-author lines

**Good examples from our repo:**
```
Replace user deletion with deactivation-only approach
Add GreenStep favicon
Connect app to Supabase and add deployment config
```

**Bad examples:**
```
fixed stuff                          # vague
Updated the user form component.     # has period, doesn't say what changed
WIP                                  # not descriptive
```

### Pull Requests

- Title: short description under 70 characters
- Body: use the template with Summary (bullet points) and Test Plan
- Assign at least one reviewer
- Squash merge to keep `main` history clean
- Delete branch after merge

### What NOT to Commit

- `.env` files or any file containing secrets
- `.claude/` directory (already in `.gitignore`)
- `node_modules/`
- Build output (`dist/`)
- IDE-specific files (`.vscode/`, `.idea/`)

---

## 5. Project-Specific Rules

### Rule: All data access goes through `data/api`

**Intent:** Single source of truth for data operations. The `data/api/` folder holds one module per entity (`users`, `challenges`, `actions`, `participation`, `groups`, `presets`, `templates`, `activityLogs`, `leaderboard`) plus shared `constants` and `helpers`. A barrel `index.js` re-exports everything so callers always import from the package root, never from a specific module file. If we ever change backends, the entity modules are the only thing that has to change.

**Example:**
```jsx
// CORRECT -- import from the data/api barrel
import { getUsers, createUser, ROLES } from "../../data/api";

// WRONG -- reaching past the barrel into a specific module
import { getUsers } from "../../data/api/users";

// WRONG -- importing supabase directly in a component
import { supabase } from "../../data/supabase";
const { data } = await supabase.from("users").select("*");
```

### Rule: Confirm before destructive actions

**Intent:** Prevent accidental data loss. Users should always see a confirmation dialog before deactivating users, archiving challenges, or similar actions.

**Example:**
```jsx
<ConfirmDialog
  open={confirmOpen}
  title="Deactivate User"
  message={`Are you sure you want to deactivate ${user.name}?`}
  onConfirm={handleDeactivate}
  onCancel={() => setConfirmOpen(false)}
/>
```

### Rule: Check for existing resources before creating duplicates

**Intent:** Prevent duplicate entries and guide admins to reactivate instead of recreate.

**Example (from UserForm.jsx):**
```jsx
const existing = await getUserByEmail(form.email);
if (existing) {
  setExistingUser(existing); // shows alert with reactivation option
  return;
}
await createUser(payload);
```

### Rule: Feature-folder organization

**Intent:** Keep related code together. Each feature has its own folder under `features/` containing all its pages, the per-page sub-components it uses (under `components/`), and any feature-scoped hooks (under `hooks/`). Cross-feature reusable pieces live in `components/shared/` (grouped by intent) and `lib/`.

```
features/
  users/
    UsersPage.jsx                  # list view
    UserDetail.jsx                 # detail view
    UserForm.jsx                   # create/edit form
    components/
      UsersFilterBar.jsx, UsersTable.jsx,
      PointsHistoryTable.jsx,
      ParticipationHistoryTable.jsx,
      UserActivityLogList.jsx
  challenges/
    ChallengesPage.jsx, ChallengeDetail.jsx, ChallengeForm.jsx
    components/
      ChallengesToolbar.jsx, ChallengesFilterBar.jsx, ChallengesTable.jsx,
      ActionFormDialog.jsx, ActionsEditor.jsx,
      ChallengeFieldsSection.jsx, ChallengeLeaderboard.jsx,
      ParticipantsTable.jsx, ParticipationLog.jsx, PresetPicker.jsx
  presets/
    PresetsPage.jsx, PresetForm.jsx
    components/
      PresetFieldsSection.jsx, PresetActionsEditor.jsx
  dashboard/
    DashboardPage.jsx, DashboardGrid.jsx, DashboardWidget.jsx,
    WidgetCatalog.jsx, ComparisonMode.jsx
    config/   widgets.js, layouts.js, index.js
    components/   DashboardToolbar.jsx, widgetRenderer.jsx,
                  comparison/ (5 chart sub-components + ComparisonCard)
    hooks/    useDashboardLayout.js, useDashboardStats.js, useComparisonData.js
    widgets/  22 widget components
```

**Naming intent:**

- A page (`*Page.jsx`) renders a top-level route and orchestrates state.
- A `*Form.jsx` is a create/edit screen.
- A `*Detail.jsx` is a single-record view.
- Anything under `<feature>/components/` is a presentational/UI piece used only by that feature.
- Anything under `<feature>/hooks/` is feature-scoped state/data logic.

### Rule: Permission checks use the `can()` helper

**Intent:** Centralize authorization logic so permission changes only happen in `permissions.js`.

**Example:**
```jsx
import { can } from "../../lib/permissions";

const showEmail = can(userRole, "VIEW_USER_EMAIL");
const canManage = hasRole("Admin");

{canManage && <Button>Edit</Button>}
{showEmail && <TableCell>{user.email}</TableCell>}
```

---

## 6. Code Review Checklist

Use this when reviewing PRs:

- [ ] Does the code follow the naming conventions above?
- [ ] Are imports in the correct order?
- [ ] Is all styling done via MUI `sx` prop?
- [ ] Are API calls going through `api.js`?
- [ ] Are destructive actions behind a confirmation dialog?
- [ ] Are loading and error states handled?
- [ ] Is the commit message descriptive and properly formatted?
- [ ] Are there no hardcoded secrets or credentials?
- [ ] Does the build pass (`npm run build`)?
- [ ] Are there no `console.log` statements left in?
- [ ] Does every touched file meet the Cohesive Comment Standard (Section 3)?
- [ ] Are any files in the 301-500 line band justified in the PR description?
- [ ] Are there no commented-out code blocks?
- [ ] Do all `// TODO` lines reference an issue?
