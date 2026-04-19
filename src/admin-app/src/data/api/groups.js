/**
 * Groups API -- read/write the `departments` table.
 *
 * The Postgres table is named `departments` for historical reasons;
 * the UI consistently calls them "Groups". The mapping happens here so
 * no other module needs to know about the rename.
 */

import { supabase } from "../supabase";
import { unwrap } from "./helpers";

/**
 * Fetch every group, ordered by id.
 * @returns {Promise<Array<object>>}
 */
export async function getGroups() {
  return unwrap(await supabase.from("departments").select("*").order("id"));
}

/**
 * Fetch one group by id.
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
export async function getGroupById(id) {
  return unwrap(await supabase.from("departments").select("*").eq("id", id).single());
}

/**
 * Insert a new group.
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function createGroup(data) {
  return unwrap(await supabase.from("departments").insert(data).select().single());
}

/**
 * Patch a group row.
 * @param {number|string} id
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function updateGroup(id, data) {
  return unwrap(await supabase.from("departments").update(data).eq("id", id).select().single());
}

/**
 * Hard-delete a group. Members and challenges keep their `groupId`
 * pointing at a now-missing row -- callers should reassign first.
 * @param {number|string} id
 */
export async function deleteGroup(id) {
  unwrap(await supabase.from("departments").delete().eq("id", id));
}
