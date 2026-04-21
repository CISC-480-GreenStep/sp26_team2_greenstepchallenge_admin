/**
 * @file UsersPage.jsx
 * @summary UsersPage -- list of all users with role/group filters, CSV export,
 * and admin actions (edit, activate/deactivate).
 *
 * Responsibilities (intentionally thin):
 *   - Load users + groups in parallel; surface loading and error UI.
 *   - Own filter state (search, role, group); compute the filtered
 *     view; resolve column-permission flags from the auth context.
 *   - Own the activate/deactivate confirmation dialog and its
 *     activity-log side effect.
 *   - Delegate filter chrome to UsersFilterBar and the data grid to
 *     UsersTable.
 */

import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";

import UsersFilterBar from "./components/UsersFilterBar";
import UsersTable from "./components/UsersTable";
import { CSVExport } from "../../components/shared/data";
import { ConfirmDialog } from "../../components/shared/feedback";
import {
  ROLES,
  USER_STATUSES,
  activateUser,
  deactivateUser,
  getGroups,
  getUsers,
  logActivity,
} from "../../data/api";
import { can } from "../../lib/permissions";
import { useAuth } from "../auth/useAuth";

export default function UsersPage() {
  // Pre-seed the group filter from the URL so links from GroupDetail
  // ("show all members") deep-link straight into a filtered list.
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

  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const userRole = user?.role || ROLES.GENERAL_USER;
  const canManage = hasRole("Admin");
  const isSuperAdmin = hasRole("SuperAdmin");

  // Column-visibility flags driven by the permissions matrix.
  const cols = {
    email: can(userRole, "VIEW_USER_EMAIL"),
    role: can(userRole, "VIEW_USER_ROLE"),
    group: can(userRole, "VIEW_USER_GROUP"),
    status: can(userRole, "VIEW_USER_STATUS"),
    lastActive: can(userRole, "VIEW_USER_LAST_ACTIVE"),
  };

  const load = useCallback(async () => {
    try {
      const [u, g] = await Promise.all([getUsers(), getGroups()]);
      setUsers(u);
      setGroups(g);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const groupName = (gid) => groups.find((g) => g.id === gid)?.name || "";

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesGroup = groupFilter === "All" || u.groupId === Number(groupFilter);
    return matchesSearch && matchesRole && matchesGroup;
  });

  const requestToggleStatus = (target) => {
    setPendingAction(target);
    setConfirmOpen(true);
  };

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
      wasActive ? "Deactivated user" : "Activated user",
      `${wasActive ? "Deactivated" : "Activated"} ${pendingAction.name}`,
    );
    setPendingAction(null);
    setConfirmOpen(false);
    load();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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

      <UsersFilterBar
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        groupFilter={groupFilter}
        onGroupChange={setGroupFilter}
        groups={groups}
      />

      <UsersTable
        users={filtered}
        groupName={groupName}
        cols={cols}
        canManage={canManage}
        onToggleStatus={requestToggleStatus}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={pendingAction?.status === USER_STATUSES.ACTIVE ? "Deactivate User" : "Activate User"}
        message={`Are you sure you want to ${
          pendingAction?.status === USER_STATUSES.ACTIVE ? "deactivate" : "activate"
        } ${pendingAction?.name}?`}
        onConfirm={handleToggleStatus}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingAction(null);
        }}
      />
    </Box>
  );
}
