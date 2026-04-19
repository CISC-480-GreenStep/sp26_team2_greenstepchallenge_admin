/**
 * @file DashboardPage.jsx
 * @summary DashboardPage -- the customizable widget grid landing page.
 *
 * Responsibilities (intentionally thin):
 *   - Hold UI-only state (catalog drawer open, snackbar, comparison toggle).
 *   - Pull aggregated `stats` from useDashboardStats.
 *   - Pull layout / edit-mode state from useDashboardLayout.
 *   - Render the toolbar, banners, grid (or comparison view), and catalog.
 *
 * All the heavy data-shaping lives in hooks/useDashboardStats.js; the
 * widget-id -> component lookup lives in components/widgetRenderer.jsx.
 */

import { useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  FormControlLabel,
  Paper,
  Snackbar,
  Switch,
  Typography,
} from "@mui/material";

import ComparisonMode from "./ComparisonMode";
import DashboardToolbar from "./components/DashboardToolbar";
import { renderWidget } from "./components/widgetRenderer";
import DashboardGrid from "./DashboardGrid";
import useDashboardLayout from "./hooks/useDashboardLayout";
import useDashboardStats from "./hooks/useDashboardStats";
import WidgetCatalog from "./WidgetCatalog";

const SNACKBAR_DURATION_MS = 3000;

export default function DashboardPage() {
  const [selectedChallengeIds, setSelectedChallengeIds] = useState([]);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [isComparisonModeActive, setIsComparisonModeActive] = useState(false);

  const { stats, allChallenges, error } = useDashboardStats(selectedChallengeIds);
  const {
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
  } = useDashboardLayout();

  const handleSave = () => {
    saveLayout();
    setSnackbar("Dashboard layout saved!");
  };

  const handleApplyPreset = (presetId) => {
    applyPreset(presetId);
    setSnackbar("Layout preset applied \u2014 drag to customize further");
  };

  const handleReset = () => {
    resetToDefault();
    setCatalogOpen(false);
    setSnackbar("Dashboard reset to default layout");
  };

  // When the user drops below 2 selected challenges, comparison mode
  // has nothing to compare -- reset the toggle so the UI matches reality.
  const handleToggleChallenge = (id) => {
    setSelectedChallengeIds((prev) => {
      const next = prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id];
      if (next.length <= 1) setIsComparisonModeActive(false);
      return next;
    });
  };

  const handleClearFilters = () => {
    setSelectedChallengeIds([]);
    setIsComparisonModeActive(false);
  };

  if (!stats) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const isComparisonActive = selectedChallengeIds.length > 1 && isComparisonModeActive;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DashboardToolbar
        isEditing={isEditing}
        onStartEditing={startEditing}
        onSave={handleSave}
        onCancel={cancelEditing}
        onOpenCatalog={() => setCatalogOpen(true)}
      />

      {isEditing && (
        <Alert severity="info" sx={{ mb: 2 }} icon={false}>
          <strong>Drag</strong> widgets by their title bar to rearrange &bull;{" "}
          <strong>Resize</strong> from the bottom-right corner &bull; Click <strong>Widgets</strong>{" "}
          to add, remove, or apply a preset layout
        </Alert>
      )}

      {isComparisonActive && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Comparison Mode Active:</strong> Data is currently normalized to "Days Since
          Launch" for accurate head-to-head comparison.
        </Alert>
      )}

      {selectedChallengeIds.length > 1 && (
        <Paper
          sx={{
            mb: 2,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "background.paper",
          }}
        >
          <Typography fontWeight={600}>
            Comparing {selectedChallengeIds.length} Selected Challenges
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isComparisonModeActive}
                onChange={(e) => setIsComparisonModeActive(e.target.checked)}
                color="primary"
              />
            }
            label="Comparison Mode"
            sx={{ m: 0 }}
          />
        </Paper>
      )}

      {isComparisonActive ? (
        <ComparisonMode
          stats={stats}
          challenges={allChallenges}
          selectedChallengeIds={selectedChallengeIds}
        />
      ) : (
        <DashboardGrid
          visible={visible}
          layouts={layouts}
          isEditing={isEditing}
          onLayoutChange={onLayoutChange}
          onRemoveWidget={toggleWidget}
          renderWidget={(id) => renderWidget(id, stats)}
        />
      )}

      <WidgetCatalog
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        visible={visible}
        onToggle={toggleWidget}
        onApplyPreset={handleApplyPreset}
        onReset={handleReset}
        challenges={allChallenges}
        selectedChallengeIds={selectedChallengeIds}
        onToggleChallenge={handleToggleChallenge}
        onClearFilters={handleClearFilters}
        isComparisonModeActive={isComparisonModeActive}
        setIsComparisonModeActive={setIsComparisonModeActive}
      />

      <Snackbar
        open={!!snackbar}
        autoHideDuration={SNACKBAR_DURATION_MS}
        onClose={() => setSnackbar(null)}
        message={snackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
