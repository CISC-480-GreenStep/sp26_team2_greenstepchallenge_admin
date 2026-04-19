/**
 * @file index.js
 * @summary Top-level barrel for all shared/reusable UI components.
 *
 * Components are grouped by purpose:
 *   - `feedback` -- modals, alerts, confirmation dialogs
 *   - `data`     -- tables, links, cards, exports
 *   - `preview`  -- preview / visualization shells
 *
 * Consumers can do either:
 *   import { ConfirmDialog, CSVExport } from "@/components/shared";
 *   import { ConfirmDialog } from "@/components/shared/feedback";
 */

export * from "./feedback";
export * from "./data";
export * from "./preview";
