/**
 * Shared visual constants for the admin console.
 *
 * Kept here (not in MUI's theme) because they are used directly in
 * inline styles and Recharts series, where pulling from theme tokens
 * would require either useTheme() at every callsite or a conversion
 * step. Centralizing them keeps a single source of truth.
 */

/** Categorical palette for charts. Cycles when more series than colors. */
export const CHART_COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FF9800",
  "#00BCD4",
  "#795548",
  "#9C27B0",
  "#F44336",
];

/**
 * Categorical palette used by the Dashboard's Comparison Mode charts.
 *
 * Kept distinct from `CHART_COLORS` so reordering the global palette
 * (which would cycle differently across multi-series widgets) does not
 * silently change the colors users associate with specific challenges
 * in side-by-side comparisons.
 */
export const COMPARISON_COLORS = [
  "#2196F3",
  "#FF9800",
  "#4CAF50",
  "#F44336",
  "#9C27B0",
  "#00BCD4",
];

/** Companion palette used for the per-bar fill in the "Average Actions" chart. */
export const COMPARISON_AVG_COLORS = [
  "#2E7D32",
  "#1976D2",
  "#ED6C02",
  "#9C27B0",
  "#D32F2F",
  "#0288D1",
];

/** Gold / silver / bronze, in that order. Used for top-3 leaderboard tiles. */
export const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

/**
 * Maps a challenge status to an MUI Chip `color` prop. Falls back to
 * `default` when consumers see an unknown status, so new statuses
 * still render without crashing.
 */
export const STATUS_COLOR = {
  Active: "success",
  Upcoming: "info",
  Completed: "default",
  Archived: "warning",
};
