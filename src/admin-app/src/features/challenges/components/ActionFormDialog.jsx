/**
 * @file ActionFormDialog.jsx
 * @summary Modal form for creating or editing a single action template.
 *
 * Used by both `ActionsEditor` (challenges) and `PresetActionsEditor`
 * (presets) so the field set, validation, and labels stay in lock-step
 * across the two surfaces.
 *
 * Controlled component: parent owns `actionForm`, `onChange`, `onSave`,
 * and `onCancel`. The parent decides whether the save means "POST a new
 * row" or "mutate an in-memory array".
 */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { ACTIONS } from "../../../data/api";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {boolean} props.isEdit - When true, render "Edit" labels instead of "Add".
 * @param {{ name: string, description: string, category: string, points: number }} props.actionForm
 * @param {(next: object) => void} props.onChange - Receives the next form value (already merged).
 * @param {() => void} props.onCancel
 * @param {() => void} props.onSave
 */
export default function ActionFormDialog({
  open,
  isEdit,
  actionForm,
  onChange,
  onCancel,
  onSave,
}) {
  const patch = (key, value) => onChange({ ...actionForm, [key]: value });

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Action" : "Add Action"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Action Name"
            value={actionForm.name}
            onChange={(e) => patch("name", e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={actionForm.description}
            onChange={(e) => patch("description", e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
          <TextField
            label="Category"
            select
            value={actionForm.category}
            onChange={(e) => patch("category", e.target.value)}
            fullWidth
          >
            {ACTIONS.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Points"
            type="number"
            value={actionForm.points}
            onChange={(e) => patch("points", Number(e.target.value))}
            fullWidth
            inputProps={{ min: 1 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          {isEdit ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
