import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatCard({ title, value, icon, color = "primary.main" }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
            >
              {value}
            </Typography>
          </Box>
          {icon && <Box sx={{ color, fontSize: 40, opacity: 0.8 }}>{icon}</Box>}
        </Box>
      </CardContent>
    </Card>
  );
}
