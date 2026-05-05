/**
 * @file TemplateFieldsSection.jsx
 * @summary Template metadata fields (name, description, categories, theme).
 */

import { Box, Button, Checkbox, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function TemplateFieldsSection({ form, onChange, categories = [], onAddCategoryClick }) {

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
        <Box sx={{ maxHeight: 250, overflowY: "auto", border: "1px solid", borderColor: "divider", p: 1, borderRadius: 1, mb: 1 }}>
          <FormGroup row>
            {categories.map((c) => (
              <FormControlLabel
                key={c.id}
                control={
                  <Checkbox
                    checked={(form.categories || []).includes(c.name)}
                    onChange={handleCategoryChange(c.name)}
                  />
                }
                label={c.name}
              />
            ))}
          </FormGroup>
        </Box>
        <Button size="small" startIcon={<AddIcon />} onClick={onAddCategoryClick}>
          Create New Category
        </Button>
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
