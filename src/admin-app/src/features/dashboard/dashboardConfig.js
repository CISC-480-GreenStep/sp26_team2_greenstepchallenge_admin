export const WIDGET_CATEGORIES = {
  overview: { label: "Overview Stats", order: 1 },
  charts: { label: "Charts & Visualizations", order: 2 },
  tables: { label: "Tables & Lists", order: 3 },
};

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

export const WIDGET_MAP = Object.fromEntries(WIDGETS.map((w) => [w.id, w]));

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

// ─── Responsive layout builder ──────────────────────────
// Generates mobile-friendly layouts from a list of visible widget IDs.
// Stats go 2-per-row at all sizes; charts and tables go full width on small screens.
function autoLayout(widgetIds, cols) {
  const layout = [];
  const stats = widgetIds.filter((id) => id.startsWith("stat-"));
  const others = widgetIds.filter((id) => !id.startsWith("stat-"));
  let y = 0;

  const statW = cols >= 10 ? Math.floor(cols / 4) : Math.max(1, Math.floor(cols / 2));
  let x = 0;
  stats.forEach((id) => {
    if (x + statW > cols) {
      x = 0;
      y += 2;
    }
    layout.push({ i: id, x, y, w: statW, h: 2, minW: 1, minH: 2 });
    x += statW;
  });
  if (x > 0) {
    y += 2;
    x = 0;
  }

  others.forEach((id) => {
    const isList = id.startsWith("list-") || id.startsWith("table-");
    const h = isList ? 7 : 6;
    layout.push({ i: id, x: 0, y, w: cols, h, minW: Math.min(2, cols), minH: 4 });
    y += h;
  });

  return layout;
}

function buildResponsiveLayouts(lgLayout, visibleWidgets) {
  return {
    lg: lgLayout,
    md: autoLayout(visibleWidgets, 10),
    sm: autoLayout(visibleWidgets, 6),
    xs: autoLayout(visibleWidgets, 4),
    xxs: autoLayout(visibleWidgets, 2),
  };
}

const LG_DEFAULT = [
  { i: "stat-active-challenges", x: 0, y: 0, w: 3, h: 2, minW: 1, minH: 2 },
  { i: "stat-total-actions", x: 3, y: 0, w: 3, h: 2, minW: 1, minH: 2 },
  { i: "stat-active-users", x: 6, y: 0, w: 3, h: 2, minW: 1, minH: 2 },
  { i: "stat-total-points", x: 9, y: 0, w: 3, h: 2, minW: 1, minH: 2 },
  { i: "table-challenge-summary", x: 0, y: 2, w: 7, h: 8, minW: 4, minH: 5 },
  { i: "chart-category-pie", x: 7, y: 2, w: 5, h: 8, minW: 3, minH: 5 },
  { i: "chart-participation-bar", x: 0, y: 10, w: 6, h: 7, minW: 4, minH: 5 },
  { i: "list-leaderboard", x: 0, y: 17, w: 6, h: 8, minW: 4, minH: 5 },
  { i: "table-most-active", x: 6, y: 17, w: 6, h: 8, minW: 4, minH: 5 },
];

export const DEFAULT_LAYOUTS = buildResponsiveLayouts(LG_DEFAULT, DEFAULT_VISIBLE);

export const LAYOUT_PRESETS = [
  {
    id: "default",
    name: "Default",
    description: "Original dashboard layout with all core widgets",
    visible: [...DEFAULT_VISIBLE],
    layouts: buildResponsiveLayouts(LG_DEFAULT, DEFAULT_VISIBLE),
  },
  {
    id: "executive",
    name: "Executive Summary",
    description: "Key metrics and leaderboard at a glance",
    visible: [
      "stat-active-challenges",
      "stat-total-actions",
      "stat-active-users",
      "stat-total-points",
      "stat-completion-rate",
      "stat-avg-points",
      "chart-challenge-status",
      "list-leaderboard",
    ],
    layouts: buildResponsiveLayouts(
      [
        { i: "stat-active-challenges", x: 0, y: 0, w: 3, h: 2, minW: 1, minH: 2 },
        { i: "stat-total-actions", x: 3, y: 0, w: 3, h: 2, minW: 1, minH: 2 },
        { i: "stat-active-users", x: 6, y: 0, w: 3, h: 2, minW: 1, minH: 2 },
        { i: "stat-total-points", x: 9, y: 0, w: 3, h: 2, minW: 1, minH: 2 },
        { i: "stat-completion-rate", x: 0, y: 2, w: 3, h: 2, minW: 1, minH: 2 },
        { i: "stat-avg-points", x: 3, y: 2, w: 3, h: 2, minW: 1, minH: 2 },
        { i: "chart-challenge-status", x: 6, y: 2, w: 6, h: 8, minW: 3, minH: 5 },
        { i: "list-leaderboard", x: 0, y: 4, w: 6, h: 8, minW: 4, minH: 5 },
      ],
      [
        "stat-active-challenges",
        "stat-total-actions",
        "stat-active-users",
        "stat-total-points",
        "stat-completion-rate",
        "stat-avg-points",
        "chart-challenge-status",
        "list-leaderboard",
      ],
    ),
  },
  {
    id: "analytics",
    name: "Analytics Deep Dive",
    description: "All charts and data visualizations",
    visible: [
      "chart-category-pie",
      "chart-participation-bar",
      "chart-challenge-status",
      "chart-points-by-challenge",
      "chart-user-growth",
      "chart-group-performance",
      "chart-completion-rates",
      "chart-points-distribution",
    ],
    layouts: buildResponsiveLayouts(
      [
        { i: "chart-category-pie", x: 0, y: 0, w: 4, h: 7, minW: 3, minH: 5 },
        { i: "chart-challenge-status", x: 4, y: 0, w: 4, h: 7, minW: 3, minH: 5 },
        { i: "chart-points-distribution", x: 8, y: 0, w: 4, h: 7, minW: 3, minH: 5 },
        { i: "chart-participation-bar", x: 0, y: 7, w: 6, h: 7, minW: 4, minH: 5 },
        { i: "chart-points-by-challenge", x: 0, y: 14, w: 6, h: 7, minW: 4, minH: 5 },
        { i: "chart-user-growth", x: 6, y: 14, w: 6, h: 7, minW: 4, minH: 5 },
        { i: "chart-group-performance", x: 0, y: 21, w: 6, h: 7, minW: 4, minH: 5 },
        { i: "chart-completion-rates", x: 6, y: 21, w: 6, h: 7, minW: 4, minH: 5 },
      ],
      [
        "chart-category-pie",
        "chart-participation-bar",
        "chart-challenge-status",
        "chart-points-by-challenge",
        "chart-user-growth",
        "chart-group-performance",
        "chart-completion-rates",
        "chart-points-distribution",
      ],
    ),
  },
  {
    id: "compact",
    name: "Compact Overview",
    description: "Minimal view with stats and summary table",
    visible: [
      "stat-active-challenges",
      "stat-total-actions",
      "stat-active-users",
      "stat-total-points",
      "table-challenge-summary",
    ],
    layouts: buildResponsiveLayouts(
      [
        { i: "stat-active-challenges", x: 0, y: 0, w: 3, h: 2, minW: 1, minH: 2 },
        { i: "stat-total-actions", x: 3, y: 0, w: 3, h: 2, minW: 1, minH: 2 },
        { i: "stat-active-users", x: 6, y: 0, w: 3, h: 2, minW: 1, minH: 2 },
        { i: "stat-total-points", x: 9, y: 0, w: 3, h: 2, minW: 1, minH: 2 },
        { i: "table-challenge-summary", x: 0, y: 2, w: 12, h: 10, minW: 4, minH: 5 },
      ],
      [
        "stat-active-challenges",
        "stat-total-actions",
        "stat-active-users",
        "stat-total-points",
        "table-challenge-summary",
      ],
    ),
  },
];

export { autoLayout, buildResponsiveLayouts };
