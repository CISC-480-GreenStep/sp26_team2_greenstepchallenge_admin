/**
 * @file CategoryBreakdownChart.jsx
 * @summary Stacked bar chart of action-category counts per challenge.
 *
 * Each bar is one challenge; each stack segment is one action category.
 * Lets admins quickly see which campaigns leaned heavily on, e.g.,
 * Transportation vs. Energy actions.
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
import { COMPARISON_COLORS } from "../../../../lib/constants";

function truncateTick(value) {
  return String(value).length > 20 ? String(value).substring(0, 20) + "..." : value;
}

export default function CategoryBreakdownChart({
  stackedCategoryData,
  categoryKeys,
  selectedChallengeIds,
  height,
}) {
  return (
    <ComparisonCard title="Action Category Breakdown" minHeight={height}>
      <Box sx={{ width: '100%', height: 500, minHeight: 500, display: 'block' }}>
        <ResponsiveContainer key={Math.random()} width="100%" height="100%" style={{ width: "100%", height: "100%" }}>
        <BarChart data={stackedCategoryData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="challengeName"
            orientation="top"
            interval={0}
            tickFormatter={truncateTick}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {categoryKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={COMPARISON_COLORS[index % COMPARISON_COLORS.length]}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      </Box>
    </ComparisonCard>
  );
}
