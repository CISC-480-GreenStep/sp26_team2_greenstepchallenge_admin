import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography, TextField, Button, Stack, Paper, Grid } from "@mui/material";

import { getGroupById, createGroup, updateGroup } from "../../data/api";

const EMPTY = { name: "", description: "" };

export default function GroupForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (isEdit) {
      getGroupById(Number(id)).then((g) => {
        if (g) setForm(g);
      });
    }
  }, [id, isEdit]);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await updateGroup(Number(id), { name: form.name, description: form.description });
    } else {
      await createGroup({ name: form.name, description: form.description });
    }
    navigate("/groups");
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
        sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
      >
        {isEdit ? "Edit Group" : "Create Group"}
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 }, maxWidth: 500 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Group Name"
                value={form.name}
                onChange={handleChange("name")}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                value={form.description}
                onChange={handleChange("description")}
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} mt={3}>
            <Button type="submit" variant="contained">
              {isEdit ? "Save Changes" : "Create Group"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/groups")}>
              Cancel
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
