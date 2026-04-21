/**
 * @file layouts.js
 * @summary Default react-grid-layout configurations and named layout presets.
 *
 * Exports:
 *   - `autoLayout(visibleIds, cols)`       generate a mobile-friendly layout from a flat id list
 *   - `buildResponsiveLayouts(lg, ids)`    expand a desktop layout into all five breakpoints
 *   - `DEFAULT_LAYOUTS`                    layouts keyed by breakpoint, used on first load
 *   - `LAYOUT_PRESETS`                     named presets (Default / Executive / Analytics / Compact)
 *
 * Splitting these out of `widgets.js` keeps the catalog focused on what
 * exists and this file focused on how things are arranged.
 */

import { DEFAULT_VISIBLE } from "./widgets";

/**
 * Generates a mobile-friendly layout from a list of visible widget IDs.
 * Stats go 2-per-row at small sizes / 4-per-row when wider; charts and
 * tables always go full-width.
 *
 * @param {string[]} widgetIds
 * @param {number} cols - Total columns at this breakpoint.
 * @returns {Array<{ i: string, x: number, y: number, w: number, h: number, minW: number, minH: number }>}
 */
export function autoLayout(widgetIds, cols) {
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

/**
 * Take a hand-tuned desktop layout (`lg`) and derive the four narrower
 * breakpoints (md / sm / xs / xxs) via `autoLayout`.
 */
export function buildResponsiveLayouts(lgLayout, visibleWidgets) {
  return {
    lg: lgLayout,
    md: autoLayout(visibleWidgets, 10),
    sm: autoLayout(visibleWidgets, 6),
    xs: autoLayout(visibleWidgets, 4),
    xxs: autoLayout(visibleWidgets, 2),
  };
}

/** Hand-tuned large-screen layout used for the default dashboard. */
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

/** Layouts shown when a user has never customized their dashboard. */
export const DEFAULT_LAYOUTS = buildResponsiveLayouts(LG_DEFAULT, DEFAULT_VISIBLE);

/**
 * Named presets users can apply with one click. Each entry pre-defines
 * both the visible widget set AND the responsive layouts so applying a
 * preset is purely declarative.
 */
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
