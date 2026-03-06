import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, TextField, MenuItem, Button, Stack, Paper, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getEventById, createEvent, updateEvent, CATEGORIES, EVENT_STATUSES,
  getActionsByEvent, createAction, updateAction, deleteAction, getGroups,
} from '../../data/api';
import { useAuth } from '../auth/AuthContext';

const EMPTY_FORM = {
  name: '',
  description: '',
  category: CATEGORIES[0],
  theme: '#4CAF50',
  startDate: '',
  endDate: '',
  status: EVENT_STATUSES.UPCOMING,
  groupId: '',
};

const EMPTY_ACTION = { name: '', description: '', category: CATEGORIES[0], points: 5 };

export default function ChallengeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [actions, setActions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [actionForm, setActionForm] = useState(EMPTY_ACTION);

  useEffect(() => {
    getGroups().then(setGroups);
    if (isEdit) {
      const eid = Number(id);
      getEventById(eid).then((e) => { if (e) setForm(e); });
      getActionsByEvent(eid).then(setActions);
    }
  }, [id, isEdit]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, groupId: form.groupId || null };
    if (isEdit) {
      await updateEvent(Number(id), payload);
    } else {
      await createEvent({ ...payload, createdBy: user.id });
    }
    navigate('/challenges');
  };

  const loadActions = async () => {
    if (isEdit) setActions(await getActionsByEvent(Number(id)));
  };

  const openNewAction = () => {
    setEditingAction(null);
    setActionForm(EMPTY_ACTION);
    setActionDialogOpen(true);
  };

  const openEditAction = (action) => {
    setEditingAction(action);
    setActionForm({ name: action.name, description: action.description, category: action.category, points: action.points });
    setActionDialogOpen(true);
  };

  const handleActionSave = async () => {
    if (editingAction) {
      await updateAction(editingAction.id, actionForm);
    } else {
      await createAction({ ...actionForm, eventId: Number(id) });
    }
    setActionDialogOpen(false);
    loadActions();
  };

  const handleActionDelete = async (actionId) => {
    await deleteAction(actionId);
    loadActions();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        {isEdit ? 'Edit Challenge' : 'Create Challenge'}
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 }, maxWidth: 700, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField label="Challenge Name" value={form.name} onChange={handleChange('name')} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Description" value={form.description} onChange={handleChange('description')} multiline rows={3} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Category" select value={form.category} onChange={handleChange('category')} fullWidth>
                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Status" select value={form.status} onChange={handleChange('status')} fullWidth>
                {Object.values(EVENT_STATUSES).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Start Date" type="date" value={form.startDate} onChange={handleChange('startDate')} InputLabelProps={{ shrink: true }} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="End Date" type="date" value={form.endDate} onChange={handleChange('endDate')} InputLabelProps={{ shrink: true }} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Theme Color" type="color" value={form.theme} onChange={handleChange('theme')} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Group" select value={form.groupId || ''} onChange={handleChange('groupId')} fullWidth>
                <MenuItem value="">No Group</MenuItem>
                {groups.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} mt={3}>
            <Button type="submit" variant="contained">{isEdit ? 'Save Changes' : 'Create Challenge'}</Button>
            <Button variant="outlined" onClick={() => navigate('/challenges')}>Cancel</Button>
          </Stack>
        </form>
      </Paper>

      {isEdit && (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight={600}>Actions ({actions.length})</Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={openNewAction}>Add Action</Button>
          </Stack>
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
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
                      <IconButton size="small" onClick={() => openEditAction(a)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleActionDelete(a.id)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {actions.length === 0 && (
                  <TableRow><TableCell colSpan={4} align="center">No actions yet. Add one above.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAction ? 'Edit Action' : 'Add Action'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Action Name" value={actionForm.name} onChange={(e) => setActionForm((p) => ({ ...p, name: e.target.value }))} required fullWidth />
            <TextField label="Description" value={actionForm.description} onChange={(e) => setActionForm((p) => ({ ...p, description: e.target.value }))} multiline rows={2} fullWidth />
            <TextField label="Category" select value={actionForm.category} onChange={(e) => setActionForm((p) => ({ ...p, category: e.target.value }))} fullWidth>
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField label="Points" type="number" value={actionForm.points} onChange={(e) => setActionForm((p) => ({ ...p, points: Number(e.target.value) }))} fullWidth inputProps={{ min: 1 }} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleActionSave}>{editingAction ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
