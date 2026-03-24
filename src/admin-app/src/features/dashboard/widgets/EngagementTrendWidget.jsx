import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

export default function EngagementTrendWidget({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data.trendData} margin={{ bottom: 30, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} height={50} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="actions" name="Actions Completed" stroke="#2196F3" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
