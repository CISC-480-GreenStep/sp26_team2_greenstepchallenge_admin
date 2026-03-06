import { useEffect, useState, useMemo } from 'react';
import {
  Box, Typography, Paper, TextField, MenuItem, Grid, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  getEvents, getUsers, getParticipation, getActions,
} from '../../data/api';
import CSVExport from '../../components/shared/CSVExport';

export default function ReportsPage() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [participation, setParticipation] = useState([]);
  const [actions, setActions] = useState([]);
  const [eventFilter, setEventFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    Promise.all([getEvents(), getUsers(), getParticipation(), getActions()])
      .then(([e, u, p, a]) => { setEvents(e); setUsers(u); setParticipation(p); setActions(a); });
  }, []);

  const filtered = useMemo(() => {
    return participation.filter((p) => {
      if (eventFilter !== 'All' && p.eventId !== Number(eventFilter)) return false;
      if (dateFrom && p.completedAt < dateFrom) return false;
      if (dateTo && p.completedAt > dateTo) return false;
      return true;
    });
  }, [participation, eventFilter, dateFrom, dateTo]);

  const userName = (uid) => users.find((u) => u.id === uid)?.name || 'Unknown';
  const challengeName = (eid) => events.find((e) => e.id === eid)?.name || 'Unknown';
  const actionName = (aid) => actions.find((a) => a.id === aid)?.name || 'Unknown';
  const actionCategory = (aid) => actions.find((a) => a.id === aid)?.category || 'Unknown';

  const tableData = filtered.map((p) => ({
    User: userName(p.userId),
    Challenge: challengeName(p.eventId),
    Action: actionName(p.actionId),
    Category: actionCategory(p.actionId),
    Date: p.completedAt,
    Notes: p.notes || '',
  }));

  const chartData = useMemo(() => {
    const counts = {};
    filtered.forEach((p) => {
      const cat = actionCategory(p.actionId);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [filtered, actions]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Reports</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              size="small" select label="Challenge" fullWidth
              value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}
            >
              <MenuItem value="All">All Challenges</MenuItem>
              {events.map((ev) => <MenuItem key={ev.id} value={ev.id}>{ev.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              size="small" label="From" type="date" fullWidth
              value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              size="small" label="To" type="date" fullWidth
              value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <CSVExport data={tableData} filename="report.csv" label="Export" />
          </Grid>
        </Grid>
      </Paper>

      {chartData.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Actions by Category</Typography>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4CAF50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          Results ({filtered.length} records)
        </Typography>
      </Stack>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Challenge</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.User}</TableCell>
                <TableCell>{row.Challenge}</TableCell>
                <TableCell>{row.Action}</TableCell>
                <TableCell>{row.Category}</TableCell>
                <TableCell>{row.Date}</TableCell>
                <TableCell>{row.Notes || '—'}</TableCell>
              </TableRow>
            ))}
            {tableData.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center">No records match your filters</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
