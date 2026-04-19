/**
 * @file CatalogChallengeFilter.jsx
 * @summary "Filter Data by Challenge" + Comparison Mode toggle section
 * of the WidgetCatalog drawer.
 *
 * Owns no state -- the parent passes both the visible challenge list
 * and the controlled selection. Comparison Mode is disabled until the
 * user has picked at least 2 challenges so the chart has something to
 * actually compare.
 */

import {
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";

export default function CatalogChallengeFilter({
  challenges,
  selectedChallengeIds,
  onToggleChallenge,
  onClearFilters,
  isComparisonModeActive,
  setIsComparisonModeActive,
}) {
  return (
    <Box
      sx={{
        px: 2,
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "action.hover",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Filter Data by Challenge
        </Typography>
        {selectedChallengeIds.length > 0 && (
          <Button size="small" onClick={onClearFilters} sx={{ fontSize: "0.7rem" }}>
            Clear
          </Button>
        )}
      </Box>
      <Stack spacing={0.5} sx={{ maxHeight: 200, overflowY: "auto" }}>
        {challenges.map((c) => (
          <Box
            key={c.id}
            onClick={() => onToggleChallenge(c.id)}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 0.5,
              cursor: "pointer",
              borderRadius: 1,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <Switch size="small" checked={selectedChallengeIds.includes(c.id)} color="success" />
            <Typography variant="body2" sx={{ flex: 1, ml: 1 }}>
              {c.name}
            </Typography>
            {c.status === "Upcoming" && (
              <Chip
                label="Upcoming"
                size="small"
                color="info"
                variant="outlined"
                sx={{ height: 16, fontSize: "0.6rem", mr: 0.5 }}
              />
            )}
            {(c.status === "Completed" || c.status === "Archived") && (
              <Chip
                label="Ended"
                size="small"
                variant="outlined"
                sx={{ height: 16, fontSize: "0.6rem" }}
              />
            )}
          </Box>
        ))}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Tooltip title="Select 2 or more challenges to enable Comparison Mode" arrow placement="top">
        <Box>
          <FormControlLabel
            control={
              <Switch
                size="small"
                color="primary"
                checked={isComparisonModeActive}
                onChange={(e) => setIsComparisonModeActive(e.target.checked)}
                disabled={selectedChallengeIds.length <= 1}
              />
            }
            label={
              <Typography variant="body2" fontWeight={600}>
                Comparison Mode
              </Typography>
            }
          />
        </Box>
      </Tooltip>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
        Replaces the standard dashboard with a head-to-head analysis.
      </Typography>
    </Box>
  );
}
