/**
 * @file DashboardToolbar.jsx
 * @summary DashboardToolbar -- the title row + edit/save/cancel/customize controls
 * shown above the widget grid.
 *
 * Pulled out of DashboardPage so the page can stay focused on data
 * orchestration. Pure presentational component -- all state lives in
 * the parent.
 */

import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SaveIcon from "@mui/icons-material/Save";
import WidgetsIcon from "@mui/icons-material/Widgets";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";

/**
 * @param {object}   props
 * @param {boolean}  props.isEditing     True when the user is mid-customize.
 * @param {() => void} props.onStartEditing
 * @param {() => void} props.onSave
 * @param {() => void} props.onCancel
 * @param {() => void} props.onOpenCatalog
 * @param {boolean}  props.isComparisonModeActive  Whether comparison view is on.
 * @param {() => void} props.onToggleComparisonMode
 * @param {Array<object>} props.allChallenges
 * @param {Array<string|number>} props.selectedChallengeIds
 * @param {(id: string|number) => void} props.onToggleChallenge
 */
export default function DashboardToolbar({
  isEditing,
  onStartEditing,
  onSave,
  onCancel,
  onOpenCatalog,
  isComparisonModeActive = false,
  onToggleComparisonMode,
  allChallenges = [],
  selectedChallengeIds = [],
  onToggleChallenge,
  onClearFilters,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" }, mr: "auto" }}
      >
        Dashboard
      </Typography>

      {isEditing ? (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Chip label="Editing Layout" color="primary" size="small" />
          <Button
            size="small"
            variant="outlined"
            startIcon={<WidgetsIcon />}
            onClick={onOpenCatalog}
          >
            Widgets
          </Button>
          <Button
            size="small"
            variant={isComparisonModeActive ? "contained" : "outlined"}
            startIcon={<CompareArrowsIcon />}
            endIcon={<KeyboardArrowDownIcon />}
            onClick={handleMenuClick}
          >
            Compare
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                onToggleComparisonMode();
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    color="primary"
                    checked={isComparisonModeActive}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleComparisonMode();
                    }}
                    onClick={(e) => e.stopPropagation()}
                    disabled={selectedChallengeIds.length <= 1}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight={600}>
                    Activate Comparison View
                  </Typography>
                }
                sx={{ m: 0, width: "100%" }}
              />
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />

            {allChallenges.map((challenge) => {
              const isSelected = selectedChallengeIds.includes(challenge.id);
              return (
                <MenuItem
                  key={challenge.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleChallenge(challenge.id);
                  }}
                  sx={{ py: 0.5, px: 2 }}
                >
                  <Switch
                    size="small"
                    color="success"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleChallenge(challenge.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" noWrap>
                    {challenge.name}
                  </Typography>
                </MenuItem>
              );
            })}

            {selectedChallengeIds.length > 0 && (
              <Box sx={{ p: 1, pt: 2 }}>
                <Button
                  fullWidth
                  size="small"
                  variant="text"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onClearFilters) onClearFilters();
                  }}
                >
                  Clear All
                </Button>
              </Box>
            )}
          </Menu>
          <Button size="small" variant="contained" startIcon={<SaveIcon />} onClick={onSave}>
            Save
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<CloseIcon />}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Stack>
      ) : (
        <Tooltip title="Rearrange, resize, and choose which widgets appear on your dashboard" arrow>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DashboardCustomizeIcon />}
            onClick={onStartEditing}
          >
            Customize
          </Button>
        </Tooltip>
      )}
    </Box>
  );
}
