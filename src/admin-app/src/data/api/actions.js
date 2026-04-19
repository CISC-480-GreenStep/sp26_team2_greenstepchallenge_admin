/**
 * Actions API -- read/write the `actions` table.
 *
 * Actions live in their own catalog. A challenge references actions via
 * the `challenge_actions` join table (managed in `./challenges.js`).
 */

import { supabase } from "../supabase";
import { unwrap } from "./helpers";

/**
 * Fetch every action in the catalog.
 * @returns {Promise<Array<object>>}
 */
export async function getActions() {
  return unwrap(await supabase.from("actions").select("*").order("id"));
}

/**
 * Fetch only the actions assigned to a given challenge.
 *
 * Done in two queries (join then `in`) instead of a Postgres join so
 * the response shape stays a flat array of action rows.
 *
 * @param {number|string} challengeId
 * @returns {Promise<Array<object>>}
 */
export async function getActionsByChallenge(challengeId) {
  const ca = unwrap(
    await supabase.from("challenge_actions").select("actionId").eq("challengeId", challengeId),
  );
  if (!ca.length) return [];
  const actionIds = ca.map((r) => r.actionId);
  return unwrap(await supabase.from("actions").select("*").in("id", actionIds).order("id"));
}

/**
 * Insert a new action.
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function createAction(data) {
  return unwrap(await supabase.from("actions").insert(data).select().single());
}

/**
 * Patch an action row.
 * @param {number|string} id
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function updateAction(id, data) {
  return unwrap(await supabase.from("actions").update(data).eq("id", id).select().single());
}

/**
 * Hard-delete an action. Cascades on `challenge_actions` and `participation`.
 * @param {number|string} id
 */
export async function deleteAction(id) {
  unwrap(await supabase.from("actions").delete().eq("id", id));
}
