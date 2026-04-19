/**
 * @file UserDetail.jsx
 * @summary UserDetail -- single-user page showing the header summary, optional
 * points history, participation log, and admin activity log.
 *
 * Responsibilities (intentionally thin):
 *   - Load user, logs, participation, challenges, actions, points,
 *     and groups in parallel.
 *   - Resolve column/section visibility flags from the auth context.
 *   - Provide id-to-name lookups to the sub-components.
 *   - Inline UserSummaryCard (header + group editor) since it has no
 *     other consumer.
 */

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import ParticipationHistoryTable from "./components/ParticipationHistoryTable";
import PointsHistoryTable from "./components/PointsHistoryTable";
import UserActivityLogList from "./components/UserActivityLogList";
import {
  ROLES,
  getActions,
  getActivityLogsByUser,
  getChallenges,
  getGroups,
  getParticipationByUser,
  getUserById,
  getUserPoints,
  updateUser,
} from "../../data/api";
import { can } from "../../lib/permissions";
import { useAuth } from "../auth/useAuth";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const userRole = currentUser?.role || ROLES.GENERAL_USER;

  // Permission flags collapsed into a single object so passing them
  // around stays compact.
  const perms = {
    email: can(userRole, "VIEW_USER_EMAIL"),
    role: can(userRole, "VIEW_USER_ROLE"),
    group: can(userRole, "VIEW_USER_GROUP"),
    status: can(userRole, "VIEW_USER_STATUS"),
    activityLog: can(userRole, "VIEW_USER_ACTIVITY_LOG"),
    participation: can(userRole, "VIEW_USER_PARTICIPATION"),
    points: can(userRole, "VIEW_USER_POINTS"),
    changeGroup: can(userRole, "CHANGE_USER_GROUP"),
  };

  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [participation, setParticipation] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [actions, setActions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [points, setPoints] = useState({ total: 0, breakdown: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const uid = Number(id);
    Promise.all([
      getUserById(uid),
      getActivityLogsByUser(uid),
      getParticipationByUser(uid),
      getChallenges(),
      getActions(),
      getUserPoints(uid),
      getGroups(),
    ])
      .then(([u, l, p, c, a, pts, g]) => {
        setUser(u);
        setLogs(l);
        setParticipation(p);
        setChallenges(c);
        setActions(a);
        setPoints(pts);
        setGroups(g);
      })
      .catch((err) => setError(err.message || "Failed to load user details"));
  }, [id]);

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const challengeName = (cid) => challenges.find((c) => c.id === cid)?.name || "Unknown";
  const actionName = (aid) => actions.find((a) => a.id === aid)?.name || "Unknown";
  const groupName = (gid) => groups.find((g) => g.id === gid)?.name || "\u2014";

  const handleGroupChange = async (rawValue) => {
    const gid = rawValue ? Number(rawValue) : null;
    await updateUser(user.id, { groupId: gid });
    setUser((u) => ({ ...u, groupId: gid }));
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

      <UserSummaryCard
        user={user}
        perms={perms}
        groups={groups}
        groupName={groupName}
        onGroupChange={handleGroupChange}
        onNavigateGroup={(gid) => navigate(`/groups/${gid}`)}
      />

      {perms.points && <PointsHistoryTable points={points} />}

      {perms.participation && (
        <ParticipationHistoryTable
          participation={participation}
          userName={user.name}
          challengeName={challengeName}
          actionName={actionName}
        />
      )}

      {perms.activityLog && <UserActivityLogList logs={logs} userName={user.name} />}
    </Box>
  );
}

/**
 * Header card with name + the four-up email/role/status/group grid.
 * The Group cell flips between an inline select (when canChangeGroup)
 * and a navigation button. Inlined here because it has no other
 * consumer and pulling it out would only add indirection.
 */
function UserSummaryCard({ user, perms, groups, groupName, onGroupChange, onNavigateGroup }) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={1}
        sx={{ fontSize: { xs: "1.15rem", sm: "1.5rem" }, wordBreak: "break-word" }}
      >
        {user.name}
      </Typography>

      <Grid container spacing={2}>
        {perms.email && (
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography sx={{ wordBreak: "break-all", fontSize: { xs: "0.8rem", sm: "1rem" } }}>
              {user.email}
            </Typography>
          </Grid>
        )}

        {perms.role && (
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Role
            </Typography>
            <Chip label={user.role} size="small" />
          </Grid>
        )}

        {perms.status && (
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={user.status}
              size="small"
              color={user.status === "Active" ? "success" : "default"}
            />
          </Grid>
        )}

        {perms.group && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Group
            </Typography>
            {perms.changeGroup ? (
              <TextField
                select
                size="small"
                value={user.groupId || ""}
                onChange={(e) => onGroupChange(e.target.value)}
                sx={{ mt: 0.5, minWidth: 180 }}
              >
                <MenuItem value="">No Group</MenuItem>
                {groups.map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.name}
                  </MenuItem>
                ))}
              </TextField>
            ) : user.groupId ? (
              <Button
                size="small"
                sx={{ p: 0, minWidth: "auto", textTransform: "none" }}
                onClick={() => onNavigateGroup(user.groupId)}
              >
                {groupName(user.groupId)}
              </Button>
            ) : (
              <Typography>{"\u2014"}</Typography>
            )}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
