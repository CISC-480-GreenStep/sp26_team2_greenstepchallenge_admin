/**
 * @file ParticipantsTable.jsx
 * @summary ParticipantsTable -- "Participants" table on ChallengeDetail.
 *
 * Shows one row per user who has logged at least one action in the
 * challenge, sorted by points descending. Pure presentational; the
 * parent computes the participants array from raw participation rows.
 */

import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

/**
 * @param {object} props
 * @param {Array<{ userId: number, count: number, points: number }>} props.participants
 *        Pre-aggregated rows; one per user, sorted by points desc.
 * @param {(userId: number) => string} props.userName Lookup helper.
 */
export default function ParticipantsTable({ participants, userName }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={600} mb={1}>
        Participants ({participants.length})
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>
        Users who have completed at least one action in this challenge
      </Typography>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="right">Actions Completed</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((entry) => (
              <TableRow key={entry.userId} hover>
                <TableCell>
                  <Button
                    size="small"
                    sx={{ p: 0, minWidth: "auto", textTransform: "none" }}
                    onClick={() => navigate(`/users/${entry.userId}`)}
                  >
                    {userName(entry.userId)}
                  </Button>
                </TableCell>
                <TableCell align="right">{entry.count}</TableCell>
                <TableCell align="right">{entry.points}</TableCell>
              </TableRow>
            ))}
            {participants.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">No participants yet</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
