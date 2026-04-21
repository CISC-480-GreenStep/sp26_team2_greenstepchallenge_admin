/**
 * @file ChallengesPage.jsx
 * @summary Top-level Challenges list page.
 *
 * Owns:
 *   - data loading (`getChallenges` + `getGroups` + `getParticipantCounts`),
 *   - filter state (search, status, group),
 *   - permission resolution via `useAuth().hasRole`,
 *   - mutation handlers (archive, delete) and the confirm dialog state.
 *
 * Delegates all rendering to `ChallengesToolbar`, `ChallengesFilterBar`,
 * and `ChallengesTable`.
 */

import { useCallback, useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { Box, CircularProgress, Alert } from "@mui/material";

import ChallengesFilterBar from "./components/ChallengesFilterBar";
import ChallengesTable from "./components/ChallengesTable";
import ChallengesToolbar from "./components/ChallengesToolbar";
import { ConfirmDialog } from "../../components/shared/feedback";
import {
  archiveChallenge,
  deleteChallenge,
  getChallenges,
  getGroups,
  getParticipantCounts,
  logActivity,
} from "../../data/api";
import { useAuth } from "../auth/useAuth";

export default function ChallengesPage() {
  const [searchParams] = useSearchParams();
  const initialGroupFilter = searchParams.get("groupId") || "All";

  const [challenges, setChallenges] = useState([]);
  const [groups, setGroups] = useState([]);
  const [participantCounts, setParticipantCounts] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState(initialGroupFilter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const canEdit = hasRole("Admin");

  // Stable so post-mutation handlers can refresh without re-triggering the
  // mount effect.
  const load = useCallback(async () => {
    try {
      const [c, g, counts] = await Promise.all([
        getChallenges(),
        getGroups(),
        getParticipantCounts(),
      ]);
      setChallenges(c);
      setGroups(g);
      setParticipantCounts(counts);
    } catch (err) {
      setError(err.message || "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Sync with deep-link `?groupId=` updates from elsewhere in the app.
  useEffect(() => {
    const gid = searchParams.get("groupId");
    if (gid) setGroupFilter(gid);
  }, [searchParams]);

  const groupName = (gid) => groups.find((g) => g.id === gid)?.name || "";

  const filtered = challenges.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesGroup = groupFilter === "All" || c.groupId === Number(groupFilter);
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const handleArchive = async (id) => {
    const c = challenges.find((ch) => ch.id === id);
    await archiveChallenge(id);
    await logActivity(user?.id, "Archived challenge", `Archived ${c?.name || "challenge"}`);
    load();
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const c = challenges.find((ch) => ch.id === pendingDelete);
    await deleteChallenge(pendingDelete);
    await logActivity(user?.id, "Deleted challenge", `Deleted ${c?.name || "challenge"}`);
    setPendingDelete(null);
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

      <ChallengesToolbar
        exportData={filtered}
        canEdit={canEdit}
        onManagePresets={() => navigate("/presets")}
        onNewChallenge={() => navigate("/challenges/new")}
      />

      <ChallengesFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        groupFilter={groupFilter}
        onGroupChange={setGroupFilter}
        groups={groups}
      />

      <ChallengesTable
        challenges={filtered}
        participantCounts={participantCounts}
        groupName={groupName}
        canEdit={canEdit}
        onView={(id) => navigate(`/challenges/${id}`)}
        onEdit={(id) => navigate(`/challenges/${id}/edit`)}
        onArchive={handleArchive}
        onRequestDelete={(id) => {
          setPendingDelete(id);
          setConfirmOpen(true);
        }}
        onNavigateGroup={(gid) => navigate(`/groups/${gid}`)}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Challenge"
        message="Are you sure you want to permanently delete this challenge? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
      />
    </Box>
  );
}
