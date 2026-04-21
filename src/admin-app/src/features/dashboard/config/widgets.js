/**
 * @file widgets.js
 * @summary Catalog of every widget the customizable dashboard can render.
 *
 * Each entry describes:
 *   - `id`         stable string used by react-grid-layout and `WIDGET_MAP`
 *   - `title`      label shown in the catalog and widget header
 *   - `description` explanatory text shown in the catalog drawer
 *   - `category`   bucket into `WIDGET_CATEGORIES` for grouping in the picker
 *   - `defaultW/H` initial grid size when the widget is dropped on the board
 *   - `minW/H`     minimum sizes enforced by the grid
 *
 * `WIDGET_MAP` is a derived id→entry lookup so consumers don't re-scan
 * the array on every render.
 *
 * `DEFAULT_VISIBLE` is the out-of-the-box set of widget ids shown to a
 * user who has never customized their dashboard.
 */

/** High-level groupings used by the widget catalog drawer. */
export const WIDGET_CATEGORIES = {
  overview: { label: "Overview Stats", order: 1 },
  charts: { label: "Charts & Visualizations", order: 2 },
  tables: { label: "Tables & Lists", order: 3 },
};

/** All widgets the dashboard can render. Order here drives the catalog. */
export const WIDGETS = [
  // ─── Overview Stats ───────────────────────────────────
  {
    id: "stat-active-challenges",
    title: "Active Challenges",
    description: "Count of currently active challenges",
    category: "overview",
    defaultW: 3,
    defaultH: 2,
    minW: 1,
    minH: 2,
  },
  {
    id: "stat-total-actions",
    title: "Total Actions Taken",
    description: "Total completed actions across all challenges",
    category: "overview",
    defaultW: 3,
    defaultH: 2,
    minW: 1,
    minH: 2,
  },
  {
    id: "stat-active-users",
    title: "Active Users",
    description: "Number of currently active users",
    category: "overview",
    defaultW: 3,
    defaultH: 2,
    minW: 1,
    minH: 2,
  },
  {
    id: "stat-total-points",
    title: "Total Points Earned",
    description: "Sum of all points earned across users",
    category: "overview",
    defaultW: 3,
    defaultH: 2,
    minW: 1,
    minH: 2,
  },
  {
    id: "stat-completion-rate",
    title: "Completion Rate",
    description: "Percentage of active users who completed at least one action",
    category: "overview",
    defaultW: 3,
    defaultH: 2,
    minW: 1,
    minH: 2,
  },
  {
    id: "stat-avg-points",
    title: "Avg Points Per User",
    description: "Average points earned per active participant",
    category: "overview",
    defaultW: 3,
    defaultH: 2,
    minW: 1,
    minH: 2,
  },
  {
    id: "stat-new-users",
    title: "New Users This Month",
    description: "Users registered in the current calendar month",
    category: "overview",
    defaultW: 3,
    defaultH: 2,
    minW: 1,
    minH: 2,
  },
  {
    id: "stat-top-category",
    title: "Top Category",
    description: "Most popular action category by completions",
    category: "overview",
    defaultW: 3,
    defaultH: 2,
    minW: 1,
    minH: 2,
  },

  // ─── Charts & Visualizations ──────────────────────────
  {
    id: "chart-category-pie",
    title: "Actions by Category",
    description: "Pie chart of action distribution across categories",
    category: "charts",
    defaultW: 5,
    defaultH: 7,
    minW: 3,
    minH: 5,
  },
  {
    id: "chart-participation-bar",
    title: "Participation by Challenge",
    description: "Bar chart comparing participants and completions per challenge",
    category: "charts",
    defaultW: 6,
    defaultH: 7,
    minW: 3,
    minH: 5,
  },
  {
    id: "chart-challenge-status",
    title: "Challenge Status Breakdown",
    description: "Donut chart of challenge counts by status",
    category: "charts",
    defaultW: 4,
    defaultH: 7,
    minW: 3,
    minH: 5,
  },
  {
    id: "chart-points-by-challenge",
    title: "Points by Challenge",
    description: "Earned vs maximum points per challenge",
    category: "charts",
    defaultW: 6,
    defaultH: 7,
    minW: 3,
    minH: 5,
  },
  {
    id: "chart-user-growth",
    title: "User Registration Timeline",
    description: "Cumulative user growth over time",
    category: "charts",
    defaultW: 6,
    defaultH: 7,
    minW: 3,
    minH: 5,
  },
  {
    id: "chart-group-performance",
    title: "Group Performance",
    description: "Participation and points comparison across groups",
    category: "charts",
    defaultW: 6,
    defaultH: 7,
    minW: 3,
    minH: 5,
  },
  {
    id: "chart-completion-rates",
    title: "Challenge Completion Rates",
    description: "Horizontal bar chart of completion percentage per challenge",
    category: "charts",
    defaultW: 6,
    defaultH: 7,
    minW: 3,
    minH: 5,
  },
  {
    id: "chart-points-distribution",
    title: "Points Distribution",
    description: "Histogram of how points are distributed among users",
    category: "charts",
    defaultW: 6,
    defaultH: 7,
    minW: 3,
    minH: 5,
  },

  // ─── Tables & Lists ──────────────────────────────────
  {
    id: "table-challenge-summary",
    title: "Challenge Summary",
    description: "Table of all non-archived challenges with key metrics",
    category: "tables",
    defaultW: 7,
    defaultH: 8,
    minW: 3,
    minH: 5,
  },
  {
    id: "list-leaderboard",
    title: "Global Leaderboard",
    description: "Top users ranked by cumulative points",
    category: "tables",
    defaultW: 6,
    defaultH: 8,
    minW: 3,
    minH: 5,
  },
  {
    id: "table-most-active",
    title: "Most Active Users",
    description: "Users ranked by number of completed actions",
    category: "tables",
    defaultW: 6,
    defaultH: 8,
    minW: 3,
    minH: 5,
  },
  {
    id: "list-recent-activity",
    title: "Recent Activity",
    description: "Latest completed actions with user and challenge info",
    category: "tables",
    defaultW: 6,
    defaultH: 8,
    minW: 3,
    minH: 5,
  },
  {
    id: "list-upcoming",
    title: "Upcoming Challenges",
    description: "Challenges scheduled to start in the future",
    category: "tables",
    defaultW: 6,
    defaultH: 6,
    minW: 2,
    minH: 4,
  },
];

/** Fast id→widget lookup so callers don't scan `WIDGETS` on every render. */
export const WIDGET_MAP = Object.fromEntries(WIDGETS.map((w) => [w.id, w]));

/** First-time-user default set of visible widgets. */
export const DEFAULT_VISIBLE = [
  "stat-active-challenges",
  "stat-total-actions",
  "stat-active-users",
  "stat-total-points",
  "table-challenge-summary",
  "chart-category-pie",
  "chart-participation-bar",
  "list-leaderboard",
  "table-most-active",
];
