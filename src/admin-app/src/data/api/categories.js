/**
 * @file categories.js
 * @summary Categories API -- read/write the `categories` table.
 */

import { supabase } from "../supabase";
import { unwrap } from "./helpers";

/**
 * Fetch every category in the catalog.
 * @returns {Promise<Array<object>>}
 */
export async function getCategories() {
  return unwrap(await supabase.from("categories").select("*").order("name", { ascending: true }));
}

/**
 * Insert a new category.
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function createCategory(data) {
  return unwrap(await supabase.from("categories").insert(data).select().single());
}

/**
 * Patch a category row.
 * @param {number|string} id
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function updateCategory(id, data) {
  return unwrap(await supabase.from("categories").update(data).eq("id", id).select().single());
}

/**
 * Delete a category.
 * @param {number|string} id
 */
export async function deleteCategory(id) {
  unwrap(await supabase.from("categories").delete().eq("id", id));
}