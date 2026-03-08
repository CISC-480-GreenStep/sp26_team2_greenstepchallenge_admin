import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, TextField, MenuItem, Button, Stack, Paper, Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getUserById, createUser, updateUser, ROLES, USER_STATUSES, getGroups } from '../../data/api';

const EMPTY = {
  name: '',
  email: '',
  role: ROLES.GENERAL_USER,
  status: USER_STATUSES.ACTIVE,
  groupId: '',
};

export default function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getGroups().then(setGroups);
    if (isEdit) {
      getUserById(Number(id)).then((u) => {
        if (u) setForm(u);
      });
    }
  }, [id, isEdit]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, groupId: form.groupId || null };
    if (isEdit) {
      await updateUser(Number(id), payload);
    } else {
      await createUser(payload);
    }
    navigate('/users');
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/users')} sx={{ mb: 2 }}>
        Back to Users
      </Button>

      <Typography variant="h5" fontWeight={700} mb={3} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
        {isEdit ? 'Edit User' : 'Create User'}
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 }, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField label="Full Name" value={form.name} onChange={handleChange('name')} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Email" type="email" value={form.email} onChange={handleChange('email')} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Role" select value={form.role} onChange={handleChange('role')} fullWidth>
                {Object.values(ROLES).map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Status" select value={form.status} onChange={handleChange('status')} fullWidth>
                {Object.values(USER_STATUSES).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Group" select value={form.groupId || ''} onChange={handleChange('groupId')} fullWidth>
                <MenuItem value="">No Group</MenuItem>
                {groups.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} mt={3}>
            <Button type="submit" variant="contained">{isEdit ? 'Save Changes' : 'Create User'}</Button>
            <Button variant="outlined" onClick={() => navigate('/users')}>Cancel</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
