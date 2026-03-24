import { useState, useCallback } from 'react';
import { DEFAULT_VISIBLE, DEFAULT_LAYOUTS, LAYOUT_PRESETS, WIDGET_MAP, autoLayout } from '../dashboardConfig';

const STORAGE_KEY = 'greenstep_dashboard_layout';

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.visible && parsed.layouts) return parsed;
    }
  } catch {
    /* ignore corrupt data */
  }
  return null;
}

function ensureLayoutEntries(layouts, widgetIds) {
  const updated = { ...layouts };
  const bpCols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

  for (const bp of Object.keys(updated)) {
    if (!Array.isArray(updated[bp])) continue;
    const existing = new Set(updated[bp].map((item) => item.i));
    const toAdd = widgetIds.filter((id) => !existing.has(id));
    if (toAdd.length > 0) {
      const cols = bpCols[bp] || 12;
      const newEntries = autoLayout(toAdd, cols);
      const maxY = updated[bp].reduce((max, item) => Math.max(max, item.y + item.h), 0);
      updated[bp] = [
        ...updated[bp],
        ...newEntries.map((entry) => ({ ...entry, y: entry.y + maxY })),
      ];
    }
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
