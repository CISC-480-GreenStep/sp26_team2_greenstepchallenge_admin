/**
 * @file PresetPicker.jsx
 * @summary PresetPicker -- "Quick Start: Select a Template" panel shown only on
 * the create flow. Picking a preset pre-fills the challenge fields and
 * stages a list of action templates to create on submit.
 *
 * Pure presentational; the parent owns the form/preset state.
 */

import {
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

/**
 * @param {object}   props
 * @param {Array<{ id: string, name: string, category: string, actions?: Array<object> }>} props.presets
 * @param {string}   props.selectedPresetId
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onSelect
 * @param {Array<{ name: string, category: string, points: number }>} props.presetActions
 */
export default function PresetPicker({ presets, selectedPresetId, onSelect, presetActions }) {
  if (!presets.length) return null;

  return (
    <>
      <Paper variant="outlined" sx={{ p: 2, mb: 1, bgcolor: "#f9f9f9" }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Quick Start: Select a Template
        </Typography>
        <TextField
          select
          fullWidth
          size="small"
          value={selectedPresetId}
          onChange={onSelect}
          label="Choose a Preset"
        >
          <MenuItem value="">None</MenuItem>
          {presets.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name} ({p.category})
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {presetActions.length > 0 && <PresetActionsPreview actions={presetActions} />}
    </>
  );
}

/**
 * Preview table of the actions the preset will spawn after submit.
 * Kept here (not its own file) because it has no other consumer.
 */
function PresetActionsPreview({ actions }) {
  return (
    <>
      <Typography variant="subtitle2" fontWeight={600} mt={2} mb={1}>
        Actions from Preset ({actions.length})
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
        These actions will be created automatically when you submit.
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actions.map((a, i) => (
              <TableRow key={i}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.category}</TableCell>
                <TableCell align="right">{a.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
