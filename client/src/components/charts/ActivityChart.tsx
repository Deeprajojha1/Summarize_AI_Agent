import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const data = [
  { day: 'M', commits: 8 }, { day: 'T', commits: 12 }, { day: 'W', commits: 6 },
  { day: 'T', commits: 17 }, { day: 'F', commits: 14 }, { day: 'S', commits: 4 },
];

export default function ActivityChart() {
  return (
    <section className="glass-card chart-card">
      <div className="card-title">Build Momentum</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data}>
          <XAxis dataKey="day" stroke="#8b9bb4" axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8 }} />
          <Bar dataKey="commits" fill="#a7f3d0" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
