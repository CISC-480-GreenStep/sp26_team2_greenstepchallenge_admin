/**
 * @file PresetFieldsSection.jsx
 * @summary Preset metadata fields (name, description, category, theme).
 *
 * Pure controlled component: parent owns the form state and re-renders
 * us with the latest values. Mirrors `ChallengeFieldsSection` so the two
 * forms stay visually aligned.
 */

import { Grid, MenuItem, TextField } from "@mui/material";

import { ACTIONS } from "../../../data/api";

/**
 * @param {object} props
 * @param {{ name: string, description: string, category: string, theme: string }} props.form
 * @param {(field: string) => (e: React.ChangeEvent) => void} props.onChange
 *   Curried change handler from the parent (matches existing PresetForm pattern).
 */
export default function PresetFieldsSection({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Preset Name"
          value={form.name}
          onChange={onChange("name")}
          required
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Description"
          value={form.description}
          onChange={onChange("description")}
          multiline
          rows={3}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Category"
          select
          value={form.category}
          onChange={onChange("category")}
          fullWidth
        >
          {ACTIONS.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Theme Color"
          type="color"
          value={form.theme}
          onChange={onChange("theme")}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  );
}
