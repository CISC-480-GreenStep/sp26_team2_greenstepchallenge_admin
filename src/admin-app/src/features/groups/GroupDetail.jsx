/**
 * GroupDetail -- single-group page showing the group header card,
 * its members table, and the (optional) list of challenges scoped
 * to the group.
 *
 * Responsibilities (intentionally thin):
 *   - Load group, users, challenges in parallel.
 *   - Own the Add-Member, Remove-Member, and Delete-Group dialog
 *     state and the corresponding mutation callbacks.
 *   - Delegate row-rendering to MembersTable / GroupChallengesTable.
 */

import { useCallback, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import GroupChallengesTable from "./components/GroupChallengesTable";
import MembersTable from "./components/MembersTable";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { deleteGroup, getChallenges, getGroupById, getUsers, updateUser } from "../../data/api";
import { useAuth } from "../auth/useAuth";

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canManage = hasRole("Admin");

  const [group, setGroup] = useState(null);
  const [users, setUsers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [pendingRemoveUser, setPendingRemoveUser] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Stable callback so mutate handlers can re-fetch without retriggering the
  // mount effect. Wrapped in useCallback to satisfy exhaustive-deps when used
  // as a dependency below.
  const load = useCallback(async () => {
    try {
      const gid = Number(id);
      const [g, u, c] = await Promise.all([getGroupById(gid), getUsers(), getChallenges()]);
      setGroup(g);
      setUsers(u);
      setChallenges(c);
    } catch (err) {
      setError(err.message || "Failed to load group details");
    }
  }, [id]);

  // Fetch on mount and whenever the route id changes. Disabling
  // set-state-in-effect here is the lesser evil: this is a route-driven
  // initial fetch, not a derived-state pattern. Mutations re-call load()
  // outside the effect.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  if (!group) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const members = users.filter((u) => u.groupId === group.id);
  const groupChallenges = challenges.filter((c) => c.groupId === group.id);
  const usersNotInGroup = users.filter((u) => u.groupId !== group.id);

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    await updateUser(Number(selectedUserId), { groupId: group.id });
    setSelectedUserId("");
    setAddDialogOpen(false);
    load();
  };

  const handleRemoveMember = async () => {
    if (!pendingRemoveUser) return;
    await updateUser(pendingRemoveUser.id, { groupId: null });
    setPendingRemoveUser(null);
    setConfirmRemoveOpen(false);
    load();
  };

  const handleDeleteGroup = async () => {
    await deleteGroup(group.id);
    setConfirmDeleteOpen(false);
    navigate("/groups");
  };

  const requestRemove = (user) => {
    setPendingRemoveUser(user);
    setConfirmRemoveOpen(true);
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <GroupHeaderCard
        group={group}
        memberCount={members.length}
        challengeCount={groupChallenges.length}
        canManage={canManage}
        onEdit={() => navigate(`/groups/${group.id}/edit`)}
        onDelete={() => setConfirmDeleteOpen(true)}
      />

      <MembersTable
        members={members}
        canManage={canManage}
        canAddMore={usersNotInGroup.length > 0}
        onAddClick={() => setAddDialogOpen(true)}
        onRemoveClick={requestRemove}
      />

      {groupChallenges.length > 0 && <GroupChallengesTable challenges={groupChallenges} />}

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Member to {group.name}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Select user"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            sx={{ mt: 1 }}
          >
            <MenuItem value="">Choose a user...</MenuItem>
            {usersNotInGroup.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name} ({u.email})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddMember} disabled={!selectedUserId}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmRemoveOpen}
        title="Remove from Group"
        message={`Remove ${pendingRemoveUser?.name} from ${group.name}? They will have no group assignment.`}
        onConfirm={handleRemoveMember}
        onCancel={() => {
          setConfirmRemoveOpen(false);
          setPendingRemoveUser(null);
        }}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete Group"
        message="Are you sure you want to delete this group? Users and challenges in this group will become unassigned."
        onConfirm={handleDeleteGroup}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </Box>
  );
}

/**
 * Header card with group name, description, and the Edit/Delete
 * actions (Admin-only). Inlined because it has no other consumer
 * and pulling it out would only add a one-call indirection.
 */
function GroupHeaderCard({
  group,
  memberCount,
  challengeCount,
  canManage,
  onEdit,
  onDelete,
}) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <GroupsIcon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ fontSize: { xs: "1.15rem", sm: "1.5rem" } }}
          >
            {group.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {group.description || "No description"}
          </Typography>
        </Box>
        {canManage && (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={onEdit}>
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
            >
              Delete
            </Button>
          </Stack>
        )}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {memberCount} member{memberCount !== 1 ? "s" : ""} · {challengeCount} challenge
        {challengeCount !== 1 ? "s" : ""} · Created {group.createdAt}
      </Typography>
    </Paper>
  );
}
