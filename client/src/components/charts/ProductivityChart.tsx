import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const data = [
  { day: 'Mon', score: 62 }, { day: 'Tue', score: 74 }, { day: 'Wed', score: 68 },
  { day: 'Thu', score: 86 }, { day: 'Fri', score: 91 }, { day: 'Sat', score: 78 },
];

export default function ProductivityChart() {
  return (
    <section className="glass-card chart-card">
      <div className="card-title">Productivity Score</div>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data}>
          <defs><linearGradient id="score" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.7} /><stop offset="95%" stopColor="#7dd3fc" stopOpacity={0} /></linearGradient></defs>
          <XAxis dataKey="day" stroke="#8b9bb4" axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8 }} />
          <Area dataKey="score" stroke="#7dd3fc" fill="url(#score)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
}
