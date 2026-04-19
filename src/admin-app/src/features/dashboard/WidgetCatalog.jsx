/**
 * @file WidgetCatalog.jsx
 * @summary Side drawer that lets admins toggle which widgets are visible
 * on the dashboard, filter data by challenge, and apply named layout presets.
 *
 * Pure orchestrator: composes the four section components and forwards
 * each callback up to DashboardPage. Drawer chrome and the reset button
 * stay here so the section components don't need to know about the
 * surrounding layout.
 */

import CloseIcon from "@mui/icons-material/Close";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";

import CatalogChallengeFilter from "./components/catalog/CatalogChallengeFilter";
import CatalogPresets from "./components/catalog/CatalogPresets";
import CatalogWidgetList from "./components/catalog/CatalogWidgetList";

export default function WidgetCatalog({
  open,
  onClose,
  visible,
  onToggle,
  onApplyPreset,
  onReset,
  challenges = [],
  selectedChallengeIds = [],
  onToggleChallenge,
  onClearFilters,
  isComparisonModeActive,
  setIsComparisonModeActive,
}) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 380 }, display: "flex", flexDirection: "column" },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <DashboardCustomizeIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" fontWeight={700} flex={1}>
          Widget Library
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <CatalogPresets onApplyPreset={onApplyPreset} />

      <CatalogChallengeFilter
        challenges={challenges}
        selectedChallengeIds={selectedChallengeIds}
        onToggleChallenge={onToggleChallenge}
        onClearFilters={onClearFilters}
        isComparisonModeActive={isComparisonModeActive}
        setIsComparisonModeActive={setIsComparisonModeActive}
      />

      <CatalogWidgetList visible={visible} onToggle={onToggle} />

      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Button
          fullWidth
          variant="outlined"
          color="warning"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
        >
          Reset to Default Layout
        </Button>
      </Box>
    </Drawer>
  );
}
