/**
 * @file ChallengesTable.jsx
 * @summary Tabular listing of challenges with per-row navigation + admin actions.
 *
 * Purely presentational: parent supplies the filtered rows and the four
 * row-level handlers (view, edit, archive, delete). Edit/archive/delete
 * controls only render when the parent passes `canEdit`.
 */

import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
} from "@mui/material";

import { STATUS_COLOR } from "../../../lib/constants";

/**
 * @param {object} props
 * @param {object[]} props.challenges - Already-filtered rows to render.
 * @param {Record<number, number>} props.participantCounts
 * @param {(groupId: number) => string} props.groupName - Lookup helper from parent.
 * @param {boolean} props.canEdit - Show edit/archive/delete controls when true.
 * @param {(id: number) => void} props.onView
 * @param {(id: number) => void} props.onEdit
 * @param {(id: number) => void} props.onArchive
 * @param {(id: number) => void} props.onRequestDelete
 * @param {(groupId: number) => void} props.onNavigateGroup
 */
export default function ChallengesTable({
  challenges,
  participantCounts,
  groupName,
  canEdit,
  onView,
  onEdit,
  onArchive,
  onRequestDelete,
  onNavigateGroup,
}) {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Group</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Participants</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {challenges.map((challenge) => (
            <TableRow key={challenge.id} hover>
              <TableCell>
                <Button
                  size="small"
                  sx={{ p: 0, minWidth: "auto", textTransform: "none", fontWeight: 600 }}
                  onClick={() => onView(challenge.id)}
                >
                  {challenge.name}
                </Button>
              </TableCell>
              <TableCell>{challenge.category}</TableCell>
              <TableCell>
                {challenge.groupId ? (
                  <Button
                    size="small"
                    sx={{ p: 0, minWidth: "auto", textTransform: "none" }}
                    onClick={() => onNavigateGroup(challenge.groupId)}
                  >
                    {groupName(challenge.groupId) || "\u2014"}
                  </Button>
                ) : (
                  "\u2014"
                )}
              </TableCell>
              <TableCell>{challenge.startDate}</TableCell>
              <TableCell>{challenge.endDate}</TableCell>
              <TableCell>
                <Chip
                  label={challenge.status}
                  size="small"
                  color={STATUS_COLOR[challenge.status] || "default"}
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="text"
                  sx={{ fontWeight: 600 }}
                  onClick={() => onView(challenge.id)}
                >
                  {participantCounts[challenge.id] ?? challenge.participantCount ?? 0}
                </Button>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onView(challenge.id)}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                {canEdit && (
                  <>
                    <IconButton size="small" onClick={() => onEdit(challenge.id)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {challenge.status !== "Archived" && (
                      <IconButton size="small" onClick={() => onArchive(challenge.id)}>
                        <ArchiveIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRequestDelete(challenge.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
          {challenges.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No challenges found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
