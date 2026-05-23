import { useMemo, useState } from 'react';
import { FiActivity, FiCheckCircle, FiClock, FiFlag, FiTrendingUp } from 'react-icons/fi';
import ActivityChart from '../../components/charts/ActivityChart';
import ProductivityChart from '../../components/charts/ProductivityChart';
import { useAppSelector } from '../../hooks/useAuth';

export default function Analytics() {
  const tasks = useAppSelector((state) => state.tasks.items);
  const github = useAppSelector((state) => state.github.profile);
  const [now] = useState(() => Date.now());

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'done').length;
    const urgent = tasks.filter((task) => task.priority === 'urgent').length;
    const overdue = tasks.filter((task) => task.deadline && task.status !== 'done' && new Date(task.deadline).getTime() < now).length;
    const focusScore = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, urgent, overdue, focusScore };
  }, [now, tasks]);

  const cards = [
    { label: 'Focus score', value: `${stats.focusScore}%`, icon: <FiTrendingUp /> },
    { label: 'Completed tasks', value: stats.completed.toString(), icon: <FiCheckCircle /> },
    { label: 'Urgent tasks', value: stats.urgent.toString(), icon: <FiFlag /> },
    { label: 'Overdue deadlines', value: stats.overdue.toString(), icon: <FiClock /> },
  ];

  return (
    <div className="analytics-page">
      <section className="analytics-hero glass-card">
        <div>
          <span className="eyebrow"><FiActivity /> Workspace Analytics</span>
          <h1>Signal dashboard</h1>
          <p>Track productivity momentum, task health, deadline risk, and developer activity in one focused view.</p>
        </div>
        <strong>{github?.totalStars || 0} GitHub stars tracked</strong>
      </section>

      <section className="analytics-cards">
        {cards.map((card) => (
          <article className="metric-card" key={card.label}>
            <span>{card.icon}</span>
            <strong>{card.value}</strong>
            <small>{card.label}</small>
          </article>
        ))}
      </section>

      <section className="analytics-grid">
        <ProductivityChart />
        <ActivityChart />
      </section>

      <section className="glass-card analytics-insights">
        <div className="card-title">AI Analytics Summary</div>
        <p>
          {stats.total
            ? `You have ${stats.total} tracked tasks, ${stats.completed} completed tasks, and ${stats.overdue} overdue deadlines. Keep urgent items visible and protect one deep-work block today.`
            : 'No task data yet. Add tasks with deadlines to unlock richer productivity analytics.'}
        </p>
      </section>
    </div>
  );
}
