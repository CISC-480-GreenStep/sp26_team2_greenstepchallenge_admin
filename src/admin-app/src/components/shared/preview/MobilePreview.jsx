/**
 * @file MobilePreview.jsx
 * @summary Stylized phone-frame preview of a challenge as mobile users will see it.
 *
 * Used on the Challenge detail page so admins can spot-check copy, theme
 * color, and the action list without opening the mobile app. Pure
 * presentational — no data fetching, just renders what's passed in.
 */

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";

/**
 * @param {object} props
 * @param {object | null} props.challenge - Challenge to render. Returns null when missing.
 * @param {object[]} props.actions - Actions associated with the challenge.
 */
export default function MobilePreview({ challenge, actions }) {
  if (!challenge) return null;

  return (
    <Box
      sx={{
        width: 300,
        height: 600,
        bgcolor: "#000", // Phone bezel
        borderRadius: "40px",
        p: 1.5,
        boxShadow: 10,
        mx: "auto",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "#fff",
          borderRadius: "30px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Mobile header: themed banner with the current challenge name. */}
        <Box
          sx={{
            bgcolor: challenge.theme || "#4CAF50",
            p: 3,
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.8, textTransform: "uppercase" }}>
            Current Challenge
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {challenge.name}
          </Typography>
        </Box>

        {/* Body: description + action checklist (read-only preview). */}
        <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            {challenge.description}
          </Typography>

          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Log Your Actions:
          </Typography>
          <List size="small">
            {actions.map((action) => (
              <ListItem key={action.id} sx={{ bgcolor: "#f5f5f5", borderRadius: 2, mb: 1 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <CheckCircleOutlineIcon fontSize="small" color="disabled" />
                </ListItemIcon>
                <ListItemText
                  primary={action.name}
                  secondary={`${action.points} pts`}
                  primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Faux tab bar so the preview reads as a phone shell. */}
        <Box
          sx={{
            height: 50,
            borderTop: "1px solid #eee",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "#ddd" }} />
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: challenge.theme,
            }}
          />
          <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "#ddd" }} />
        </Box>
      </Paper>
    </Box>
  );
}
