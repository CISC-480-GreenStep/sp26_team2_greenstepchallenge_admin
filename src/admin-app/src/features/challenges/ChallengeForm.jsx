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
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import {
  ACTIONS,
  CHALLENGE_STATUSES,
  createAction,
  createChallenge,
  getActionsByChallenge,
  getChallengeById,
  getGroups,
  getTemplates,
  logActivity,
  updateChallenge,
} from "../../data/api";
import { useAuth } from "../auth/useAuth";
import ActionsEditor from "./components/ActionsEditor";
import ChallengeFieldsSection from "./components/ChallengeFieldsSection";
import TemplatePicker from "./components/TemplatePicker";

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
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [templateActions, setTemplateActions] = useState([]);

  useEffect(() => {
    getGroups().then(setGroups);
    getTemplates().then(setTemplates);
    if (isEdit) {
      const cid = Number(id);
      getChallengeById(cid).then((c) => {
        if (c) setForm(c);
      });
      getActionsByChallenge(cid).then(setActions);
    }
  }, [id, isEdit]);

  const handleApplyTemplate = (e) => {
    const pid = e.target.value;
    setSelectedTemplateId(pid);
    const template = templates.find((p) => p.id === pid);
    if (!template) {
      setTemplateActions([]);
      return;
    }
    setForm((prev) => ({
      ...prev,
      name: template.name,
      description: template.description,
      category: template.categories?.[0] || prev.category,
      theme: template.theme,
      status: template.status || prev.status,
    }));
    setTemplateActions(template.actions || []);
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

    // If the user picked a template, materialize each template action into
    // a real action row and wire it to the new challenge.
    if (templateActions.length > 0) {
      const newActionIds = [];
      for (const tmpl of templateActions) {
        // We strip the ID if it's a global action so it creates a duplicate for the challenge,
        // or we just reuse the ID if the backend is updated.
        // For now, we reuse the existing ID if it has one (global action), else create new.
        if (tmpl.id) {
          newActionIds.push(tmpl.id);
        } else {
          const newAction = await createAction({ ...tmpl });
          newActionIds.push(newAction.id);
        }
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

      <Paper sx={{ p: { xs: 2, sm: 3 }, maxWidth: 700, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          {!isEdit && (
            <Box mb={2}>
              <TemplatePicker
                templates={templates}
                selectedTemplateId={selectedTemplateId}
                onSelect={handleApplyTemplate}
                templateActions={templateActions}
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

      {isEdit && (
        <ActionsEditor challengeId={Number(id)} actions={actions} onChanged={reloadActions} />
      )}
    </Box>
  );
}
