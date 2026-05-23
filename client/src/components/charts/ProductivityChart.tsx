import { useMemo, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppSelector } from '../../hooks/useAuth';

export default function ProductivityChart() {
  const tasks = useAppSelector((state) => state.tasks.items);
  const [now] = useState(() => Date.now());

  const data = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === 'done').length;
    const progress = tasks.filter((task) => task.status === 'progress').length;
    const todo = tasks.filter((task) => task.status === 'todo').length;
    const urgent = tasks.filter((task) => task.priority === 'urgent').length;
    const overdue = tasks.filter((task) => task.deadline && task.status !== 'done' && new Date(task.deadline).getTime() < now).length;
    const averageProgress = total ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / total) : 0;

    if (!total) {
      return [
        { label: 'Tasks', score: 0 },
        { label: 'Progress', score: 0 },
        { label: 'Done', score: 0 },
        { label: 'Urgent', score: 0 },
        { label: 'Health', score: 0 },
      ];
    }

    return [
      { label: 'Tasks', score: Math.min(total * 12, 100) },
      { label: 'Progress', score: averageProgress },
      { label: 'Done', score: Math.round((done / total) * 100) },
      { label: 'Active', score: Math.round(((progress + todo) / total) * 100) },
      { label: 'Health', score: Math.max(0, 100 - urgent * 15 - overdue * 25) },
    ];
  }, [now, tasks]);

  return (
    <section className="glass-card chart-card">
      <div className="card-title">Productivity Score</div>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data}>
          <defs><linearGradient id="score" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.7} /><stop offset="95%" stopColor="#7dd3fc" stopOpacity={0} /></linearGradient></defs>
          <XAxis dataKey="label" stroke="#8b9bb4" axisLine={false} tickLine={false} />
          <YAxis stroke="#8b9bb4" axisLine={false} tickLine={false} width={32} domain={[0, 100]} />
          <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8 }} />
          <Area dataKey="score" stroke="#7dd3fc" fill="url(#score)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
}
