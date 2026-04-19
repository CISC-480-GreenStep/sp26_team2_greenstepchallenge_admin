/**
 * @file users.js
 * @summary Users API -- read/write the `users` table.
 *
 * Note: createUser does NOT insert directly. It calls the
 * `/.netlify/functions/invite-user` (or Vercel equivalent) serverless
 * function, which provisions a Supabase Auth user, sends a magic-link
 * invite, and inserts the matching profile row. Components must always
 * go through `createUser` so the auth side stays in sync.
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
  const res = await fetch("/.netlify/functions/invite-user", {
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
 * Mark a user as Deactivated. We never hard-delete users so participation
 * history and activity logs remain queryable.
 * @param {number|string} id
 */
export async function deactivateUser(id) {
  return updateUser(id, { status: USER_STATUSES.DEACTIVATED });
}

/**
 * Re-activate a previously deactivated user.
 * @param {number|string} id
 */
export async function activateUser(id) {
  return updateUser(id, { status: USER_STATUSES.ACTIVE });
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
