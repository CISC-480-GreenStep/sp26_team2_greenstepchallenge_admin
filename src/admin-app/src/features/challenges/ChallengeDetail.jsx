import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  getChallengeById,
  getActionsByChallenge,
  getParticipationByChallenge,
  getUsers,
  getGroups,
  getChallengeLeaderboard,
} from "../../data/api";
import CSVExport from "../../components/shared/CSVExport";
import EntityLink from "../../components/EntityLink";

import { Dialog, DialogContent } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MobilePreview from "../../components/MobilePreview";

export default function ChallengeDetail() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [actions, setActions] = useState([]);
  const [participation, setParticipation] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cid = Number(id);
    setLoading(true);
    Promise.all([
      getChallengeById(cid),
      getActionsByChallenge(cid),
      getParticipationByChallenge(cid),
      getUsers(),
      getGroups(),
      getChallengeLeaderboard(cid),
    ]).then(([c, a, p, u, g, lb]) => {
      setChallenge(c);
      setActions(a);
      setParticipation(p);
      setUsers(u);
      setGroups(g);
      setLeaderboard(lb);
    }).catch((err) => {
      setError(err.message || 'Failed to load challenge details');
    }).finally(() => {
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (error && !challenge) return <Box sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Box>;

  const userName = (uid) => users.find((u) => u.id === uid)?.name || "Unknown";
  const actionName = (aid) =>
    actions.find((a) => a.id === aid)?.name || "Unknown";
  const groupName = (gid) => groups.find((g) => g.id === gid)?.name || "—";

  const participationExport = participation.map((p) => ({
    User: userName(p.userId),
    Action: actionName(p.actionId),
    Date: p.completedAt,
    Notes: p.notes,
  }));

  const participantMap = {};
  participation.forEach((p) => {
    const uid = p.userId;
    if (!participantMap[uid]) {
      participantMap[uid] = { userId: uid, count: 0, points: 0 };
    }
    const action = actions.find((a) => a.id === p.actionId);
    participantMap[uid].count += 1;
    participantMap[uid].points += action?.points || 0;
  });
  const participants = Object.values(participantMap).sort(
    (a, b) => b.points - a.points
  );

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

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
            onClick={() => setPreviewOpen(true)}
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
                onClick={() => navigate(`/groups/${challenge.groupId}`)}
              >
                {groupName(challenge.groupId)}
              </Button>
            ) : (
              <Typography>—</Typography>
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

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={1}>
          Participants ({participants.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Users who have completed at least one action in this challenge
        </Typography>
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell align="right">Actions Completed</TableCell>
                <TableCell align="right">Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((entry) => (
                <TableRow key={entry.userId} hover>
                  <TableCell>
                    <Button
                      size="small"
                      sx={{
                        p: 0,
                        minWidth: "auto",
                        textTransform: "none",
                      }}
                      onClick={() => navigate(`/users/${entry.userId}`)}
                    >
                      {userName(entry.userId)}
                    </Button>
                  </TableCell>
                  <TableCell align="right">{entry.count}</TableCell>
                  <TableCell align="right">{entry.points}</TableCell>
                </TableRow>
              ))}
              {participants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      No participants yet
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {leaderboard.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <EmojiEventsIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Challenge Leaderboard
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {leaderboard.map((entry, i) => {
                const pct =
                  entry.maxPoints > 0
                    ? Math.round((entry.points / entry.maxPoints) * 100)
                    : 0;
                return (
                  <Grid key={entry.userId} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            label={`#${i + 1}`}
                            size="small"
                            sx={
                              i < 3
                                ? {
                                    bgcolor: ["#FFD700", "#C0C0C0", "#CD7F32"][
                                      i
                                    ],
                                    color: "#fff",
                                    fontWeight: 700,
                                  }
                                : { fontWeight: 600 }
                            }
                          />
                          <Typography variant="body2" fontWeight={600}>
                            <EntityLink type="users" id={entry.userId}>{entry.name}</EntityLink>
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={700}>
                          {entry.points} pts
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{ height: 6, borderRadius: 3, mb: 0.5 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {entry.actionCount} action
                        {entry.actionCount !== 1 ? "s" : ""} completed &middot;{" "}
                        {pct}% of max
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

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

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        flexWrap="wrap"
        gap={1}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          Participation Log ({participation.length})
        </Typography>
        <CSVExport
          data={participationExport}
          filename={`${challenge.name.replace(/\s+/g, "_")}_participation.csv`}
        />
      </Stack>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participation.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <EntityLink type="users" id={p.userId}>{userName(p.userId)}</EntityLink>
                </TableCell>
                <TableCell>{actionName(p.actionId)}</TableCell>
                <TableCell>{p.completedAt}</TableCell>
                <TableCell>{p.notes || "—"}</TableCell>
              </TableRow>
            ))}
            {participation.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No participation yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              bgcolor: "transparent",
              boxShadow: "none",
            },
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
