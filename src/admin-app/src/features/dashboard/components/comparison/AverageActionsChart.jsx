/**
 * @file AverageActionsChart.jsx
 * @summary Per-challenge average number of actions completed per unique user.
 *
 * Normalizes engagement against participant count so a small but
 * highly-engaged challenge isn't visually buried under a larger one with
 * lower per-user activity.
 */

import { Box } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import ComparisonCard from "./ComparisonCard";
import { COMPARISON_AVG_COLORS } from "../../../../lib/constants";

function truncateTick(value) {
  return String(value).length > 20 ? String(value).substring(0, 20) + "..." : value;
}

export default function AverageActionsChart({ avgActionsData, selectedChallengeIds, height }) {
  return (
    <ComparisonCard title="Average Actions Per User" minHeight={height}>
      <Box sx={{ width: '100%', height: 500, minHeight: 500, display: 'block' }}>
        <ResponsiveContainer key={Math.random()} width="100%" height="100%" style={{ width: "100%", height: "100%" }}>
        <BarChart data={avgActionsData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" orientation="top" interval={0} tickFormatter={truncateTick} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="averageActions" name="Avg Actions" isAnimationActive={false}>
            {avgActionsData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COMPARISON_AVG_COLORS[index % COMPARISON_AVG_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </Box>
    </ComparisonCard>
  );
}
