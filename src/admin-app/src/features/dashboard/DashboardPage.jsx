import { useEffect, useState } from 'react';
import {
  Grid, Typography, Card, CardContent, Box, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, LinearProgress, Stack,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import StatCard from '../../components/shared/StatCard';
import { getEvents, getUsers, getParticipation, getActions, getLeaderboard } from '../../data/api';

const PIE_COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#00BCD4', '#795548', '#9C27B0', '#F44336'];
const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const STATUS_COLOR = { Active: 'success', Upcoming: 'info', Completed: 'default', Archived: 'warning' };

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      const [events, users, participation, actions, leaderboard] = await Promise.all([
        getEvents(), getUsers(), getParticipation(), getActions(), getLeaderboard(5),
      ]);

      const activeEvents = events.filter((e) => e.status === 'Active').length;
      const totalParticipation = participation.length;
      const activeUsers = users.filter((u) => u.status === 'Active').length;
      const totalPoints = leaderboard.reduce((sum, e) => sum + e.points, 0);

      // Challenge summary table
      const challengeSummary = events
        .filter((e) => e.status !== 'Archived')
        .map((e) => {
          const eventActions = actions.filter((a) => a.eventId === e.id);
          const eventParticipation = participation.filter((p) => p.eventId === e.id);
          const maxPoints = eventActions.reduce((sum, a) => sum + a.points, 0);
          const pointsEarned = eventParticipation.reduce((sum, p) => {
            const action = actions.find((a) => a.id === p.actionId);
            return sum + (action?.points || 0);
          }, 0);
          return {
            id: e.id,
            name: e.name,
            status: e.status,
            theme: e.theme,
            actionCount: eventActions.length,
            participationCount: eventParticipation.length,
            participantCount: e.participantCount,
            maxPoints,
            pointsEarned,
          };
        });

      // Participation bar chart
      const participationByEvent = challengeSummary.map((c) => ({
        name: c.name.length > 18 ? c.name.slice(0, 18) + '...' : c.name,
        participants: c.participantCount,
        actions: c.participationCount,
      }));

      // Actions by category
      const byCategory = {};
      participation.forEach((p) => {
        const action = actions.find((a) => a.id === p.actionId);
        if (action) {
          byCategory[action.category] = (byCategory[action.category] || 0) + 1;
        }
      });
      const categoryData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

      // Monthly engagement trend
      const byMonth = {};
      participation.forEach((p) => {
        const month = p.completedAt.slice(0, 7);
        byMonth[month] = (byMonth[month] || 0) + 1;
      });
      const trendData = Object.entries(byMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({ month, actions: count }));

      // Most active users (by action count)
      const actionsByUser = {};
      participation.forEach((p) => {
        actionsByUser[p.userId] = (actionsByUser[p.userId] || 0) + 1;
      });
      const mostActive = Object.entries(actionsByUser)
        .map(([uid, count]) => {
          const u = users.find((u) => u.id === Number(uid));
          return { userId: Number(uid), name: u?.name || 'Unknown', actionCount: count };
        })
        .sort((a, b) => b.actionCount - a.actionCount)
        .slice(0, 5);

      setStats({
        activeEvents,
        totalParticipation,
        activeUsers,
        totalPoints,
        challengeSummary,
        participationByEvent,
        categoryData,
        trendData,
        leaderboard,
        mostActive,
      });
    }
    load();
  }, []);

  if (!stats) return <Typography>Loading...</Typography>;

  const maxLeaderboardPoints = stats.leaderboard[0]?.points || 1;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Dashboard</Typography>

      {/* ───── Overview Stats ───── */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active Challenges" value={stats.activeEvents} icon={<EventIcon fontSize="inherit" />} color="#4CAF50" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Actions Taken" value={stats.totalParticipation} icon={<EnergySavingsLeafIcon fontSize="inherit" />} color="#2196F3" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active Users" value={stats.activeUsers} icon={<PeopleIcon fontSize="inherit" />} color="#FF9800" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Points Earned" value={stats.totalPoints} icon={<StarIcon fontSize="inherit" />} color="#9C27B0" />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* ───── Challenge Insights Section ───── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <EventIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Challenge Insights</Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Challenge Summary</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Challenge</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                      <TableCell align="right">Completions</TableCell>
                      <TableCell align="right">Participants</TableCell>
                      <TableCell align="right">Pts Earned</TableCell>
                      <TableCell align="right">Max Pts</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.challengeSummary.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.theme, flexShrink: 0 }} />
                            {c.name}
                          </Box>
                        </TableCell>
                        <TableCell><Chip label={c.status} size="small" color={STATUS_COLOR[c.status] || 'default'} /></TableCell>
                        <TableCell align="right">{c.actionCount}</TableCell>
                        <TableCell align="right">{c.participationCount}</TableCell>
                        <TableCell align="right">{c.participantCount}</TableCell>
                        <TableCell align="right">{c.pointsEarned}</TableCell>
                        <TableCell align="right">{c.maxPoints}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Actions by Category</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={stats.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {stats.categoryData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Participation by Challenge</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.participationByEvent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="participants" name="Participants" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actions" name="Action Completions" fill="#2196F3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Monthly Engagement Trend</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={stats.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="actions" name="Actions Completed" stroke="#2196F3" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* ───── User & Points Section ───── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <EmojiEventsIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>User &amp; Points</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Global points are cumulative across all challenges. View individual challenge detail pages for per-challenge rankings.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Global Leaderboard (All Challenges)</Typography>
              <Stack spacing={2} mt={1}>
                {stats.leaderboard.map((entry, i) => (
                  <Box key={entry.userId}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {i < 3 ? (
                          <Chip label={i + 1} size="small" sx={{ bgcolor: MEDAL_COLORS[i], color: '#fff', fontWeight: 700, minWidth: 28 }} />
                        ) : (
                          <Chip label={i + 1} size="small" variant="outlined" sx={{ minWidth: 28 }} />
                        )}
                        <Typography variant="body2" fontWeight={i < 3 ? 600 : 400}>{entry.name}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={700}>{entry.points} pts</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(entry.points / maxLeaderboardPoints) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: i === 0 ? '#FFD700' : i === 1 ? '#90A4AE' : i === 2 ? '#CD7F32' : 'primary.main',
                        },
                      }}
                    />
                  </Box>
                ))}
                {stats.leaderboard.length === 0 && (
                  <Typography variant="body2" color="text.secondary" textAlign="center">No participation data yet</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Most Active Users (by Actions)</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Actions Completed</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.mostActive.map((entry, i) => (
                      <TableRow key={entry.userId}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{entry.name}</TableCell>
                        <TableCell align="right">
                          <Chip label={entry.actionCount} size="small" color="primary" variant="outlined" />
                        </TableCell>
                      </TableRow>
                    ))}
                    {stats.mostActive.length === 0 && (
                      <TableRow><TableCell colSpan={3} align="center">No activity yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
