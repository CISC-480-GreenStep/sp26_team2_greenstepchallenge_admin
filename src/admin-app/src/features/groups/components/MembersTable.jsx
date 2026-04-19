/**
 * @file MembersTable.jsx
 * @summary MembersTable -- "Members" section on GroupDetail.
 *
 * Renders the section header (with "Add Member" button) and the
 * members table. Pure presentational; the parent owns the data,
 * dialog state, and mutation calls.
 */

import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  Box,
  Button,
  IconButton,
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

/**
 * @param {object} props
 * @param {Array<object>} props.members        - users currently in the group
 * @param {boolean}       props.canManage      - whether to show edit affordances
 * @param {boolean}       props.canAddMore     - disable the Add button when no candidates
 * @param {() => void}    props.onAddClick     - opens the parent's add-member dialog
 * @param {(user: object) => void} props.onRemoveClick - asks parent to confirm removal
 */
export default function MembersTable({
  members,
  canManage,
  canAddMore,
  onAddClick,
  onRemoveClick,
}) {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        flexWrap="wrap"
        gap={1}
      >
        <Typography variant="h6" fontWeight={600}>
          Members ({members.length})
        </Typography>
        {canManage && (
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            disabled={!canAddMore}
          >
            Add Member
          </Button>
        )}
      </Stack>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              {canManage ? <TableCell align="right">Actions</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>
                  <Button
                    size="small"
                    sx={{ p: 0, minWidth: "auto", textTransform: "none" }}
                    onClick={() => navigate(`/users/${u.id}`)}
                  >
                    {u.name}
                  </Button>
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.status}</TableCell>
                {canManage ? (
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      title="Remove from group"
                      onClick={() => onRemoveClick(u)}
                    >
                      <PersonRemoveIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell colSpan={canManage ? 5 : 4} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No members yet. Add members to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
