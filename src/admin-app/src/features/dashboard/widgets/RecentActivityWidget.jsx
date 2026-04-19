import { Box, Typography, Chip, Stack } from "@mui/material";

import { EntityLink } from "../../../components/shared/data";

export default function RecentActivityWidget({ data }) {
  if (!data.recentActivity?.length) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
        No recent activity
      </Typography>
    );
  }

  return (
    <Stack spacing={0} sx={{ height: "100%", overflow: "auto" }}>
      {data.recentActivity.map((entry) => (
        <Box
          key={entry.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
            py: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={500}>
              <EntityLink type="users" id={entry.userId}>
                {entry.userName}
              </EntityLink>
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              completed <strong>{entry.actionName}</strong> in{" "}
              <EntityLink type="challenges" id={entry.challengeId}>
                {entry.challengeName}
              </EntityLink>
            </Typography>
          </Box>
          <Chip
            label={entry.completedAt}
            size="small"
            variant="outlined"
            sx={{ flexShrink: 0, fontSize: 11 }}
          />
        </Box>
      ))}
    </Stack>
  );
}
