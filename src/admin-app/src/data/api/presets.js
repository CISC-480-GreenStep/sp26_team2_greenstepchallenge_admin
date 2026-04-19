/**
 * Presets API -- read/write the `presets` table plus its
 * `preset_actions` child table.
 *
 * A preset is a reusable challenge template. Each read flattens the
 * preset's actions onto the parent as `actions: PresetAction[]` so the
 * UI can iterate without a second query.
 */

import { supabase } from "../supabase";
import { unwrap } from "./helpers";

/**
 * Fetch every preset with its action templates joined in.
 * @returns {Promise<Array<object>>}
 */
export async function getPresets() {
  const presets = unwrap(await supabase.from("presets").select("*").order("id"));
  const pa = unwrap(await supabase.from("preset_actions").select("*").order("id"));
  for (const p of presets) {
    p.actions = pa.filter((a) => a.presetId === p.id);
  }
  return presets;
}

/**
 * Fetch one preset by id with its action templates.
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
export async function getPresetById(id) {
  const preset = unwrap(await supabase.from("presets").select("*").eq("id", id).single());
  if (!preset) return null;
  preset.actions = unwrap(
    await supabase.from("preset_actions").select("*").eq("presetId", id).order("id"),
  );
  return preset;
}

/**
 * Insert a preset along with its action template rows.
 * @param {object} data Preset fields plus optional `actions[]`.
 * @returns {Promise<object>} The new preset with its actions populated.
 */
export async function createPreset(data) {
  const { actions: presetActions, ...rest } = data;
  const preset = unwrap(await supabase.from("presets").insert(rest).select().single());
  preset.actions = [];
  if (presetActions?.length) {
    const rows = presetActions.map((a) => ({ ...a, presetId: preset.id }));
    preset.actions = unwrap(await supabase.from("preset_actions").insert(rows).select());
  }
  return preset;
}

/**
 * Patch a preset row and (optionally) replace its action templates.
 *
 * Passing `actions: undefined` leaves them untouched; passing an empty
 * array clears them.
 *
 * @param {number|string} id
 * @param {object} data
 * @returns {Promise<object>} The refreshed preset.
 */
export async function updatePreset(id, data) {
  const { actions: presetActions, ...rest } = data;
  if (Object.keys(rest).length > 0) {
    unwrap(await supabase.from("presets").update(rest).eq("id", id));
  }
  if (presetActions !== undefined) {
    await supabase.from("preset_actions").delete().eq("presetId", id);
    if (presetActions.length) {
      const rows = presetActions.map((a) => ({ ...a, presetId: id }));
      await supabase.from("preset_actions").insert(rows);
    }
  }
  return getPresetById(id);
}

/**
 * Hard-delete a preset. Cascades on `preset_actions` via FK ON DELETE.
 * @param {number|string} id
 */
export async function deletePreset(id) {
  unwrap(await supabase.from("presets").delete().eq("id", id));
}
