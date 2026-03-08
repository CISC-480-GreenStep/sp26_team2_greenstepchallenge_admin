import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, TextField, MenuItem,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getEvents, archiveEvent, deleteEvent, EVENT_STATUSES, getGroups, getParticipantCountsByEvents } from '../../data/api';
import { useAuth } from '../auth/AuthContext';
import CSVExport from '../../components/shared/CSVExport';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

const statusColor = {
  Active: 'success',
  Upcoming: 'info',
  Completed: 'default',
  Archived: 'warning',
};

export default function ChallengesPage() {
  const [searchParams] = useSearchParams();
  const initialGroupFilter = searchParams.get('groupId') || 'All';

  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [participantCounts, setParticipantCounts] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState(initialGroupFilter);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canEdit = hasRole('Admin');

  const load = async () => {
    const [e, g, counts] = await Promise.all([
      getEvents(),
      getGroups(),
      getParticipantCountsByEvents(),
    ]);
    setEvents(e);
    setGroups(g);
    setParticipantCounts(counts);
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    const gid = searchParams.get('groupId');
    if (gid) setGroupFilter(gid);
  }, [searchParams]);

  const groupName = (gid) => groups.find((g) => g.id === gid)?.name || '';

  const filtered = events.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesGroup = groupFilter === 'All' || e.groupId === Number(groupFilter);
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const handleArchive = async (id) => {
    await archiveEvent(id);
    load();
  };

  const handleDelete = async () => {
    if (pendingDelete) {
      await deleteEvent(pendingDelete);
      setPendingDelete(null);
      setConfirmOpen(false);
      load();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Challenges</Typography>
        <Stack direction="row" spacing={1}>
          <CSVExport data={filtered} filename="challenges.csv" />
          {canEdit && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/challenges/new')}>
              New Challenge
            </Button>
          )}
        </Stack>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField
          size="small"
          label="Search challenges"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 220 }}
        />
        <TextField
          size="small" select label="Status"
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="All">All</MenuItem>
          {Object.values(EVENT_STATUSES).map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>
        <TextField
          size="small" select label="Group"
          value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="All">All Groups</MenuItem>
          {groups.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
        </TextField>
      </Stack>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Participants</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((event) => (
              <TableRow key={event.id} hover>
                <TableCell>
                  <Button
                    size="small"
                    sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 600 }}
                    onClick={() => navigate(`/challenges/${event.id}`)}
                  >
                    {event.name}
                  </Button>
                </TableCell>
                <TableCell>{event.category}</TableCell>
                <TableCell>
                  {event.groupId ? (
                    <Button
                      size="small"
                      sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                      onClick={() => navigate(`/groups/${event.groupId}`)}
                    >
                      {groupName(event.groupId) || '—'}
                    </Button>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>{event.startDate}</TableCell>
                <TableCell>{event.endDate}</TableCell>
                <TableCell>
                  <Chip label={event.status} size="small" color={statusColor[event.status] || 'default'} />
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="text"
                    sx={{ fontWeight: 600 }}
                    onClick={() => navigate(`/challenges/${event.id}`)}
                  >
                    {participantCounts[event.id] ?? event.participantCount ?? 0}
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => navigate(`/challenges/${event.id}`)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  {canEdit && (
                    <>
                      <IconButton size="small" onClick={() => navigate(`/challenges/${event.id}/edit`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {event.status !== 'Archived' && (
                        <IconButton size="small" onClick={() => handleArchive(event.id)}>
                          <ArchiveIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton size="small" color="error" onClick={() => { setPendingDelete(event.id); setConfirmOpen(true); }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">No challenges found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Challenge"
        message="Are you sure you want to permanently delete this challenge? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDelete(null); }}
      />
    </Box>
  );
}
