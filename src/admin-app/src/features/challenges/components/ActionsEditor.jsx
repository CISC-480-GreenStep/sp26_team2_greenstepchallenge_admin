/**
 * ActionsEditor -- the edit-mode-only "Actions" table on ChallengeForm
 * with its add/edit dialog.
 *
 * This component owns its own dialog state because it's the only
 * component that uses it; the parent only needs to know which
 * challenge id we're editing and to receive a callback when the
 * actions list changes (so it can refetch).
 */

import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  CATEGORIES,
  createAction,
  deleteAction,
  getChallengeById,
  updateAction,
  updateChallenge,
} from "../../../data/api";

const EMPTY_ACTION = {
  name: "",
  description: "",
  category: CATEGORIES[0],
  points: 5,
};

/**
 * @param {object}   props
 * @param {number}   props.challengeId
 * @param {Array<object>} props.actions
 * @param {() => Promise<void> | void} props.onChanged Invoked after add/edit/delete so the parent can reload.
 */
export default function ActionsEditor({ challengeId, actions, onChanged }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [actionForm, setActionForm] = useState(EMPTY_ACTION);

  const openNewAction = () => {
    setEditingAction(null);
    setActionForm(EMPTY_ACTION);
    setDialogOpen(true);
  };

  const openEditAction = (action) => {
    setEditingAction(action);
    setActionForm({
      name: action.name,
      description: action.description,
      category: action.category,
      points: action.points,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingAction) {
      await updateAction(editingAction.id, actionForm);
    } else {
      // New action: create the action row, then attach it to this
      // challenge's actionIds. Done in two steps because actions live
      // in their own catalog independent of any challenge.
      const newAction = await createAction({ ...actionForm });
      const challenge = await getChallengeById(challengeId);
      if (challenge) {
        await updateChallenge(challengeId, {
          actionIds: [...(challenge.actionIds || []), newAction.id],
        });
      }
    }
    setDialogOpen(false);
    await onChanged();
  };

  const handleDelete = async (actionId) => {
    await deleteAction(actionId);
    const challenge = await getChallengeById(challengeId);
    if (challenge) {
      await updateChallenge(challengeId, {
        actionIds: (challenge.actionIds || []).filter((aid) => aid !== actionId),
      });
    }
    await onChanged();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          Actions ({actions.length})
        </Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={openNewAction}>
          Add Action
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Points</TableCell>
              <TableCell align="right">Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actions.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.category}</TableCell>
                <TableCell align="right">{a.points}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEditAction(a)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(a.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {actions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No actions yet. Add one above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAction ? "Edit Action" : "Add Action"}</DialogTitle>
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
              {CATEGORIES.map((c) => (
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
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingAction ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
