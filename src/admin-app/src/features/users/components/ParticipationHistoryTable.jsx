/**
 * ParticipationHistoryTable -- "Participation" section on UserDetail.
 * Lists every sustainability action the user has logged (the same
 * data that drives challenge leaderboards).
 *
 * Self-contained: owns its expand/collapse state and the CSV export.
 * Resolves IDs to names via callbacks supplied by the parent.
 */

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { CSVExport } from "../../../components/shared/data";

const PREVIEW_LIMIT = 10;

/**
 * @param {object} props
 * @param {Array<object>} props.participation
 * @param {string}        props.userName        - used for CSV filename
 * @param {(cid:number) => string} props.challengeName
 * @param {(aid:number) => string} props.actionName
 */
export default function ParticipationHistoryTable({
  participation,
  userName,
  challengeName,
  actionName,
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? participation : participation.slice(0, PREVIEW_LIMIT);
  const csvRows = participation.map((p) => ({
    Challenge: challengeName(p.challengeId),
    Action: actionName(p.actionId),
    Date: p.completedAt,
    Notes: p.notes,
  }));
  const filename = `${userName.replace(/\s+/g, "_")}_participation.csv`;

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        flexWrap="wrap"
        gap={1}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Participation ({participation.length})
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Sustainability actions completed in challenges &mdash; this is what shows on
            challenge leaderboards
          </Typography>
        </Box>
        <CSVExport data={csvRows} filename={filename} />
      </Stack>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
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
            {visible.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Button
                    size="small"
                    sx={{ p: 0, minWidth: "auto", textTransform: "none" }}
                    onClick={() => navigate(`/challenges/${p.challengeId}`)}
                  >
                    {challengeName(p.challengeId)}
                  </Button>
                </TableCell>
                <TableCell>{actionName(p.actionId)}</TableCell>
                <TableCell>{p.completedAt}</TableCell>
                <TableCell>{p.notes || "\u2014"}</TableCell>
              </TableRow>
            ))}

            {participation.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No participation
                </TableCell>
              </TableRow>
            )}

            {participation.length > PREVIEW_LIMIT && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 1.5 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setExpanded((v) => !v)}
                  >
                    {expanded
                      ? "Show less"
                      : `View more (${participation.length - PREVIEW_LIMIT} more)`}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
