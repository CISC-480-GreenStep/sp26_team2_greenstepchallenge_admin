import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Stack, Card, CardContent,
  LinearProgress, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PublicIcon from '@mui/icons-material/Public';
import HistoryIcon from '@mui/icons-material/History';
import {
  getUserById, getActivityLogsByUser, getParticipationByUser,
  getEvents, getActions, getUserPoints, getGroups,
} from '../../data/api';
import CSVExport from '../../components/shared/CSVExport';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [participation, setParticipation] = useState([]);
  const [events, setEvents] = useState([]);
  const [actions, setActions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [points, setPoints] = useState({ total: 0, breakdown: [] });

  useEffect(() => {
    const uid = Number(id);
    Promise.all([
      getUserById(uid),
      getActivityLogsByUser(uid),
      getParticipationByUser(uid),
      getEvents(),
      getActions(),
      getUserPoints(uid),
      getGroups(),
    ]).then(([u, l, p, e, a, pts, g]) => {
      setUser(u);
      setLogs(l);
      setParticipation(p);
      setEvents(e);
      setActions(a);
      setPoints(pts);
      setGroups(g);
    });
  }, [id]);

  if (!user) return <Typography>Loading...</Typography>;

  const challengeName = (eid) => events.find((e) => e.id === eid)?.name || 'Unknown';
  const actionName = (aid) => actions.find((a) => a.id === aid)?.name || 'Unknown';
  const groupName = (gid) => groups.find((g) => g.id === gid)?.name || '—';

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/users')} sx={{ mb: 2 }}>
        Back to Users
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={1}>{user.name}</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">Email</Typography><Typography>{user.email}</Typography></Grid>
          <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">Role</Typography><Chip label={user.role} size="small" /></Grid>
          <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">Status</Typography><Chip label={user.status} size="small" color={user.status === 'Active' ? 'success' : 'default'} /></Grid>
          <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">Group</Typography><Typography>{groupName(user.groupId)}</Typography></Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PublicIcon color="primary" />
                <Typography variant="subtitle2" color="text.secondary">Global Points</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmojiEventsIcon sx={{ fontSize: 44, color: '#FFD700' }} />
                <Box>
                  <Typography variant="h3" fontWeight={700}>{points.total}</Typography>
                  <Typography variant="caption" color="text.secondary">across {points.breakdown.length} challenge{points.breakdown.length !== 1 ? 's' : ''}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <HistoryIcon color="primary" />
                <Typography variant="subtitle2" color="text.secondary">Points per Challenge (History)</Typography>
              </Box>
              {points.breakdown.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Challenge</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Earned</TableCell>
                        <TableCell align="right">Max</TableCell>
                        <TableCell align="right" sx={{ minWidth: 100 }}>Progress</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {points.breakdown.map((b) => {
                        const pct = b.maxPoints > 0 ? Math.round((b.points / b.maxPoints) * 100) : 0;
                        return (
                          <TableRow key={b.challengeId}>
                            <TableCell>{b.challengeName}</TableCell>
                            <TableCell><Chip label={b.status} size="small" /></TableCell>
                            <TableCell align="right"><strong>{b.points}</strong></TableCell>
                            <TableCell align="right">{b.maxPoints}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress variant="determinate" value={pct} sx={{ flexGrow: 1, height: 6, borderRadius: 3 }} />
                                <Typography variant="caption" sx={{ minWidth: 32 }}>{pct}%</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">No participation yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight={600}>Activity Log ({logs.length})</Typography>
        <CSVExport data={logs} filename={`${user.name.replace(/\s+/g, '_')}_activity.csv`} />
      </Stack>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.action}</TableCell>
                <TableCell>{l.details}</TableCell>
                <TableCell>{l.timestamp}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow><TableCell colSpan={3} align="center">No activity</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight={600}>Participation ({participation.length})</Typography>
        <CSVExport
          data={participation.map((p) => ({
            Challenge: challengeName(p.eventId),
            Action: actionName(p.actionId),
            Date: p.completedAt,
            Notes: p.notes,
          }))}
          filename={`${user.name.replace(/\s+/g, '_')}_participation.csv`}
        />
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Challenge</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participation.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{challengeName(p.eventId)}</TableCell>
                <TableCell>{actionName(p.actionId)}</TableCell>
                <TableCell>{p.completedAt}</TableCell>
                <TableCell>{p.notes || '—'}</TableCell>
              </TableRow>
            ))}
            {participation.length === 0 && (
              <TableRow><TableCell colSpan={4} align="center">No participation</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
