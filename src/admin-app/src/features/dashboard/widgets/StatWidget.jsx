import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Typography } from "@mui/material";

const CONFIGS = {
  "stat-active-challenges": {
    key: "activeChallenges",
    icon: <EventIcon fontSize="inherit" />,
    color: "#4CAF50",
  },
  "stat-total-actions": {
    key: "totalParticipation",
    icon: <EnergySavingsLeafIcon fontSize="inherit" />,
    color: "#2196F3",
  },
  "stat-active-users": {
    key: "activeUsers",
    icon: <PeopleIcon fontSize="inherit" />,
    color: "#FF9800",
  },
  "stat-total-points": {
    key: "totalPoints",
    icon: <StarIcon fontSize="inherit" />,
    color: "#9C27B0",
  },
  "stat-completion-rate": {
    key: "completionRate",
    icon: <CheckCircleIcon fontSize="inherit" />,
    color: "#00BCD4",
    suffix: "%",
  },
  "stat-avg-points": {
    key: "avgPointsPerUser",
    icon: <TrendingUpIcon fontSize="inherit" />,
    color: "#FF5722",
  },
  "stat-new-users": {
    key: "newUsersThisMonth",
    icon: <PersonAddIcon fontSize="inherit" />,
    color: "#3F51B5",
  },
  "stat-top-category": {
    key: "topCategory",
    icon: <CategoryIcon fontSize="inherit" />,
    color: "#795548",
    isText: true,
  },
};

export default function StatWidget({ data, widgetId }) {
  const cfg = CONFIGS[widgetId];
  if (!cfg) return null;

  const raw = data[cfg.key];
  const display = cfg.suffix ? `${raw}${cfg.suffix}` : raw;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Typography
        variant={cfg.isText ? "body1" : "h5"}
        fontWeight={700}
        sx={{
          fontSize: cfg.isText
            ? { xs: "0.8rem", sm: "1rem" }
            : { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
        }}
      >
        {display}
      </Typography>
      <Box
        sx={{ color: cfg.color, fontSize: { xs: 28, sm: 34 }, opacity: 0.8, flexShrink: 0, ml: 1 }}
      >
        {cfg.icon}
      </Box>
    </Box>
  );
}
