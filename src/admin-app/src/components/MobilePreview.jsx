import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";

export default function MobilePreview({ challenge, actions }) {
  if (!challenge) return null;

  return (
    <Box
      sx={{
        width: 300,
        height: 600,
        bgcolor: "#000", // Phone border
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
        {/* Mobile Header */}
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

        {/* Mobile Body */}
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

        {/* Mobile Footer Tab Bar */}
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
