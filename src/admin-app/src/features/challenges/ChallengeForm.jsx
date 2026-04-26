/**
 * @file ChallengeForm.jsx
 * @summary ChallengeForm -- create or edit a challenge.
 *
 * Renders three sub-views, all under one route:
 *   - PresetPicker: only on create, lets the user pre-fill from a template
 *   - ChallengeFieldsSection: the field grid
 *   - ActionsEditor: only on edit, manages the challenge's actions
 *
 * This component owns the form state and the submit pipeline; the
 * sub-components are pure presentational.
 */

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";

import { MobilePreview } from "../../components/shared/preview";
import { useAuth } from "../auth/useAuth";
import ActionsEditor from "./components/ActionsEditor";
import ChallengeFieldsSection from "./components/ChallengeFieldsSection";
import PresetPicker from "./components/PresetPicker";
import {
  ACTIONS,
  CHALLENGE_STATUSES,
  createAction,
  createChallenge,
  getActionsByChallenge,
  getChallengeById,
  getGroups,
  getPresets,
  logActivity,
  updateChallenge,
} from "../../data/api";

const EMPTY_FORM = {
  name: "",
  description: "",
  category: ACTIONS[0],
  theme: "#4CAF50",
  startDate: "",
  endDate: "",
  status: CHALLENGE_STATUSES.UPCOMING,
  groupId: "",
};

export default function ChallengeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [actions, setActions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [presetActions, setPresetActions] = useState([]);

  // Edit mode shows the saved actions; create mode shows whatever the
  // selected preset would seed (empty list when no preset is picked).
  const previewActions = isEdit ? actions : presetActions;

  useEffect(() => {
    getGroups().then(setGroups);
    getPresets().then(setPresets);
    if (isEdit) {
      const cid = Number(id);
      getChallengeById(cid).then((c) => {
        if (c) setForm(c);
      });
      getActionsByChallenge(cid).then(setActions);
    }
  }, [id, isEdit]);

  const handleApplyPreset = (e) => {
    const pid = e.target.value;
    setSelectedPresetId(pid);
    const preset = presets.find((p) => p.id === pid);
    if (!preset) {
      setPresetActions([]);
      return;
    }
    setForm((prev) => ({
      ...prev,
      name: preset.name,
      description: preset.description,
      category: preset.category,
      theme: preset.theme,
      status: preset.status || prev.status,
    }));
    setPresetActions(preset.actions || []);
  };

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, groupId: form.groupId || null };

    if (isEdit) {
      await updateChallenge(Number(id), payload);
      await logActivity(user.id, "Updated challenge", `Updated ${payload.name}`);
      navigate("/challenges");
      return;
    }

    const newChallenge = await createChallenge({
      ...payload,
      createdBy: user.id,
      actionIds: [],
      participants: [],
      joinBy: null,
    });

    // If the user picked a preset, materialize each template action into
    // a real action row and wire it to the new challenge.
    if (presetActions.length > 0) {
      const newActionIds = [];
      for (const tmpl of presetActions) {
        const newAction = await createAction({ ...tmpl });
        newActionIds.push(newAction.id);
      }
      await updateChallenge(newChallenge.id, { actionIds: newActionIds });
    }

    await logActivity(user.id, "Created challenge", `Created ${payload.name}`);
    navigate("/challenges");
  };

  const reloadActions = async () => {
    if (isEdit) setActions(await getActionsByChallenge(Number(id)));
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
        {isEdit ? "Edit Challenge" : "Create Challenge"}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <form onSubmit={handleSubmit}>
              {!isEdit && (
                <Box mb={2}>
                  <PresetPicker
                    presets={presets}
                    selectedPresetId={selectedPresetId}
                    onSelect={handleApplyPreset}
                    presetActions={presetActions}
                  />
                </Box>
              )}

              <ChallengeFieldsSection form={form} onChange={handleChange} groups={groups} />

              <Stack direction="row" spacing={2} mt={3}>
                <Button type="submit" variant="contained">
                  {isEdit ? "Save Changes" : "Create Challenge"}
                </Button>
                <Button variant="outlined" onClick={() => navigate("/challenges")}>
                  Cancel
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* Live preview hidden on small screens — the phone frame eats too
            much width below md. Could stack instead later if the team
            wants it visible on mobile too. */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: "none", md: "block" } }}>
          <Box sx={{ position: "sticky", top: 80 }}>
            <MobilePreview challenge={form} actions={previewActions} />
          </Box>
        </Grid>
      </Grid>

      {isEdit && (
        <ActionsEditor challengeId={Number(id)} actions={actions} onChanged={reloadActions} />
      )}
    </Box>
  );
}
