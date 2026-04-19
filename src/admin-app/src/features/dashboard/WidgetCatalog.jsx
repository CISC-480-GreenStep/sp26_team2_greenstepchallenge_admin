import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Switch,
  Chip,
  Button,
  Stack,
  Tooltip,
  InputAdornment,
  alpha,
  Divider,
  FormControlLabel,
} from "@mui/material";

import { WIDGETS, WIDGET_CATEGORIES, LAYOUT_PRESETS } from "./dashboardConfig";

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
  const [search, setSearch] = useState("");

  const filtered = WIDGETS.filter(
    (w) =>
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase()),
  );

  const categories = Object.entries(WIDGET_CATEGORIES).sort(([, a], [, b]) => a.order - b.order);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 380 }, display: "flex", flexDirection: "column" },
      }}
    >
      {/* ── Header ── */}
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

      {/* ── Quick Layout Presets ── */}
      <Box sx={{ px: 2, pt: 2, pb: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Quick Layouts
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
          Apply a preset layout — you can customize it further after applying.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {LAYOUT_PRESETS.map((preset) => (
            <Tooltip key={preset.id} title={preset.description} arrow>
              <Chip
                label={preset.name}
                onClick={() => onApplyPreset(preset.id)}
                variant="outlined"
                color="primary"
                clickable
                sx={{ mb: 0.5 }}
              />
            </Tooltip>
          ))}
        </Stack>
      </Box>

      {/* ── Challenge Selection Checklist ── */}
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
        <Tooltip
          title="Select 2 or more challenges to enable Comparison Mode"
          arrow
          placement="top"
        >
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

      {/* ── Search ── */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <TextField
          placeholder="Search widgets..."
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* ── Widget list grouped by category ── */}
      <Box sx={{ flex: 1, overflow: "auto", px: 2, pb: 2 }}>
        {categories.map(([catId, catInfo]) => {
          const catWidgets = filtered.filter((w) => w.category === catId);
          if (catWidgets.length === 0) return null;

          const activeCount = catWidgets.filter((w) => visible.includes(w.id)).length;

          return (
            <Box key={catId} sx={{ mb: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="overline" color="text.secondary" flex={1}>
                  {catInfo.label}
                </Typography>
                <Chip
                  label={`${activeCount}/${catWidgets.length}`}
                  size="small"
                  color={activeCount > 0 ? "primary" : "default"}
                  variant={activeCount > 0 ? "filled" : "outlined"}
                  sx={{ fontSize: 11, height: 22 }}
                />
              </Box>

              <Stack spacing={0.5}>
                {catWidgets.map((widget) => {
                  const isActive = visible.includes(widget.id);
                  return (
                    <Box
                      key={widget.id}
                      onClick={() => onToggle(widget.id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: isActive ? "primary.light" : "divider",
                        bgcolor: isActive
                          ? (theme) => alpha(theme.palette.primary.main, 0.04)
                          : "transparent",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" fontWeight={500}>
                          {widget.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {widget.description}
                        </Typography>
                      </Box>
                      <Switch
                        size="small"
                        checked={isActive}
                        onChange={() => onToggle(widget.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          );
        })}

        {filtered.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
            No widgets match your search
          </Typography>
        )}
      </Box>

      {/* ── Footer ── */}
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
