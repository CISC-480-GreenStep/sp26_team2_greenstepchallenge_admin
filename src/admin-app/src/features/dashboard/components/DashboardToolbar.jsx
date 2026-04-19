/**
 * DashboardToolbar -- the title row + edit/save/cancel/customize controls
 * shown above the widget grid.
 *
 * Pulled out of DashboardPage so the page can stay focused on data
 * orchestration. Pure presentational component -- all state lives in
 * the parent.
 */

import CloseIcon from "@mui/icons-material/Close";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import SaveIcon from "@mui/icons-material/Save";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { Box, Button, Chip, Stack, Tooltip, Typography } from "@mui/material";

/**
 * @param {object}   props
 * @param {boolean}  props.isEditing     True when the user is mid-customize.
 * @param {() => void} props.onStartEditing
 * @param {() => void} props.onSave
 * @param {() => void} props.onCancel
 * @param {() => void} props.onOpenCatalog
 */
export default function DashboardToolbar({
  isEditing,
  onStartEditing,
  onSave,
  onCancel,
  onOpenCatalog,
}) {
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
        <Tooltip
          title="Rearrange, resize, and choose which widgets appear on your dashboard"
          arrow
        >
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
