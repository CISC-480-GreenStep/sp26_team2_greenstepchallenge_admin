/**
 * @file useDashboardLayout.js
 * @summary useDashboardLayout -- owns the editable dashboard grid state.
 *
 * Responsibilities:
 *   - Hydrate visible widgets and per-breakpoint layouts from
 *     localStorage (or defaults when nothing is saved or parsing fails).
 *   - Track edit mode + a snapshot so Cancel can revert in-flight changes.
 *   - Persist to localStorage on Save; clear it on Reset to Default.
 *   - Expose toggleWidget / applyPreset that keep the layouts object in
 *     sync when widget visibility changes -- newly-shown widgets get
 *     auto-placed below the existing grid for every breakpoint so they
 *     never overlap.
 *
 * State is local-only; sharing layouts between users would require
 * pushing visible/layouts into Supabase keyed by user_id.
 */

import { useCallback, useState } from "react";

import { DEFAULT_LAYOUTS, DEFAULT_VISIBLE, LAYOUT_PRESETS, autoLayout } from "../config";

const STORAGE_KEY = "greenstep_dashboard_layout";

const BREAKPOINT_COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

/**
 * Read the saved {visible, layouts} blob. Returns null on missing,
 * malformed, or partially-shaped data so callers can fall back to
 * defaults instead of crashing on a bad localStorage entry.
 */
function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.visible && parsed.layouts) return parsed;
    }
  } catch {
    // Corrupt JSON -- fall through to defaults rather than crashing the page.
  }
  return null;
}

/**
 * Make sure every widget in `widgetIds` has an entry in every
 * breakpoint of `layouts`. Newly-added widgets are appended below the
 * current bottom of the grid via autoLayout(), preventing overlap with
 * existing tiles.
 *
 * Pure; returns a new object and never mutates the input.
 */
function ensureLayoutEntries(layouts, widgetIds) {
  const updated = { ...layouts };

  for (const bp of Object.keys(updated)) {
    if (!Array.isArray(updated[bp])) continue;
    const existing = new Set(updated[bp].map((item) => item.i));
    const toAdd = widgetIds.filter((id) => !existing.has(id));
    if (toAdd.length === 0) continue;

    const cols = BREAKPOINT_COLS[bp] || 12;
    const newEntries = autoLayout(toAdd, cols);
    const maxY = updated[bp].reduce((max, item) => Math.max(max, item.y + item.h), 0);
    updated[bp] = [...updated[bp], ...newEntries.map((entry) => ({ ...entry, y: entry.y + maxY }))];
  }
  return updated;
}

export default function useDashboardLayout() {
  const saved = loadSaved();

  const [visible, setVisible] = useState(saved?.visible || [...DEFAULT_VISIBLE]);
  const [layouts, setLayouts] = useState(() => {
    const base = saved?.layouts || JSON.parse(JSON.stringify(DEFAULT_LAYOUTS));
    return ensureLayoutEntries(base, saved?.visible || DEFAULT_VISIBLE);
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snapshot, setSnapshot] = useState(null);

  const startEditing = useCallback(() => {
    setSnapshot({
      visible: [...visible],
      layouts: JSON.parse(JSON.stringify(layouts)),
    });
    setIsEditing(true);
  }, [visible, layouts]);

  const cancelEditing = useCallback(() => {
    if (snapshot) {
      setVisible(snapshot.visible);
      setLayouts(snapshot.layouts);
    }
    setSnapshot(null);
    setIsEditing(false);
  }, [snapshot]);

  const saveLayout = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ visible, layouts }));
    setSnapshot(null);
    setIsEditing(false);
  }, [visible, layouts]);

  const onLayoutChange = useCallback((_layout, allLayouts) => {
    setLayouts(allLayouts);
  }, []);

  // Toggling visibility also tops up the layouts object so the new
  // widget gets a non-overlapping tile. We refuse to drop the last
  // visible widget so the dashboard never renders empty.
  const toggleWidget = useCallback((widgetId) => {
    setVisible((prev) => {
      if (prev.includes(widgetId)) {
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== widgetId);
      }
      return [...prev, widgetId];
    });

    setLayouts((prev) => ensureLayoutEntries(prev, [widgetId]));
  }, []);

  const applyPreset = useCallback((presetId) => {
    const preset = LAYOUT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const presetLayouts = JSON.parse(JSON.stringify(preset.layouts));
      setVisible([...preset.visible]);
      setLayouts(ensureLayoutEntries(presetLayouts, preset.visible));
    }
  }, []);

  const resetToDefault = useCallback(() => {
    const defaultLayouts = JSON.parse(JSON.stringify(DEFAULT_LAYOUTS));
    setVisible([...DEFAULT_VISIBLE]);
    setLayouts(ensureLayoutEntries(defaultLayouts, DEFAULT_VISIBLE));
    localStorage.removeItem(STORAGE_KEY);
    setSnapshot(null);
    setIsEditing(false);
  }, []);

  return {
    visible,
    layouts,
    isEditing,
    startEditing,
    cancelEditing,
    saveLayout,
    onLayoutChange,
    toggleWidget,
    applyPreset,
    resetToDefault,
  };
}
