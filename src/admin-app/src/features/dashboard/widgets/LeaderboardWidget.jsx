/**
 * @file LeaderboardWidget.jsx
 * @summary Top participants by total points, with medal accents for the top 3.
 */

import { Box, Typography, Chip, LinearProgress, Stack } from "@mui/material";

import { EntityLink } from "../../../components/shared/data";
import { MEDAL_COLORS } from "../../../lib/constants";

export default function LeaderboardWidget({ data }) {
  const max = data.leaderboard[0]?.points || 1;

  if (data.leaderboard.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
        No participation data yet
      </Typography>
    );
  }

  return (
    <Stack spacing={2} sx={{ height: "100%", overflow: "auto" }}>
      {data.leaderboard.map((entry, i) => (
        <Box key={entry.userId}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {i < 3 ? (
                <Chip
                  label={i + 1}
                  size="small"
                  sx={{ bgcolor: MEDAL_COLORS[i], color: "#fff", fontWeight: 700, minWidth: 28 }}
                />
              ) : (
                <Chip label={i + 1} size="small" variant="outlined" sx={{ minWidth: 28 }} />
              )}
              <Typography variant="body2" fontWeight={i < 3 ? 600 : 400}>
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
            value={(entry.points / max) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                bgcolor:
                  i === 0 ? "#FFD700" : i === 1 ? "#90A4AE" : i === 2 ? "#CD7F32" : "primary.main",
              },
            }}
          />
        </Box>
      ))}
    </Stack>
  );
}
