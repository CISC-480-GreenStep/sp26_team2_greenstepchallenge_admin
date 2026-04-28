/**
 * @file TemplateFieldsSection.jsx
 * @summary Template metadata fields (name, description, categories, theme).
 */

import { Checkbox, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material";
import { fetchAllCategories } from "../../../data/api";

export default function TemplateFieldsSection({ form, onChange }) {
  const categories = fetchAllCategories();

  const handleCategoryChange = (category) => (e) => {
    const isChecked = e.target.checked;
    let nextCategories = [...(form.categories || [])];
    if (isChecked) {
      if (!nextCategories.includes(category)) nextCategories.push(category);
    } else {
      nextCategories = nextCategories.filter((c) => c !== category);
    }
    // We simulate the same event structure that onChange expects
    onChange("categories")({ target: { value: nextCategories } });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Template Name"
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
