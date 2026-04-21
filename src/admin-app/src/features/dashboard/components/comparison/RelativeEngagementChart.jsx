/**
 * @file RelativeEngagementChart.jsx
 * @summary Multi-line chart of cumulative actions vs. days-since-launch.
 *
 * Lets admins overlay several challenges' engagement curves on a shared
 * "Days Since Launch" x-axis to see which campaigns ramped fastest.
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { useTheme } from "@mui/material";

import ComparisonCard from "./ComparisonCard";
import { COMPARISON_COLORS } from "../../../../lib/constants";

/** Truncate long tick labels so axis ticks don't overlap on small screens. */
function truncateTick(value) {
  return String(value).length > 25 ? String(value).substring(0, 25) + "..." : value;
}

export default function RelativeEngagementChart({
  comparisonData,
  selectedChallenges,
  selectedChallengeIds,
  height,
}) {
  const theme = useTheme();

  return (
    <ComparisonCard title="Relative Engagement Trend" minHeight={height}>
      <ResponsiveContainer key={selectedChallengeIds.join("-")} width="100%" height={height}>
        <LineChart data={comparisonData} margin={{ top: 20, right: 30, left: 30, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="relativeDay"
            label={{
              value: "Days Since Launch",
              position: "insideBottom",
              offset: -10,
              style: { fill: theme.palette.text.primary },
            }}
            interval={0}
            angle={-35}
            textAnchor="end"
            tickFormatter={truncateTick}
          />
          <YAxis
            label={{
              value: "Actions Completed",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { textAnchor: "middle", fill: theme.palette.text.primary },
            }}
          />
          <Tooltip shared />
          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "20px" }} />
          {selectedChallenges.map((c, index) => (
            <Line
              key={c.name}
              type="monotone"
              dataKey={c.name}
              name={c.status === "Upcoming" ? `${c.name} (Upcoming)` : c.name}
              stroke={COMPARISON_COLORS[index % COMPARISON_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ComparisonCard>
  );
}
