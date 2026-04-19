/**
 * @file templates.js
 * @summary Templates API -- read/write the `templates` table.
 *
 * Templates predate presets and are still queryable from the API but
 * have no UI yet (see issue #7). Kept here so the data layer stays
 * complete; remove if/when the table is dropped.
 */

import { supabase } from "../supabase";
import { unwrap } from "./helpers";

/**
 * Fetch every template, ordered by id.
 * @returns {Promise<Array<object>>}
 */
export async function getTemplates() {
  return unwrap(await supabase.from("templates").select("*").order("id"));
}

/**
 * Fetch one template by id.
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
export async function getTemplateById(id) {
  return unwrap(await supabase.from("templates").select("*").eq("id", id).single());
}

/**
 * Insert a new template.
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function createTemplate(data) {
  return unwrap(await supabase.from("templates").insert(data).select().single());
}

/**
 * Patch a template row.
 * @param {number|string} id
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function updateTemplate(id, data) {
  return unwrap(await supabase.from("templates").update(data).eq("id", id).select().single());
}

/**
 * Hard-delete a template.
 * @param {number|string} id
 */
export async function deleteTemplate(id) {
  unwrap(await supabase.from("templates").delete().eq("id", id));
}
