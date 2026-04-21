/**
 * @file ReportsPage.jsx
 * @summary Cross-challenge participation report with filterable table + chart.
 *
 * Loads challenges, users, participation records, and actions in parallel,
 * then derives:
 *   - a filtered participation table (challenge + date range filters)
 *   - a category-bucket bar chart of actions in the filtered set
 *   - a CSV export of the table contents
 *
 * Lookups (`userName`, `challengeName`, `actionName`, `actionCategory`) are
 * memoized so derived data (`chartData`, `tableData`) only recomputes when
 * the underlying source arrays actually change.
 */

import { useEffect, useState, useMemo, useCallback } from "react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";

import { CSVExport, EntityLink } from "../../components/shared/data";
import { getChallenges, getUsers, getParticipation, getActions } from "../../data/api";

export default function ReportsPage() {
  const [challenges, setChallenges] = useState([]);
  const [users, setUsers] = useState([]);
  const [participation, setParticipation] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [challengeFilter, setChallengeFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [c, u, p, a] = await Promise.all([
          getChallenges(),
          getUsers(),
          getParticipation(),
          getActions(),
        ]);
        setChallenges(c);
        setUsers(u);
        setParticipation(p);
        setActions(a);
      } catch (err) {
        setError(err.message || "Failed to load report data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return participation.filter((p) => {
      if (challengeFilter !== "All" && p.challengeId !== Number(challengeFilter)) return false;
      if (dateFrom && p.completedAt < dateFrom) return false;
      if (dateTo && p.completedAt > dateTo) return false;
      return true;
    });
  }, [participation, challengeFilter, dateFrom, dateTo]);

  // Stable lookup callbacks so derived memos only invalidate when the
  // underlying source array actually changes.
  const userName = useCallback(
    (uid) => users.find((u) => u.id === uid)?.name || "Unknown",
    [users],
  );
  const challengeName = useCallback(
    (cid) => challenges.find((c) => c.id === cid)?.name || "Unknown",
    [challenges],
  );
  const actionName = useCallback(
    (aid) => actions.find((a) => a.id === aid)?.name || "Unknown",
    [actions],
  );
  const actionCategory = useCallback(
    (aid) => actions.find((a) => a.id === aid)?.category || "Unknown",
    [actions],
  );

  const tableData = useMemo(
    () =>
      filtered.map((p) => ({
        User: userName(p.userId),
        Challenge: challengeName(p.challengeId),
        Action: actionName(p.actionId),
        Category: actionCategory(p.actionId),
        Date: p.completedAt,
        Notes: p.notes || "",
      })),
    [filtered, userName, challengeName, actionName, actionCategory],
  );

  const chartData = useMemo(() => {
    const counts = {};
    filtered.forEach((p) => {
      const cat = actionCategory(p.actionId);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [filtered, actionCategory]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
        sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
      >
        Reports
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              size="small"
              select
              label="Challenge"
              fullWidth
              value={challengeFilter}
              onChange={(e) => setChallengeFilter(e.target.value)}
            >
              <MenuItem value="All">All Challenges</MenuItem>
              {challenges.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              size="small"
              label="From"
              type="date"
              fullWidth
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              size="small"
              label="To"
              type="date"
              fullWidth
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
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
          <Typography variant="h6" gutterBottom>
            Actions by Category
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                angle={-30}
                textAnchor="end"
                interval={0}
                height={60}
              />
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

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
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
            {filtered.map((p, i) => (
              <TableRow key={i}>
                <TableCell>
                  <EntityLink type="users" id={p.userId}>
                    {userName(p.userId)}
                  </EntityLink>
                </TableCell>
                <TableCell>
                  <EntityLink type="challenges" id={p.challengeId}>
                    {challengeName(p.challengeId)}
                  </EntityLink>
                </TableCell>
                <TableCell>{actionName(p.actionId)}</TableCell>
                <TableCell>{actionCategory(p.actionId)}</TableCell>
                <TableCell>{p.completedAt}</TableCell>
                <TableCell>{p.notes || "—"}</TableCell>
              </TableRow>
            ))}
            {tableData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No records match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
