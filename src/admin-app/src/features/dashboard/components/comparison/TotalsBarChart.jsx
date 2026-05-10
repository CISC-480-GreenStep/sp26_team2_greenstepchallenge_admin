/**
 * @file TotalsBarChart.jsx
 * @summary Side-by-side bars of total participation and total points per challenge.
 *
 * Two bars per challenge: blue = total actions completed, orange = total
 * points earned. Useful for spotting high-engagement-but-low-points
 * campaigns (e.g. lots of small actions) at a glance.
 */

import { Box } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import ComparisonCard from "./ComparisonCard";

function truncateTick(value) {
  return String(value).length > 20 ? String(value).substring(0, 20) + "..." : value;
}

export default function TotalsBarChart({ barData, selectedChallengeIds, height }) {
  return (
    <ComparisonCard title="Total Participation & Points Comparison" minHeight={height}>
      <Box sx={{ width: '100%', height: 500, minHeight: 500, display: 'block' }}>
        <ResponsiveContainer key={Math.random()} width="100%" height="100%" style={{ width: "100%", height: "100%" }}>
        <BarChart data={barData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" orientation="top" interval={0} tickFormatter={truncateTick} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="participation" name="Total Actions" fill="#2196F3" isAnimationActive={false} />
          <Bar dataKey="points" name="Total Points" fill="#FF9800" isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
      </Box>
    </ComparisonCard>
  );
}
