/**
 * @file StatCard.jsx
 * @summary KPI tile used on the dashboard and other summary surfaces.
 *
 * A simple card with a label, large value, and an optional icon. Sizes
 * scale down on small screens so multi-column stat rows still fit.
 */

import { Box, Card, CardContent, Typography } from "@mui/material";

/**
 * @param {object} props
 * @param {string} props.title
 * @param {React.ReactNode} props.value - Usually a number; `ReactNode` so callers can format it.
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.color] - MUI palette token for the icon color.
 */
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
