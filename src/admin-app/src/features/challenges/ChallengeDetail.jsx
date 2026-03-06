import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Stack, Card, CardContent,
  LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
  getEventById, getActionsByEvent, getParticipationByEvent, getUsers, getGroups,
  getChallengeLeaderboard,
} from '../../data/api';
import CSVExport from '../../components/shared/CSVExport';

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [actions, setActions] = useState([]);
  const [participation, setParticipation] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const eid = Number(id);
    Promise.all([
      getEventById(eid),
      getActionsByEvent(eid),
      getParticipationByEvent(eid),
      getUsers(),
      getGroups(),
      getChallengeLeaderboard(eid),
    ]).then(([e, a, p, u, g, lb]) => {
      setEvent(e);
      setActions(a);
      setParticipation(p);
      setUsers(u);
      setGroups(g);
      setLeaderboard(lb);
    });
  }, [id]);

  if (!event) return <Typography>Loading...</Typography>;

  const userName = (uid) => users.find((u) => u.id === uid)?.name || 'Unknown';
  const actionName = (aid) => actions.find((a) => a.id === aid)?.name || 'Unknown';
  const groupName = (gid) => groups.find((g) => g.id === gid)?.name || '—';

  const participationExport = participation.map((p) => ({
    User: userName(p.userId),
    Action: actionName(p.actionId),
    Date: p.completedAt,
    Notes: p.notes,
  }));

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/challenges')} sx={{ mb: 2 }}>
        Back to Challenges
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: event.theme }} />
          <Typography variant="h5" fontWeight={700}>{event.name}</Typography>
          <Chip label={event.status} size="small" />
        </Box>
        <Typography color="text.secondary" mb={2}>{event.description}</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">Category</Typography><Typography>{event.category}</Typography></Grid>
          <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">Group</Typography><Typography>{groupName(event.groupId)}</Typography></Grid>
          <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">Start</Typography><Typography>{event.startDate}</Typography></Grid>
          <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">End</Typography><Typography>{event.endDate}</Typography></Grid>
        </Grid>
      </Paper>

      {leaderboard.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EmojiEventsIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>Challenge Leaderboard</Typography>
            </Box>
            <Grid container spacing={2}>
              {leaderboard.map((entry, i) => {
                const pct = entry.maxPoints > 0 ? Math.round((entry.points / entry.maxPoints) * 100) : 0;
                return (
                  <Grid key={entry.userId} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={`#${i + 1}`}
                            size="small"
                            sx={i < 3 ? {
                              bgcolor: ['#FFD700', '#C0C0C0', '#CD7F32'][i],
                              color: '#fff',
                              fontWeight: 700,
                            } : { fontWeight: 600 }}
                          />
                          <Typography variant="body2" fontWeight={600}>{entry.name}</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={700}>{entry.points} pts</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 3, mb: 0.5 }} />
                      <Typography variant="caption" color="text.secondary">
                        {entry.actionCount} action{entry.actionCount !== 1 ? 's' : ''} completed &middot; {pct}% of max
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      <Typography variant="h6" fontWeight={600} mb={1}>Actions ({actions.length})</Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actions.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.category}</TableCell>
                <TableCell align="right">{a.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight={600}>Participation Log ({participation.length})</Typography>
        <CSVExport data={participationExport} filename={`${event.name.replace(/\s+/g, '_')}_participation.csv`} />
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participation.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{userName(p.userId)}</TableCell>
                <TableCell>{actionName(p.actionId)}</TableCell>
                <TableCell>{p.completedAt}</TableCell>
                <TableCell>{p.notes || '—'}</TableCell>
              </TableRow>
            ))}
            {participation.length === 0 && (
              <TableRow><TableCell colSpan={4} align="center">No participation yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
