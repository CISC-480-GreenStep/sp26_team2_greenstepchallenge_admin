/**
 * @file TemplateForm.jsx
 * @summary Create / edit screen for a challenge template.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Grid, Paper, Stack, Typography, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

import TemplateFieldsSection from "./components/TemplateFieldsSection";
import { ActionFormDialog, CategoryFormDialog } from "../../components/shared/forms";
import { MobilePreview } from "../../components/shared/preview";
import { createTemplate, getTemplateById, updateTemplate, getActions, createAction, getCategories, createCategory } from "../../data/api";

const EMPTY_TEMPLATE = {
  name: "",
  description: "",
  categories: [],
  bgColorHeader: "#4CAF50",
  txColorHeader: "#ffffff",
  bgColorBody: "#C8E6C9",
  txColorBody: "#000000",
  status: "Upcoming",
  actions: [],
};

const EMPTY_ACTION = { name: "", description: "", category: "", points: 5 };
const EMPTY_CATEGORY = { name: "", description: "" };

export default function TemplateForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [currentTemplate, setCurrentTemplate] = useState(EMPTY_TEMPLATE);
  const [globalActions, setGlobalActions] = useState([]);
  const [globalCategories, setGlobalCategories] = useState([]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionForm, setActionForm] = useState(EMPTY_ACTION);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);

  useEffect(() => {
    getCategories().then(setGlobalCategories);
    getActions().then(setGlobalActions);

    if (!isEdit) return;
    getTemplateById(Number(id)).then((p) => {
      if (!p) return;
      setCurrentTemplate({
        name: p.name,
        description: p.description,
        categories: p.categories || [],
        bgColorHeader: p.bgColorHeader || "#4CAF50",
        txColorHeader: p.txColorHeader || "#ffffff",
        bgColorBody: p.bgColorBody || "#C8E6C9",
        txColorBody: p.txColorBody || "#000000",
        status: p.status,
        actions: p.actions || [],
      });
    });
  }, [id, isEdit]);

  const handleChange = (field) => (e) => {
    setCurrentTemplate((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleActionToggle = (action) => (e) => {
    const isChecked = e.target.checked;
    setCurrentTemplate((prev) => {
      let nextActions = [...prev.actions];
      if (isChecked) {
        if (!nextActions.find(a => a.id === action.id)) {
          nextActions.push(action);
        }
      } else {
        nextActions = nextActions.filter(a => a.id !== action.id);
      }
      return { ...prev, actions: nextActions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await updateTemplate(Number(id), currentTemplate);
    } else {
      await createTemplate(currentTemplate);
    }
    navigate("/templates");
  };

  const handleCreateNewAction = async () => {
    const newAction = await createAction(actionForm);
    setGlobalActions((prev) => [...prev, newAction]);
    setCurrentTemplate((prev) => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
    setDialogOpen(false);
  };

  const handleCategoryCreated = async () => {
    const newCategory = await createCategory(categoryForm);
    setGlobalCategories((prev) => [...prev, newCategory]);
    // Optionally auto-select the new category
    setCurrentTemplate((prev) => ({
      ...prev,
      categories: [...(prev.categories || []), newCategory.name]
    }));
    setCategoryDialogOpen(false);
  };

  const availableActions = globalActions.filter(a => currentTemplate.categories.includes(a.category));

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Typography variant="h5" fontWeight={700} mb={3} sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
        {isEdit ? "Edit Template" : "Create Template"}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <form onSubmit={handleSubmit}>
              <TemplateFieldsSection 
                form={currentTemplate} 
                onChange={handleChange} 
                categories={globalCategories}
                onAddCategoryClick={() => { setCategoryForm(EMPTY_CATEGORY); setCategoryDialogOpen(true); }}
              />

              <Box mt={4}>
                <Typography variant="h6" fontWeight={600} mb={1}>Available Actions</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Select actions for this template. Only actions matching the selected categories are shown.
                </Typography>

                <Box sx={{ maxHeight: 300, overflowY: "auto", border: "1px solid", borderColor: "divider", p: 2, borderRadius: 1, mb: 2 }}>
                  {availableActions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No actions found for selected categories.</Typography>
                  ) : (
                    <FormGroup>
                      {availableActions.map((action) => (
                        <FormControlLabel
                          key={action.id}
                          control={
                            <Checkbox
                              checked={currentTemplate.actions.some(a => a.id === action.id)}
                              onChange={handleActionToggle(action)}
                            />
                          }
                          label={`${action.name} (${action.category} - ${action.points} pts)`}
                        />
                      ))}
                    </FormGroup>
                  )}
                </Box>

                <Button size="small" startIcon={<AddIcon />} onClick={() => { setActionForm(EMPTY_ACTION); setDialogOpen(true); }}>
                  Create New Global Action
                </Button>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
                <Button type="submit" variant="contained" sx={{ width: { xs: "100%", sm: "auto" } }}>
                  {isEdit ? "Save Changes" : "Create Template"}
                </Button>
                <Button variant="outlined" onClick={() => navigate("/templates")} sx={{ width: { xs: "100%", sm: "auto" } }}>
                  Cancel
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* Mirrors the live-preview pattern in ChallengeForm so the two
            authoring flows feel identical. Hidden below md for the same
            width-budget reason — see the matching note there. */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: "none", md: "block" } }}>
          <Box sx={{ position: "sticky", top: 80 }}>
            <MobilePreview challenge={currentTemplate} actions={currentTemplate.actions} />
          </Box>
        </Grid>
      </Grid>

      <ActionFormDialog
        open={dialogOpen}
        isEdit={false}
        actionForm={actionForm}
        categories={globalCategories}
        onChange={setActionForm}
        onCancel={() => setDialogOpen(false)}
        onSave={handleCreateNewAction}
      />

      <CategoryFormDialog
        open={categoryDialogOpen}
        isEdit={false}
        categoryForm={categoryForm}
        onChange={setCategoryForm}
        onCancel={() => setCategoryDialogOpen(false)}
        onSave={handleCategoryCreated}
      />
    </Box>
  );
}
