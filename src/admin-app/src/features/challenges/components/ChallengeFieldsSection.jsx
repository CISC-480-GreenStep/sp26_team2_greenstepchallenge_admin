/**
 * ChallengeFieldsSection -- the grid of TextFields shared by both the
 * create and edit flows of ChallengeForm.
 *
 * Pure presentational. The parent owns `form` state and supplies a
 * curried `onChange(field) => handler` so this component doesn't need
 * to know how the parent stores it.
 */

import { Grid, MenuItem, TextField } from "@mui/material";

import { CATEGORIES, CHALLENGE_STATUSES } from "../../../data/api";

/**
 * @param {object} props
 * @param {object} props.form Current form values.
 * @param {(field: string) => (event: React.ChangeEvent<HTMLInputElement>) => void} props.onChange
 * @param {Array<{ id: number, name: string }>} props.groups
 */
export default function ChallengeFieldsSection({ form, onChange, groups }) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Challenge Name"
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
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Status"
          select
          value={form.status}
          onChange={onChange("status")}
          fullWidth
        >
          {Object.values(CHALLENGE_STATUSES).map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Start Date"
          type="date"
          value={form.startDate}
          onChange={onChange("startDate")}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="End Date"
          type="date"
          value={form.endDate}
          onChange={onChange("endDate")}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
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

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Group"
          select
          value={form.groupId || ""}
          onChange={onChange("groupId")}
          fullWidth
        >
          <MenuItem value="">No Group</MenuItem>
          {groups.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
}
