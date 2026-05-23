import { motion } from 'framer-motion';
import { FiCheckCircle, FiCpu, FiTrendingUp, FiZap } from 'react-icons/fi';
import ActivityChart from '../../components/charts/ActivityChart';
import ProductivityChart from '../../components/charts/ProductivityChart';
import GithubStats from '../../components/github/GithubStats';
import NewsList from '../../components/news/NewsList';
import TaskList from '../../components/tasks/TaskList';
import WeatherCard from '../../components/weather/WeatherCard';
import { useAppSelector } from '../../hooks/useAuth';

export default function Dashboard() {
  const tasks = useAppSelector((state) => state.tasks.items);
  const openTasks = tasks.filter((task) => task.status !== 'done').length;
  const cards = [
    { label: 'Productivity score', value: '91', icon: <FiTrendingUp /> },
    { label: 'Open tasks', value: openTasks.toString(), icon: <FiCheckCircle /> },
    { label: 'AI insights', value: '12', icon: <FiZap /> },
    { label: 'Agent tools', value: '4', icon: <FiCpu /> },
  ];

  return (
    <div className="dashboard-grid">
      <section className="insight-strip">
        {cards.map((card, index) => (
          <motion.article className="metric-card" key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
            <span>{card.icon}</span>
            <strong>{card.value}</strong>
            <small>{card.label}</small>
          </motion.article>
        ))}
      </section>
      <div className="main-column">
        <ProductivityChart />
        <NewsList />
      </div>
      <div className="side-column">
        <WeatherCard />
        <GithubStats />
        <ActivityChart />
      </div>
      <TaskList />
    </div>
  );
}
