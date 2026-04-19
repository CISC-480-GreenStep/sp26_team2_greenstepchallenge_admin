/**
 * @file CompletionRatesWidget.jsx
 * @summary Horizontal bar chart of per-challenge completion percentages.
 */

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

export default function CompletionRatesWidget({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.completionRatesData} layout="vertical" margin={{ left: 10, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
        <Tooltip formatter={(v) => `${v}%`} />
        <Bar dataKey="rate" name="Completion Rate" radius={[0, 4, 4, 0]}>
          {data.completionRatesData.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.rate >= 50 ? "#4CAF50" : entry.rate >= 25 ? "#FF9800" : "#F44336"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
