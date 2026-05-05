/**
 * @file ReportParticipationTableWidget.jsx
 * @summary Filterable cross-challenge participation table with CSV export.
 *
 * First slice of issue #40 ("Combine Dashboard and Report Engine together") --
 * absorbs the unique deliverable from the legacy `/reports` page (filtered
 * participation list + CSV export) into the customizable dashboard so the
 * old route can be retired in a follow-up PR.
 *
 * Reads pre-joined rows from `data.enrichedParticipation` (built by
 * `aggregations.buildEnrichedParticipation`) so the widget only owns its
 * filter UI -- not the lookups. Filter state is local to this instance, so
 * a user can drop multiple copies on the dashboard scoped to different
 * challenges or date ranges.
 */

import { useMemo, useState } from "react";

import {
  Box,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { CSVExport, EntityLink } from "../../../components/shared/data";

const ALL_CHALLENGES = "All";

export default function ReportParticipationTableWidget({ data }) {
  const [challengeFilter, setChallengeFilter] = useState(ALL_CHALLENGES);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const challenges = data?.challenges ?? [];

  const filtered = useMemo(() => {
    const rows = data?.enrichedParticipation ?? [];
    return rows.filter((r) => {
      if (challengeFilter !== ALL_CHALLENGES && r.challengeId !== Number(challengeFilter)) {
        return false;
      }
      if (dateFrom && r.completedAt < dateFrom) return false;
      if (dateTo && r.completedAt > dateTo) return false;
      return true;
    });
  }, [data?.enrichedParticipation, challengeFilter, dateFrom, dateTo]);

  // Re-shape with human-readable headers for the CSV download. Keeping the
  // export columns aligned with the visible table is a deliberate UX promise
  // -- "what you see is what you export."
  const csvData = useMemo(
    () =>
      filtered.map((r) => ({
        User: r.userName,
        Challenge: r.challengeName,
        Action: r.actionName,
        Category: r.actionCategory,
        Date: r.completedAt,
        Notes: r.notes,
      })),
    [filtered],
  );

  return (
    <Stack spacing={1.5} sx={{ height: "100%", overflow: "hidden" }}>
      <Paper variant="outlined" sx={{ p: 1.5, flexShrink: 0 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            size="small"
            select
            label="Challenge"
            value={challengeFilter}
            onChange={(e) => setChallengeFilter(e.target.value)}
            sx={{ minWidth: 180, flex: 1 }}
          >
            <MenuItem value={ALL_CHALLENGES}>All Challenges</MenuItem>
            {challenges.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
          />
          <TextField
            size="small"
            label="To"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
          />
          <CSVExport data={csvData} filename="report.csv" label="Export" />
        </Stack>
      </Paper>

      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
          {filtered.length} record{filtered.length === 1 ? "" : "s"}
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ flex: 1, overflow: "auto" }}>
          <Table size="small" stickyHeader sx={{ minWidth: 600 }}>
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
              {filtered.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <EntityLink type="users" id={r.userId}>
                      {r.userName}
                    </EntityLink>
                  </TableCell>
                  <TableCell>
                    <EntityLink type="challenges" id={r.challengeId}>
                      {r.challengeName}
                    </EntityLink>
                  </TableCell>
                  <TableCell>{r.actionName}</TableCell>
                  <TableCell>{r.actionCategory}</TableCell>
                  <TableCell>{r.completedAt}</TableCell>
                  <TableCell>{r.notes || "\u2014"}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No records match your filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  );
}
