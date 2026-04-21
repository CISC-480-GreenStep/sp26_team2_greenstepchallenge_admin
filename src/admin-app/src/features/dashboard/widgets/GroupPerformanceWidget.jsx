/**
 * @file GroupPerformanceWidget.jsx
 * @summary Bar chart comparing average points per user across groups.
 */

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

import { Typography } from "@mui/material";

export default function GroupPerformanceWidget({ data }) {
  if (!data.groupPerformanceData?.length) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
        No group data available
      </Typography>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.groupPerformanceData} margin={{ bottom: 30, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="participants" name="Participants" fill="#4CAF50" radius={[4, 4, 0, 0]} />
        <Bar dataKey="points" name="Points" fill="#FF9800" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
