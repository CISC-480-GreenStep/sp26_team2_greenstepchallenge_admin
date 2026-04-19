/**
 * UsersTable -- the users data grid on UsersPage.
 *
 * Column visibility is permission-driven and computed by the parent
 * (showEmail/showRole/...). Pure presentational; row clicks and
 * action-icon clicks fire callbacks back to the parent.
 */

import { useNavigate } from "react-router-dom";

import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import EntityLink from "../../../components/EntityLink";
import { USER_STATUSES } from "../../../data/api";

/**
 * Column-permission flags. Bundled into a single prop to keep the
 * UsersTable signature short and make permission propagation explicit.
 *
 * @typedef {object} ColumnPerms
 * @property {boolean} email
 * @property {boolean} role
 * @property {boolean} group
 * @property {boolean} status
 * @property {boolean} lastActive
 */

/**
 * @param {object} props
 * @param {Array<object>}  props.users
 * @param {(gid: number) => string} props.groupName  - id-to-name lookup
 * @param {ColumnPerms}    props.cols
 * @param {boolean}        props.canManage  - show Edit / toggle-status icons
 * @param {(user: object) => void} props.onToggleStatus  - asks parent to confirm
 */
export default function UsersTable({ users, groupName, cols, canManage, onToggleStatus }) {
  const navigate = useNavigate();

  // colSpan for the empty-state row: name + actions = 2, plus one
  // per visible permissioned column.
  const emptyColSpan =
    2 + (cols.email ? 1 : 0) + (cols.role ? 1 : 0) + (cols.group ? 1 : 0) +
    (cols.status ? 1 : 0) + (cols.lastActive ? 1 : 0);

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            {cols.email && <TableCell>Email</TableCell>}
            {cols.role && <TableCell>Role</TableCell>}
            {cols.group && <TableCell>Group</TableCell>}
            {cols.status && <TableCell>Status</TableCell>}
            {cols.lastActive && <TableCell>Last Active</TableCell>}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow
              key={u.id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/users/${u.id}`)}
            >
              <TableCell>{u.name}</TableCell>
              {cols.email && <TableCell>{u.email}</TableCell>}
              {cols.role && (
                <TableCell>
                  <Chip label={u.role} size="small" variant="outlined" />
                </TableCell>
              )}
              {cols.group && (
                <TableCell>
                  <EntityLink type="groups" id={u.groupId}>
                    {groupName(u.groupId) || "\u2014"}
                  </EntityLink>
                </TableCell>
              )}
              {cols.status && (
                <TableCell>
                  <Chip
                    label={u.status}
                    size="small"
                    color={u.status === USER_STATUSES.ACTIVE ? "success" : "default"}
                  />
                </TableCell>
              )}
              {cols.lastActive && <TableCell>{u.lastActive || "\u2014"}</TableCell>}
              <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <IconButton size="small" onClick={() => navigate(`/users/${u.id}`)}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                {canManage && (
                  <>
                    <IconButton size="small" onClick={() => navigate(`/users/${u.id}/edit`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color={u.status === USER_STATUSES.ACTIVE ? "error" : "success"}
                      onClick={() => onToggleStatus(u)}
                    >
                      {u.status === USER_STATUSES.ACTIVE ? (
                        <BlockIcon fontSize="small" />
                      ) : (
                        <CheckCircleIcon fontSize="small" />
                      )}
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={emptyColSpan} align="center">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
