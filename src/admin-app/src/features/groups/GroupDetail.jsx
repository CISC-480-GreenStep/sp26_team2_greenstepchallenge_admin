import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
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
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import {
  getGroupById,
  getUsers,
  getEvents,
  updateUser,
  deleteGroup,
} from '../../data/api';
import { useAuth } from '../auth/AuthContext';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canManage = hasRole('Admin');

  const [group, setGroup] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [pendingRemoveUser, setPendingRemoveUser] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const load = async () => {
    const gid = Number(id);
    const [g, u, e] = await Promise.all([
      getGroupById(gid),
      getUsers(),
      getEvents(),
    ]);
    setGroup(g);
    setUsers(u);
    setEvents(e);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!group) return <Typography>Loading...</Typography>;

  const members = users.filter((u) => u.groupId === group.id);
  const groupChallenges = events.filter((e) => e.groupId === group.id);
  const usersNotInGroup = users.filter((u) => u.groupId !== group.id);

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    await updateUser(Number(selectedUserId), { groupId: group.id });
    setSelectedUserId('');
    setAddDialogOpen(false);
    load();
  };

  const handleRemoveMember = async () => {
    if (!pendingRemoveUser) return;
    await updateUser(pendingRemoveUser.id, { groupId: null });
    setPendingRemoveUser(null);
    setConfirmRemoveOpen(false);
    load();
  };

  const handleDeleteGroup = async () => {
    await deleteGroup(group.id);
    setConfirmDeleteOpen(false);
    navigate('/groups');
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/groups')}
        sx={{ mb: 2 }}
      >
        Back to Groups
      </Button>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <GroupsIcon />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ fontSize: { xs: '1.15rem', sm: '1.5rem' } }}
            >
              {group.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {group.description || 'No description'}
            </Typography>
          </Box>
          {canManage && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/groups/${group.id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => setConfirmDeleteOpen(true)}
              >
                Delete
              </Button>
            </Stack>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {members.length} member{members.length !== 1 ? 's' : ''} ·{' '}
          {groupChallenges.length} challenge
          {groupChallenges.length !== 1 ? 's' : ''} · Created {group.createdAt}
        </Typography>
      </Paper>

      {/* Members Section */}
      <Box sx={{ mb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
          flexWrap="wrap"
          gap={1}
        >
          <Typography variant="h6" fontWeight={600}>
            Members ({members.length})
          </Typography>
          {canManage && (
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
              disabled={usersNotInGroup.length === 0}
            >
              Add Member
            </Button>
          )}
        </Stack>
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                {canManage ? <TableCell align="right">Actions</TableCell> : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Button
                      size="small"
                      sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                      onClick={() => navigate(`/users/${u.id}`)}
                    >
                      {u.name}
                    </Button>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.status}</TableCell>
                  {canManage ? (
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="error"
                        title="Remove from group"
                        onClick={() => {
                          setPendingRemoveUser(u);
                          setConfirmRemoveOpen(true);
                        }}
                      >
                        <PersonRemoveIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
              {members.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={canManage ? 5 : 4}
                    align="center"
                    sx={{ py: 3 }}
                  >
                    <Typography color="text.secondary">
                      No members yet. Add members to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Challenges Section */}
      {groupChallenges.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Challenges in this Group
          </Typography>
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupChallenges.map((e) => (
                  <TableRow key={e.id} hover>
                    <TableCell>
                      <Button
                        size="small"
                        sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                        onClick={() => navigate(`/challenges/${e.id}`)}
                      >
                        {e.name}
                      </Button>
                    </TableCell>
                    <TableCell>{e.status}</TableCell>
                    <TableCell>{e.startDate}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/challenges/${e.id}`)}
                      >
                        <EventIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Add Member Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Member to {group.name}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Select user"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            sx={{ mt: 1 }}
          >
            <MenuItem value="">Choose a user...</MenuItem>
            {usersNotInGroup.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name} ({u.email})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddMember}
            disabled={!selectedUserId}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Member Confirm */}
      <ConfirmDialog
        open={confirmRemoveOpen}
        title="Remove from Group"
        message={`Remove ${pendingRemoveUser?.name} from ${group.name}? They will have no group assignment.`}
        onConfirm={handleRemoveMember}
        onCancel={() => {
          setConfirmRemoveOpen(false);
          setPendingRemoveUser(null);
        }}
      />

      {/* Delete Group Confirm */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete Group"
        message="Are you sure you want to delete this group? Users and challenges in this group will become unassigned."
        onConfirm={handleDeleteGroup}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </Box>
  );
}
