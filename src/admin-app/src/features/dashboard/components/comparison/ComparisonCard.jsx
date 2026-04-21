/**
 * @file ComparisonCard.jsx
 * @summary Shared resizable card wrapper used by every Comparison Mode chart.
 *
 * Each comparison chart was duplicating the same Card + CardContent +
 * resize/overflow styles. Extracting the wrapper keeps the chart files
 * focused on their `<ResponsiveContainer>` payload and ensures a
 * consistent layout across the four cards.
 */

import { Box, Card, CardContent, Typography } from "@mui/material";

/**
 * @param {object} props
 * @param {string} props.title - Heading rendered above the chart.
 * @param {number} props.minHeight - Minimum height in pixels (drives the chart sizing).
 * @param {React.ReactNode} props.children - Chart contents (typically a ResponsiveContainer).
 */
export default function ComparisonCard({ title, minHeight, children }) {
  return (
    <Card
      sx={{
        resize: "both",
        overflow: "auto",
        width: "100%",
        minHeight,
        padding: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width: "100%", flexGrow: 1, minHeight: 0 }}>{children}</Box>
      </CardContent>
    </Card>
  );
}
