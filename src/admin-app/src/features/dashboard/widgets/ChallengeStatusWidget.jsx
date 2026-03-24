import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const STATUS_COLORS = {
  Active: '#4CAF50',
  Upcoming: '#2196F3',
  Completed: '#9E9E9E',
  Archived: '#FF9800',
};

export default function ChallengeStatusWidget({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data.challengeStatusData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="70%"
        >
          {data.challengeStatusData.map((entry) => (
            <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#757575'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
