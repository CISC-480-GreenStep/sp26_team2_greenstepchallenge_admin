/**
 * @file index.js
 * @summary Top-level barrel for all shared/reusable UI components.
 *
 * Components are grouped by purpose:
 *   - `feedback` -- modals, alerts, confirmation dialogs
 *   - `data`     -- tables, links, cards, exports
 *   - `preview`  -- preview / visualization shells
 *   - `forms`    -- dialog-based form editors used by 2+ features
 *   - `layout`   -- page-level chrome (PageHeader, etc.)
 *
 * Consumers can do either:
 *   import { ConfirmDialog, CSVExport } from "@/components/shared";
 *   import { ConfirmDialog } from "@/components/shared/feedback";
 */

export * from "./feedback";
export * from "./data";
export * from "./preview";
export * from "./forms";
export * from "./layout";
