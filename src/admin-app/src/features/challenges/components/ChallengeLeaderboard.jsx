/**
 * ChallengeLeaderboard -- the top-scorers card on ChallengeDetail.
 *
 * Renders one tile per leaderboard entry with rank chip, points,
 * progress vs. challenge max, and action count. Hidden entirely when
 * the leaderboard is empty.
 */

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

import { EntityLink } from "../../../components/shared/data";

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

/**
 * @param {object} props
 * @param {Array<{ userId: number, name: string, points: number, maxPoints: number, actionCount: number }>} props.entries
 */
export default function ChallengeLeaderboard({ entries }) {
  if (entries.length === 0) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <EmojiEventsIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Challenge Leaderboard
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {entries.map((entry, i) => (
            <Grid key={entry.userId} size={{ xs: 12, sm: 6, md: 4 }}>
              <LeaderboardTile entry={entry} rank={i} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

function LeaderboardTile({ entry, rank }) {
  const pct = entry.maxPoints > 0 ? Math.round((entry.points / entry.maxPoints) * 100) : 0;
  const medalSx =
    rank < 3
      ? { bgcolor: MEDAL_COLORS[rank], color: "#fff", fontWeight: 700 }
      : { fontWeight: 600 };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip label={`#${rank + 1}`} size="small" sx={medalSx} />
          <Typography variant="body2" fontWeight={600}>
            <EntityLink type="users" id={entry.userId}>
              {entry.name}
            </EntityLink>
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
        {entry.actionCount} action{entry.actionCount !== 1 ? "s" : ""} completed &middot; {pct}% of
        max
      </Typography>
    </Paper>
  );
}
