/**
 * @file templates.js
 * @summary Templates API -- read/write the `presets` table plus its
 * `preset_actions` child table. (Backend still uses "presets" table).
 *
 * A template is a reusable challenge template. Each read flattens the
 * template's actions onto the parent as `actions: TemplateAction[]`.
 */

import { supabase } from "../supabase";
import { unwrap } from "./helpers";

/**
 * Fetch every template with its action templates joined in.
 * @returns {Promise<Array<object>>}
 */
export async function getTemplates() {
  const templates = unwrap(await supabase.from("templates").select("*").order("id"));
  const pa = unwrap(await supabase.from("actions").select("*").order("id"));
  for (const t of templates) {
    t.categories = t.category ? t.category.split(', ') : [];
    t.actions = pa.filter((a) => a.templatesId === t.id);
  }
  return templates;
}

/**
 * Fetch one template by id with its action templates.
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
export async function getTemplateById(id) {
  const template = unwrap(await supabase.from("templates").select("*").eq("id", id).single());
  if (!template) return null;
  template.categories = template.category ? template.category.split(', ') : [];
  template.actions = unwrap(
    await supabase.from("actions").select("*").eq("templatesId", id).order("id"),
  );
  return template;
}

/**
 * Insert a template along with its action template rows.
 * @param {object} data Template fields plus optional `actions[]` and `categories[]`.
 * @returns {Promise<object>} The new template with its actions populated.
 */
export async function createTemplate(data) {
  const { actions: templateActions, categories, ...rest } = data;
  if (categories) {
    rest.category = categories.join(', ');
  }
  const template = unwrap(await supabase.from("templates").insert(rest).select().single());
  template.categories = template.category ? template.category.split(', ') : [];
  template.actions = [];
  if (templateActions?.length) {
    const rows = templateActions.map((a) => ({ ...a, templatesId: template.id }));
    template.actions = unwrap(await supabase.from("actions").insert(rows).select());
  }
  return template;
}

/**
 * Patch a template row and (optionally) replace its action templates.
 *
 * @param {number|string} id
 * @param {object} data
 * @returns {Promise<object>} The refreshed template.
 */
export async function updateTemplate(id, data) {
  const { actions: templateActions, categories, ...rest } = data;
  if (categories) {
    rest.category = categories.join(', ');
  }
  if (Object.keys(rest).length > 0) {
    unwrap(await supabase.from("templates").update(rest).eq("id", id));
  }
  if (templateActions !== undefined) {
    await supabase.from("actions").delete().eq("templatesId", id);
    if (templateActions.length) {
      const rows = templateActions.map((a) => ({ ...a, templatesId: id }));
      await supabase.from("actions").insert(rows);
    }
  }
  return getTemplateById(id);
}

/**
 * Hard-delete a template. Cascades on `actions` via FK ON DELETE.
 * @param {number|string} id
 */
export async function deleteTemplate(id) {
  unwrap(await supabase.from("templates").delete().eq("id", id));
}
