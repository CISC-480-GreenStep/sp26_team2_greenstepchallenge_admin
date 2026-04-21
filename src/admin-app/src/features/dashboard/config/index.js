/**
 * @file index.js
 * @summary Barrel re-export for the split dashboard configuration.
 *
 * Lets consumers continue writing
 *   import { WIDGETS, DEFAULT_LAYOUTS } from "./config";
 * without caring whether each symbol lives in `widgets.js` or
 * `layouts.js`. Replaces the previous monolithic `dashboardConfig.js`.
 */

export { WIDGET_CATEGORIES, WIDGETS, WIDGET_MAP, DEFAULT_VISIBLE } from "./widgets";

export { autoLayout, buildResponsiveLayouts, DEFAULT_LAYOUTS, LAYOUT_PRESETS } from "./layouts";
