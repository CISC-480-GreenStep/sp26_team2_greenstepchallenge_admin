import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

export default function ParticipationBarWidget({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.participationByEvent} margin={{ bottom: 50, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} height={70} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="participants" name="Participants" fill="#4CAF50" radius={[4, 4, 0, 0]} />
        <Bar dataKey="actions" name="Action Completions" fill="#2196F3" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
