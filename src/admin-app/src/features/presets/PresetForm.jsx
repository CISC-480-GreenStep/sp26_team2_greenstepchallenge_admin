/**
 * @file PresetForm.jsx
 * @summary Create / edit screen for a challenge preset.
 *
 * Owns:
 *   - the preset metadata form state (`form`),
 *   - the in-memory list of action templates (`actions`),
 *   - the create/update submit pipeline.
 *
 * Field rendering and the actions editor live in sibling components
 * (`PresetFieldsSection`, `PresetActionsEditor`). The action dialog UI
 * is shared with the challenge form via `ActionFormDialog`.
 */

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";


import PresetActionsEditor from "./components/PresetActionsEditor";
import PresetFieldsSection from "./components/PresetFieldsSection";
import { ACTIONS, createPreset, getPresetById, updatePreset } from "../../data/api";

const EMPTY_FORM = {
  name: "",
  description: "",
  category: ACTIONS[0],
  theme: "#4CAF50",
  status: "Upcoming",
};

export default function PresetForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    if (!isEdit) return;
    getPresetById(Number(id)).then((p) => {
      if (!p) return;
      setForm({
        name: p.name,
        description: p.description,
        category: p.category,
        theme: p.theme,
        status: p.status,
      });
      setActions(p.actions || []);
    });
  }, [id, isEdit]);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, actions };
    if (isEdit) {
      await updatePreset(Number(id), payload);
    } else {
      await createPreset(payload);
    }
    navigate("/presets");
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
        {isEdit ? "Edit Preset" : "Create Preset"}
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 }, maxWidth: 700, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <PresetFieldsSection form={form} onChange={handleChange} />

          <PresetActionsEditor actions={actions} onChange={setActions} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button type="submit" variant="contained" sx={{ width: { xs: "100%", sm: "auto" } }}>
              {isEdit ? "Save Changes" : "Create Preset"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/presets")}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
