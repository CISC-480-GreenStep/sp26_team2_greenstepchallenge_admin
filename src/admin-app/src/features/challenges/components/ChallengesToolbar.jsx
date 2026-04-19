/**
 * @file ChallengesToolbar.jsx
 * @summary Page header row for the Challenges list.
 *
 * Renders the page title plus action buttons (CSV export, Manage Presets,
 * New Challenge). Edit-only buttons are gated by the `canEdit` prop so
 * the parent owns role-resolution.
 */

import AddIcon from "@mui/icons-material/Add";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Box, Typography, Button, Stack } from "@mui/material";

import { CSVExport } from "../../../components/shared/data";

/**
 * @param {object} props
 * @param {object[]} props.exportData - Rows passed to the CSV export button.
 * @param {boolean} props.canEdit - When true, render the management buttons.
 * @param {() => void} props.onManagePresets - Callback for the "Manage Presets" button.
 * @param {() => void} props.onNewChallenge - Callback for the "New Challenge" button.
 */
export default function ChallengesToolbar({
  exportData,
  canEdit,
  onManagePresets,
  onNewChallenge,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        flexWrap: "wrap",
        gap: 1.5,
      }}
    >
      <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
        Challenges
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <CSVExport data={exportData} filename="challenges.csv" />
        {canEdit && (
          <>
            <Button variant="outlined" startIcon={<BookmarkIcon />} onClick={onManagePresets}>
              Manage Presets
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onNewChallenge}>
              New Challenge
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
