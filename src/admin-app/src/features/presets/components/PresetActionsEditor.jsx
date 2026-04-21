/**
 * @file PresetActionsEditor.jsx
 * @summary In-memory action template editor for the Preset form.
 *
 * Unlike `ActionsEditor` (which mutates persisted actions tied to a
 * challenge), this component manipulates an in-memory list that is sent
 * to the server only when the parent submits the preset form. The
 * dialog UI is shared via `ActionFormDialog` so both editors look and
 * feel identical.
 */

import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { ACTIONS } from "../../../data/api";
import ActionFormDialog from "../../challenges/components/ActionFormDialog";

const EMPTY_ACTION = { name: "", description: "", category: ACTIONS[0], points: 5 };

/**
 * @param {object} props
 * @param {object[]} props.actions - Current list of action templates.
 * @param {(next: object[]) => void} props.onChange - Receives the next list.
 */
export default function PresetActionsEditor({ actions, onChange }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [actionForm, setActionForm] = useState(EMPTY_ACTION);

  const openNewAction = () => {
    setEditingIdx(null);
    setActionForm(EMPTY_ACTION);
    setDialogOpen(true);
  };

  const openEditAction = (idx) => {
    setEditingIdx(idx);
    setActionForm({ ...actions[idx] });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const next = [...actions];
    if (editingIdx !== null) {
      next[editingIdx] = { ...actionForm };
    } else {
      next.push({ ...actionForm });
    }
    onChange(next);
    setDialogOpen(false);
  };

  const handleDelete = (idx) => onChange(actions.filter((_, i) => i !== idx));

  return (
    <Box>
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
        These actions will be automatically created when this preset is applied to a new challenge.
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
                  <IconButton size="small" color="error" onClick={() => handleDelete(idx)}>
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

      <ActionFormDialog
        open={dialogOpen}
        isEdit={editingIdx !== null}
        actionForm={actionForm}
        onChange={setActionForm}
        onCancel={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
}
