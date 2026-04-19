/**
 * @file GroupChallengesTable.jsx
 * @summary GroupChallengesTable -- "Challenges in this Group" section on
 * GroupDetail. Hidden by the parent when the group has no challenges.
 *
 * Pure presentational; no data fetching or mutation.
 */

import { useNavigate } from "react-router-dom";

import EventIcon from "@mui/icons-material/Event";
import {
  Box,
  Button,
  IconButton,
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
 * @param {Array<object>} props.challenges - challenges scoped to this group
 */
export default function GroupChallengesTable({ challenges }) {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={1}>
        Challenges in this Group
      </Typography>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {challenges.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>
                  <Button
                    size="small"
                    sx={{ p: 0, minWidth: "auto", textTransform: "none" }}
                    onClick={() => navigate(`/challenges/${c.id}`)}
                  >
                    {c.name}
                  </Button>
                </TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>{c.startDate}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => navigate(`/challenges/${c.id}`)}>
                    <EventIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
