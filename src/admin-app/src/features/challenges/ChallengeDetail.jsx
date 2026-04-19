/**
 * ChallengeDetail -- read-only view of a single challenge with its
 * participants, leaderboard, action catalog, and per-completion log.
 *
 * Responsibilities (intentionally thin):
 *   - Load challenge, actions, participation, users, groups, leaderboard.
 *   - Build the small lookup helpers and the aggregated participants
 *     array from raw participation rows.
 *   - Render the header card, the four sub-tables, and the
 *     "View as User" mobile preview dialog.
 */

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";


import ChallengeLeaderboard from "./components/ChallengeLeaderboard";
import ParticipantsTable from "./components/ParticipantsTable";
import ParticipationLog from "./components/ParticipationLog";
import MobilePreview from "../../components/MobilePreview";
import {
  getActionsByChallenge,
  getChallengeById,
  getChallengeLeaderboard,
  getGroups,
  getParticipationByChallenge,
  getUsers,
} from "../../data/api";

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [actions, setActions] = useState([]);
  const [participation, setParticipation] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const cid = Number(id);
    Promise.all([
      getChallengeById(cid),
      getActionsByChallenge(cid),
      getParticipationByChallenge(cid),
      getUsers(),
      getGroups(),
      getChallengeLeaderboard(cid),
    ])
      .then(([c, a, p, u, g, lb]) => {
        setChallenge(c);
        setActions(a);
        setParticipation(p);
        setUsers(u);
        setGroups(g);
        setLeaderboard(lb);
      })
      .catch((err) => setError(err.message || "Failed to load challenge details"));
  }, [id]);

  if (!challenge) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const userName = (uid) => users.find((u) => u.id === uid)?.name || "Unknown";
  const actionName = (aid) => actions.find((a) => a.id === aid)?.name || "Unknown";
  const groupName = (gid) => groups.find((g) => g.id === gid)?.name || "\u2014";
  const participants = aggregateParticipants(participation, actions);

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

      <ChallengeSummaryCard
        challenge={challenge}
        groupName={groupName}
        onPreview={() => setPreviewOpen(true)}
        onNavigateGroup={(gid) => navigate(`/groups/${gid}`)}
      />

      <ParticipantsTable participants={participants} userName={userName} />

      <ChallengeLeaderboard entries={leaderboard} />

      <Typography variant="h6" fontWeight={600} mb={1}>
        Actions ({actions.length})
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actions.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.category}</TableCell>
                <TableCell align="right">{a.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ParticipationLog
        participation={participation}
        userName={userName}
        actionName={actionName}
        challengeName={challenge.name}
      />

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: { borderRadius: "20px", bgcolor: "transparent", boxShadow: "none" },
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <MobilePreview challenge={challenge} actions={actions} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

/**
 * Aggregate raw participation rows into per-user (count, points)
 * tuples sorted by points desc. Pulled out so the page render stays
 * declarative.
 */
function aggregateParticipants(participation, actions) {
  const map = {};
  participation.forEach((p) => {
    if (!map[p.userId]) {
      map[p.userId] = { userId: p.userId, count: 0, points: 0 };
    }
    const action = actions.find((a) => a.id === p.actionId);
    map[p.userId].count += 1;
    map[p.userId].points += action?.points || 0;
  });
  return Object.values(map).sort((a, b) => b.points - a.points);
}

/**
 * The header card showing name, status chip, color dot, "View as User"
 * button, and the four-up metadata grid (category / group / start / end).
 * Inlined here because it has no other consumer and would only add
 * indirection as its own file.
 */
function ChallengeSummaryCard({ challenge, groupName, onPreview, onNavigateGroup }) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            bgcolor: challenge.theme,
            flexShrink: 0,
          }}
        />
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ fontSize: { xs: "1.15rem", sm: "1.5rem" } }}
        >
          {challenge.name}
        </Typography>
        <Chip label={challenge.status} size="small" />
        <Button
          variant="outlined"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={onPreview}
          sx={{ ml: "auto" }}
        >
          View as User
        </Button>
      </Box>

      <Typography color="text.secondary" mb={2}>
        {challenge.description}
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Category
          </Typography>
          <Typography>{challenge.category}</Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Group
          </Typography>
          {challenge.groupId ? (
            <Button
              size="small"
              sx={{ p: 0, minWidth: "auto", textTransform: "none" }}
              onClick={() => onNavigateGroup(challenge.groupId)}
            >
              {groupName(challenge.groupId)}
            </Button>
          ) : (
            <Typography>{"\u2014"}</Typography>
          )}
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Start
          </Typography>
          <Typography>{challenge.startDate}</Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Typography variant="body2" color="text.secondary">
            End
          </Typography>
          <Typography>{challenge.endDate}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
