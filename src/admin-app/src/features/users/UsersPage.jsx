import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  getUsers,
  deactivateUser,
  activateUser,
  deleteUser,
  logActivity,
  ROLES,
  USER_STATUSES,
  getGroups,
} from "../../data/api";
import { useAuth } from "../auth/AuthContext";
import { can } from "../../lib/permissions";
import CSVExport from "../../components/shared/CSVExport";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import EntityLink from "../../components/EntityLink";

export default function UsersPage() {
  //reads 'group ID' from URL
  const queryParams = new URLSearchParams(window.location.search);
  const initialGroupFilter = queryParams.get("groupId") || "All";

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState(initialGroupFilter);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();

  const { user, hasRole } = useAuth();
  const userRole = user?.role || ROLES.GENERAL_USER;
  const canManage = hasRole("Admin");
  const isSuperAdmin = hasRole("SuperAdmin");
  const showEmail = can(userRole, "VIEW_USER_EMAIL");
  const showRole = can(userRole, "VIEW_USER_ROLE");
  const showGroup = can(userRole, "VIEW_USER_GROUP");
  const showStatus = can(userRole, "VIEW_USER_STATUS");
  const showLastActive = can(userRole, "VIEW_USER_LAST_ACTIVE");

  const load = async () => {
    try {
      const [u, g] = await Promise.all([getUsers(), getGroups()]);
      setUsers(u);
      setGroups(g);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const groupName = (gid) => groups.find((g) => g.id === gid)?.name || "";

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesGroup =
      groupFilter === "All" || u.groupId === Number(groupFilter);
    return matchesSearch && matchesRole && matchesGroup;
  });

  const handleToggleStatus = async () => {
    if (!pendingAction) return;
    const wasActive = pendingAction.status === USER_STATUSES.ACTIVE;
    if (wasActive) {
      await deactivateUser(pendingAction.id);
    } else {
      await activateUser(pendingAction.id);
    }
    await logActivity(
      user.id,
      wasActive ? 'Deactivated user' : 'Activated user',
      `${wasActive ? 'Deactivated' : 'Activated'} ${pendingAction.name}`
    );
    setPendingAction(null);
    setConfirmOpen(false);
    load();
  };

  const handleDeleteUser = async () => {
    if (!pendingDelete) return;
    await deleteUser(pendingDelete.id, pendingDelete.email);
    setPendingDelete(null);
    setDeleteConfirmOpen(false);
    load();
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
        >
          Users
        </Typography>
        <Stack direction="row" spacing={1}>
          <CSVExport data={filtered} filename="users.csv" />
          {isSuperAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/users/new")}
            >
              New User
            </Button>
          )}
        </Stack>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
        <TextField
          size="small"
          label="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 220 }}
        />
        <TextField
          size="small"
          select
          label="Role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="All">All</MenuItem>
          {Object.values(ROLES).map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          select
          label="Group"
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="All">All Groups</MenuItem>
          {groups.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {showEmail && <TableCell>Email</TableCell>}
              {showRole && <TableCell>Role</TableCell>}
              {showGroup && <TableCell>Group</TableCell>}
              {showStatus && <TableCell>Status</TableCell>}
              {showLastActive && <TableCell>Last Active</TableCell>}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((u) => (
              <TableRow
                key={u.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/users/${u.id}`)}
              >
                <TableCell>{u.name}</TableCell>
                {showEmail && <TableCell>{u.email}</TableCell>}
                {showRole && (
                  <TableCell>
                    <Chip label={u.role} size="small" variant="outlined" />
                  </TableCell>
                )}
                {showGroup && (
                  <TableCell>
                    <EntityLink type="groups" id={u.groupId}>
                      {groupName(u.groupId) || "—"}
                    </EntityLink>
                  </TableCell>
                )}
                {showStatus && (
                  <TableCell>
                    <Chip
                      label={u.status}
                      size="small"
                      color={
                        u.status === USER_STATUSES.ACTIVE ? "success" : "default"
                      }
                    />
                  </TableCell>
                )}
                  {showLastActive && <TableCell>{u.lastActive || "—"}</TableCell>}
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/users/${u.id}`)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  {canManage && (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/users/${u.id}/edit`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color={
                          u.status === USER_STATUSES.ACTIVE
                            ? "error"
                            : "success"
                        }
                        onClick={() => {
                          setPendingAction(u);
                          setConfirmOpen(true);
                        }}
                      >
                        {u.status === USER_STATUSES.ACTIVE ? (
                          <BlockIcon fontSize="small" />
                        ) : (
                          <CheckCircleIcon fontSize="small" />
                        )}
                      </IconButton>
                      {isSuperAdmin && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setPendingDelete(u);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    2 +
                    (showEmail ? 1 : 0) +
                    (showRole ? 1 : 0) +
                    (showGroup ? 1 : 0) +
                    (showStatus ? 1 : 0) +
                    (showLastActive ? 1 : 0)
                  }
                  align="center"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirmOpen}
        title={
          pendingAction?.status === USER_STATUSES.ACTIVE
            ? "Deactivate User"
            : "Activate User"
        }
        message={`Are you sure you want to ${pendingAction?.status === USER_STATUSES.ACTIVE ? "deactivate" : "activate"} ${pendingAction?.name}?`}
        onConfirm={handleToggleStatus}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingAction(null);
        }}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete User"
        message={`Are you sure you want to permanently delete ${pendingDelete?.name}? This will remove their account and allow them to be invited again. This action cannot be undone.`}
        onConfirm={handleDeleteUser}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setPendingDelete(null);
        }}
      />
    </Box>
  );
}
