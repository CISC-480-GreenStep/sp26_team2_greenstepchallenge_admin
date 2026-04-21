/**
 * @file index.js
 * @summary Public API surface for the data layer.
 *
 * Every component imports from `data/api`, never from a sub-module
 * (and never from `data/supabase` directly). This barrel keeps the
 * existing import sites working after the data/api.js -> data/api/
 * split, and gives us one place to control what callers can reach.
 *
 * If you add a new entity module, re-export it here.
 */

export * from "./constants";
export * from "./helpers";
export * from "./users";
export * from "./challenges";
export * from "./actions";
export * from "./participation";
export * from "./groups";
export * from "./presets";
export * from "./templates";
export * from "./activityLogs";
export * from "./leaderboard";
