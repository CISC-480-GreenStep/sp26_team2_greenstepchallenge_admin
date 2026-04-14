import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Stack, Card, CardContent,
  LinearProgress, Divider, TextField, MenuItem,
  CircularProgress, Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PublicIcon from '@mui/icons-material/Public';
import HistoryIcon from '@mui/icons-material/History';
import {
  getUserById, getActivityLogsByUser, getParticipationByUser,
  getChallenges, getActions, getUserPoints, getGroups, updateUser, ROLES,
} from '../../data/api';
import { useAuth } from '../auth/AuthContext';
import { can } from '../../lib/permissions';
import CSVExport from '../../components/shared/CSVExport';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const userRole = currentUser?.role || ROLES.GENERAL_USER;
  const showEmail = can(userRole, 'VIEW_USER_EMAIL');
  const showRole = can(userRole, 'VIEW_USER_ROLE');
  const showGroup = can(userRole, 'VIEW_USER_GROUP');
  const showStatus = can(userRole, 'VIEW_USER_STATUS');
  const showActivityLog = can(userRole, 'VIEW_USER_ACTIVITY_LOG');
  const showParticipation = can(userRole, 'VIEW_USER_PARTICIPATION');
  const showPoints = can(userRole, 'VIEW_USER_POINTS');
  const canChangeGroup = can(userRole, 'CHANGE_USER_GROUP');
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [participation, setParticipation] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [actions, setActions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [points, setPoints] = useState({ total: 0, breakdown: [] });
  const [participationExpanded, setParticipationExpanded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uid = Number(id);
    Promise.all([
      getUserById(uid),
      getActivityLogsByUser(uid),
      getParticipationByUser(uid),
      getChallenges(),
      getActions(),
      getUserPoints(uid),
      getGroups(),
    ]).then(([u, l, p, c, a, pts, g]) => {
      setUser(u);
      setLogs(l);
      setParticipation(p);
      setChallenges(c);
      setActions(a);
      setPoints(pts);
      setGroups(g);
    }).catch((err) => {
      setError(err.message || 'Failed to load user details');
    });
  }, [id]);

  if (!user) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  const challengeName = (cid) => challenges.find((c) => c.id === cid)?.name || 'Unknown';
  const actionName = (aid) => actions.find((a) => a.id === aid)?.name || 'Unknown';
  const groupName = (gid) => groups.find((g) => g.id === gid)?.name || '—';

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={1} sx={{ fontSize: { xs: '1.15rem', sm: '1.5rem' }, wordBreak: 'break-word' }}>{user.name}</Typography>
        <Grid container spacing={2}>
          {showEmail && <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">Email</Typography><Typography sx={{ wordBreak: 'break-all', fontSize: { xs: '0.8rem', sm: '1rem' } }}>{user.email}</Typography></Grid>}
          {showRole && <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">Role</Typography><Chip label={user.role} size="small" /></Grid>}
          {showStatus && <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">Status</Typography><Chip label={user.status} size="small" color={user.status === 'Active' ? 'success' : 'default'} /></Grid>}
          {showGroup && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">Group</Typography>
            {canChangeGroup ? (
              <TextField
                select
                size="small"
                value={user.groupId || ''}
                onChange={async (e) => {
                  const gid = e.target.value ? Number(e.target.value) : null;
                  await updateUser(user.id, { groupId: gid });
                  setUser((u) => ({ ...u, groupId: gid }));
                }}
                sx={{ mt: 0.5, minWidth: 180 }}
              >
                <MenuItem value="">No Group</MenuItem>
                {groups.map((g) => (
                  <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                ))}
              </TextField>
            ) : user.groupId ? (
              <Button
                size="small"
                sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                onClick={() => navigate(`/groups/${user.groupId}`)}
              >
                {groupName(user.groupId)}
              </Button>
            ) : (
              <Typography>—</Typography>
            )}
          </Grid>
          )}
        </Grid>
      </Paper>

      {showPoints && (
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
                  <Typography variant="h3" fontWeight={700} sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>{points.total}</Typography>
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
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small" sx={{ minWidth: 450 }}>
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
                            <TableCell>
                              <Button
                                size="small"
                                sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                                onClick={() => navigate(`/challenges/${b.challengeId}`)}
                              >
                                {b.challengeName}
                              </Button>
                            </TableCell>
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
      )}

      {showParticipation && (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} flexWrap="wrap" gap={1}>
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Participation ({participation.length})</Typography>
              <Typography variant="caption" color="text.secondary">Sustainability actions completed in challenges — this is what shows on challenge leaderboards</Typography>
            </Box>
            <CSVExport
              data={participation.map((p) => ({
                Challenge: challengeName(p.challengeId),
                Action: actionName(p.actionId),
                Date: p.completedAt,
                Notes: p.notes,
              }))}
              filename={`${user.name.replace(/\s+/g, '_')}_participation.csv`}
            />
          </Stack>
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 500 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Challenge</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(participationExpanded ? participation : participation.slice(0, 10)).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Button
                        size="small"
                        sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                        onClick={() => navigate(`/challenges/${p.challengeId}`)}
                      >
                        {challengeName(p.challengeId)}
                      </Button>
                    </TableCell>
                    <TableCell>{actionName(p.actionId)}</TableCell>
                    <TableCell>{p.completedAt}</TableCell>
                    <TableCell>{p.notes || '—'}</TableCell>
                  </TableRow>
                ))}
                {participation.length === 0 && (
                  <TableRow><TableCell colSpan={4} align="center">No participation</TableCell></TableRow>
                )}
                {participation.length > 10 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 1.5 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setParticipationExpanded((v) => !v)}
                      >
                        {participationExpanded
                          ? 'Show less'
                          : `View more (${participation.length - 10} more)`}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {showActivityLog && (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} flexWrap="wrap" gap={1}>
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Admin Activity Log ({logs.length})</Typography>
              <Typography variant="caption" color="text.secondary">System actions like created challenge, exported report — admins only; GeneralUsers typically have none</Typography>
            </Box>
            <CSVExport data={logs} filename={`${user.name.replace(/\s+/g, '_')}_activity.csv`} />
          </Stack>
          <TableContainer component={Paper} sx={{ mb: 3, overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 450 }}>
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
                    <TableCell>{new Date(l.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow><TableCell colSpan={3} align="center">No admin activity</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
