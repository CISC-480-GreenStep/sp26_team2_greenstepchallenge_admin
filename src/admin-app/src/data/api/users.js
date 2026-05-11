/**
 * @file users.js
 * @summary Users API -- read/write the `users` table.
 *
 * Note: createUser does NOT insert directly. It calls the `/api/invite-user`
 * Vercel serverless function, which provisions a Supabase Auth user, sends
 * a magic-link invite, and inserts the matching profile row. Components
 * must always go through `createUser` so the auth side stays in sync.
 */

import { supabase } from "../supabase";
import { USER_STATUSES } from "./constants";
import { unwrap } from "./helpers";

/**
 * Fetch every user row, ordered by id.
 * @returns {Promise<Array<object>>}
 */
export async function getUsers() {
  return unwrap(await supabase.from("users").select("*").order("id"));
}

/**
 * Fetch a single user by id.
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
export async function getUserById(id) {
  return unwrap(await supabase.from("users").select("*").eq("id", id).single());
}

/**
 * Invite a new user (Auth + profile row) via the serverless invite endpoint.
 *
 * @param {{ name: string, email: string, role: string, groupId?: number|null }} data
 * @returns {Promise<object>} Whatever the invite function returns (typically the new user row).
 * @throws {Error} When the serverless function responds with a non-2xx.
 */
export async function createUser(data) {
  const res = await fetch("/api/invite-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to invite user");
  return result;
}

/**
 * Patch a user row.
 * @param {number|string} id
 * @param {object} data Partial column updates.
 * @returns {Promise<object>} The updated row.
 */
export async function updateUser(id, data) {
  return unwrap(await supabase.from("users").update(data).eq("id", id).select().single());
}

/**
 * Mark a user as Deactivated and ban their auth credentials so they
 * actually can't sign in anymore.
 * @param {number|string} id
 */
export async function deactivateUser(id) {
  const updated = await updateUser(id, { status: USER_STATUSES.DEACTIVATED });
  await setAuthActive(updated.email, false);
  return updated;
}

/**
 * Re-activate a previously deactivated user, restoring sign-in.
 * @param {number|string} id
 */
export async function activateUser(id) {
  const updated = await updateUser(id, { status: USER_STATUSES.ACTIVE });
  await setAuthActive(updated.email, true);
  return updated;
}

/**
 * Toggle the Supabase Auth ban for an email via the service-role
 * serverless function. Failures here are logged but not thrown so a
 * missing auth row doesn't block the profile-side status flip.
 */
async function setAuthActive(email, active) {
  if (!email) return;
  try {
    const res = await fetch("/api/set-user-active", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, active }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      // eslint-disable-next-line no-console
      console.warn("set-user-active failed:", body.error || res.statusText);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("set-user-active failed:", err.message);
  }
}

/**
 * Look up a user by email (for the duplicate-prevention flow in UserForm).
 * Uses `maybeSingle` so a missing row resolves to `null` instead of throwing.
 *
 * @param {string} email
 * @returns {Promise<object|null>}
 */
export async function getUserByEmail(email) {
  const { data } = await supabase.from("users").select("*").eq("email", email).maybeSingle();
  return data;
}

/**
 * Permanently delete a user (Auth + profile row) via the serverless
 * delete endpoint. Distinct from `deactivateUser`, which only bans
 * the credential and flips a status flag; this purges the user
 * entirely. Cascades to `participation` and `activity_logs`; rows
 * the user authored (challenges, templates, groups) keep a NULL
 * `createdBy`.
 *
 * SuperAdmin-only. The frontend gates the affordance via
 * `can(role, "DELETE_USER_PERMANENT")`; the service-role key is
 * server-only so the route can't be called from a regular client
 * even if someone bypasses the UI guard.
 *
 * @param {{ id: number|string, email: string }} user The user row to purge.
 * @returns {Promise<{ ok: boolean, authDeleted: boolean }>}
 * @throws {Error} When the serverless function responds with a non-2xx.
 */
export async function deleteUserPermanently({ id, email }) {
  const res = await fetch("/api/delete-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: id, email }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to delete user");
  return result;
}
