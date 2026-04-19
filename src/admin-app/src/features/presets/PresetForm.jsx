import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { getPresetById, createPreset, updatePreset, ACTIONS } from "../../data/api";

const EMPTY_FORM = {
  name: "",
  description: "",
  category: ACTIONS[0],
  theme: "#4CAF50",
  status: "Upcoming",
};

const EMPTY_ACTION = { name: "", description: "", category: ACTIONS[0], points: 5 };

export default function PresetForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [actions, setActions] = useState([]);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [actionForm, setActionForm] = useState(EMPTY_ACTION);

  useEffect(() => {
    if (isEdit) {
      getPresetById(Number(id)).then((p) => {
        if (p) {
          setForm({
            name: p.name,
            description: p.description,
            category: p.category,
            theme: p.theme,
            status: p.status,
          });
          setActions(p.actions || []);
        }
      });
    }
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

  const openNewAction = () => {
    setEditingIdx(null);
    setActionForm(EMPTY_ACTION);
    setActionDialogOpen(true);
  };

  const openEditAction = (idx) => {
    setEditingIdx(idx);
    setActionForm({ ...actions[idx] });
    setActionDialogOpen(true);
  };

  const handleActionSave = () => {
    setActions((prev) => {
      const next = [...prev];
      if (editingIdx !== null) {
        next[editingIdx] = { ...actionForm };
      } else {
        next.push({ ...actionForm });
      }
      return next;
    });
    setActionDialogOpen(false);
  };

  const handleActionDelete = (idx) => {
    setActions((prev) => prev.filter((_, i) => i !== idx));
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
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Preset Name"
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Category"
                select
                value={form.category}
                onChange={handleChange("category")}
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
                onChange={handleChange("theme")}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            fontWeight={600}
            mt={3}
            mb={1}
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Action Templates ({actions.length})
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            These actions will be automatically created when this preset is applied to a new
            challenge.
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto", mb: 2 }}>
            <Table size="small" sx={{ minWidth: 450 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Points</TableCell>
                  <TableCell align="right">Manage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actions.map((a, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.category}</TableCell>
                    <TableCell align="right">{a.points}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openEditAction(idx)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleActionDelete(idx)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {actions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No action templates yet. Add one below.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Button size="small" startIcon={<AddIcon />} onClick={openNewAction} sx={{ mb: 3 }}>
            Add Action Template
          </Button>

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

      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingIdx !== null ? "Edit Action Template" : "Add Action Template"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Action Name"
              value={actionForm.name}
              onChange={(e) => setActionForm((p) => ({ ...p, name: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={actionForm.description}
              onChange={(e) => setActionForm((p) => ({ ...p, description: e.target.value }))}
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              label="Category"
              select
              value={actionForm.category}
              onChange={(e) => setActionForm((p) => ({ ...p, category: e.target.value }))}
              fullWidth
            >
              {ACTIONS.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Points"
              type="number"
              value={actionForm.points}
              onChange={(e) => setActionForm((p) => ({ ...p, points: Number(e.target.value) }))}
              fullWidth
              inputProps={{ min: 1 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleActionSave}>
            {editingIdx !== null ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
