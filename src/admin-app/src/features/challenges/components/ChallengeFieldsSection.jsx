/**
 * @file ChallengeFieldsSection.jsx
 * @summary ChallengeFieldsSection -- the grid of TextFields shared by both the
 * create and edit flows of ChallengeForm.
 *
 * Pure presentational. The parent owns `form` state and supplies a
 * curried `onChange(field) => handler` so this component doesn't need
 * to know how the parent stores it.
 */

import { Checkbox, FormControlLabel, FormGroup, FormLabel, Grid, MenuItem, TextField } from "@mui/material";

import { CHALLENGE_STATUSES, fetchAllCategories } from "../../../data/api";

/**
 * @param {object} props
 * @param {object} props.form Current form values.
 * @param {(field: string) => (event: React.ChangeEvent<HTMLInputElement>) => void} props.onChange
 * @param {Array<{ id: number, name: string }>} props.groups
 */
export default function ChallengeFieldsSection({ form, onChange, groups }) {
  const categories = fetchAllCategories();

  const handleCategoryChange = (category) => (e) => {
    const isChecked = e.target.checked;
    let nextCategories = [...(form.categories || [])];
    if (isChecked) {
      if (!nextCategories.includes(category)) nextCategories.push(category);
    } else {
      nextCategories = nextCategories.filter((c) => c !== category);
    }
    onChange("categories")({ target: { value: nextCategories } });
  };

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

      <Grid size={{ xs: 12 }}>
        <FormLabel component="legend" sx={{ mb: 1 }}>Categories</FormLabel>
        <FormGroup row>
          {categories.map((c) => (
            <FormControlLabel
              key={c}
              control={
                <Checkbox
                  checked={(form.categories || []).includes(c)}
                  onChange={handleCategoryChange(c)}
                />
              }
              label={c}
            />
          ))}
        </FormGroup>
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

      <Grid container spacing={2} >
        {/* Header Background Color */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Header Background Color"
            type="color"
            value={form.bgColorHeader}
            onChange={onChange("bgColorHeader")}
            fullWidth
            InputLabelProps={{ shrink: true }}
            slotProps={{
              htmlInput: {
                style: { width: '200px', cursor: 'pointer' }
              }
            }}
          />
        </Grid>

        {/* Header Text Color */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Header Text Color"
            type="color"
            value={form.txColorHeader}
            onChange={onChange("txColorHeader")}
            fullWidth
            InputLabelProps={{ shrink: true }}
            slotProps={{
              htmlInput: {
                style: { width: '200px', cursor: 'pointer' }
              }
            }}
          />
        </Grid>

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

      <Grid container spacing={2} >
        {/* Body Background Color */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Body Background Color"
            type="color"
            value={form.bgColorBody}
            onChange={onChange("bgColorBody")}
            fullWidth
            InputLabelProps={{ shrink: true }}
            slotProps={{
              htmlInput: {
                style: { width: '200px', cursor: 'pointer' }
              }
            }}
          />
        </Grid>

        {/* Body Text Color */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Body Text Color"
            type="color"
            value={form.txColorBody}
            onChange={onChange("txColorBody")}
            fullWidth
            InputLabelProps={{ shrink: true }}
            slotProps={{
              htmlInput: {
                style: { width: '200px', cursor: 'pointer' }
              }
            }}
          />
        </Grid>


      </Grid>
    </Grid>
  );
}
