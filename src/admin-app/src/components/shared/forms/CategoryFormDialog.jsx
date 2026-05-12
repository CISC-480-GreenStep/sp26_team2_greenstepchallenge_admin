/**
 * @file CategoryFormDialog.jsx
 * @summary Modal form for creating or editing a single category.
 */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {boolean} props.isEdit - When true, render "Edit" labels instead of "Add".
 * @param {{ name: string, description: string }} props.categoryForm
 * @param {(next: object) => void} props.onChange - Receives the next form value (already merged).
 * @param {() => void} props.onCancel
 * @param {() => void} props.onSave
 */
export default function CategoryFormDialog({ open, isEdit, categoryForm, onChange, onCancel, onSave }) {
  const patch = (key, value) => onChange({ ...categoryForm, [key]: value });

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Category Name"
            value={categoryForm.name}
            onChange={(e) => patch("name", e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={categoryForm.description}
            onChange={(e) => patch("description", e.target.value)}
            multiline
            rows={2}
            fullWidth
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
