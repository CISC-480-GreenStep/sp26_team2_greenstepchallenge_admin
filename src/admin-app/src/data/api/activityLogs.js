/**
 * Activity Logs API -- read/write the `activity_logs` table.
 *
 * Every mutating admin operation should `logActivity(...)` after it
 * succeeds. The logs power UserDetail's history timeline and the
 * Recent Activity dashboard widget.
 */

import { supabase } from "../supabase";
import { unwrap } from "./helpers";

/**
 * Fetch all activity log rows for a single user, newest first.
 * @param {number|string} userId
 * @returns {Promise<Array<object>>}
 */
export async function getActivityLogsByUser(userId) {
  return unwrap(
    await supabase
      .from("activity_logs")
      .select("*")
      .eq("userId", userId)
      .order("timestamp", { ascending: false }),
  );
}

/**
 * Fetch every activity log row, newest first.
 * @returns {Promise<Array<object>>}
 */
export async function getActivityLogs() {
  return unwrap(
    await supabase.from("activity_logs").select("*").order("timestamp", { ascending: false }),
  );
}

/**
 * Insert one activity log row. Call this after any mutating admin
 * operation (create/update/archive/delete on users, challenges, groups,
 * presets, etc.) so the audit trail stays complete.
 *
 * @param {number|string|null} userId Acting admin's user id (null for system).
 * @param {string} action  Short verb phrase, e.g. "Archived challenge".
 * @param {string} details Free-form description shown in the activity feed.
 * @returns {Promise<object>} The new log row.
 */
export async function logActivity(userId, action, details) {
  return unwrap(
    await supabase.from("activity_logs").insert({ userId, action, details }).select().single(),
  );
}
