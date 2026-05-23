import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppSelector } from '../../hooks/useAuth';

export default function ActivityChart() {
  const github = useAppSelector((state) => state.github.profile);
  const tasks = useAppSelector((state) => state.tasks.items);

  const data = useMemo(() => {
    if (github?.activity?.length) return github.activity;

    const grouped = [
      { day: 'Todo', commits: tasks.filter((task) => task.status === 'todo').length },
      { day: 'Doing', commits: tasks.filter((task) => task.status === 'progress').length },
      { day: 'Done', commits: tasks.filter((task) => task.status === 'done').length },
      { day: 'Urgent', commits: tasks.filter((task) => task.priority === 'urgent').length },
    ];

    return grouped;
  }, [github?.activity, tasks]);

  return (
    <section className="glass-card chart-card">
      <div className="card-title">{github?.activity?.length ? 'GitHub Momentum' : 'Task Momentum'}</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data}>
          <XAxis dataKey="day" stroke="#8b9bb4" axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} stroke="#8b9bb4" axisLine={false} tickLine={false} width={32} />
          <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8 }} />
          <Bar dataKey="commits" fill="#a7f3d0" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
