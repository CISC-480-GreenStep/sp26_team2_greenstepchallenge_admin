import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function UserGrowthWidget({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data.userGrowthData} margin={{ bottom: 30, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10 }}
          angle={-35}
          textAnchor="end"
          interval={0}
          height={50}
        />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="cumulative"
          name="Total Users"
          stroke="#3F51B5"
          fill="#3F51B5"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
