import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'react-toastify';
import { FiBell, FiClock, FiCommand, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { fetchTasks } from '../../redux/thunks/taskThunk';
import type { Task } from '../../types/task.types';
import ClipLoader from './ClipLoader';

const TEN_MINUTES = 10 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

export default function PageHeader() {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchResults, setSearchResults] = useState<Task[] | null>(null);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);
  const alertedRef = useRef<string>('');

  const alerts = useMemo(() => {
    return tasks
      .filter((task) => task.status !== 'done' && task.deadline)
      .map((task) => {
        const dueAt = new Date(task.deadline as string).getTime();
        const diff = dueAt - now;
        if (diff < 0) return { id: task._id, title: task.title, message: 'AI alert: deadline is overdue', tone: 'danger' };
        if (diff <= ONE_DAY) return { id: task._id, title: task.title, message: 'AI alert: deadline is within 24 hours', tone: 'warning' };
        return null;
      })
      .filter(Boolean) as Array<{ id: string; title: string; message: string; tone: string }>;
  }, [now, tasks]);

  useEffect(() => {
    const runAlertScan = () => {
      setNow(Date.now());
      if (!alerts.length) return;
      const signature = alerts.map((alert) => `${alert.id}:${alert.message}`).join('|');
      if (alertedRef.current === signature) return;
      alertedRef.current = signature;
      toast.info(`AI deadline alert: ${alerts.length} task${alerts.length > 1 ? 's need' : ' needs'} attention`);
    };

    runAlertScan();
    const interval = window.setInterval(runAlertScan, TEN_MINUTES);
    return () => window.clearInterval(interval);
  }, [alerts]);

  const submitSearch = async (event: FormEvent) => {
    event.preventDefault();
    const term = query.trim().toLowerCase();
    setSearchError('');
    setSearchResults(null);

    if (!term) {
      setSearchError('Type a task name, status, priority, or category to search.');
      return;
    }

    setSearching(true);
    try {
      const availableTasks = tasks.length ? tasks : await dispatch(fetchTasks()).unwrap();
      const results = availableTasks.filter((task) => {
        const searchable = [
          task.title,
          task.description,
          task.priority,
          task.status,
          task.category,
          task.deadline ? new Date(task.deadline).toLocaleDateString() : '',
        ].filter(Boolean).join(' ').toLowerCase();
        return searchable.includes(term);
      });

      setSearchResults(results);
    } catch {
      setSearchError('Could not search tasks. Please check backend connection and try again.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <motion.header className="page-header" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <div>
        <span className="eyebrow">AI Operating System</span>
        <h2>Good evening, operator.</h2>
      </div>
      <form className="command-bar search-command" onSubmit={submitSearch}>
        <FiSearch />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSearchError('');
            setSearchResults(null);
          }}
          placeholder="Search your tasks..."
        />
        <button type="submit" aria-label="Search tasks" disabled={searching}>
          {searching ? <ClipLoader /> : <kbd><FiCommand /> K</kbd>}
        </button>
        {(searching || searchError || searchResults) && (
          <div className="search-results-panel">
            {searching && <p className="search-state"><ClipLoader /> Searching tasks...</p>}
            {!searching && searchError && <p className="search-state error">{searchError}</p>}
            {!searching && searchResults && !searchResults.length && <p className="search-state">No tasks found for "{query.trim()}".</p>}
            {!searching && searchResults && searchResults.length > 0 && searchResults.slice(0, 5).map((task) => (
              <article className="search-result-item" key={task._id}>
                <strong>{task.title}</strong>
                <span>{task.priority} - {task.status}{task.deadline ? ` - ${new Date(task.deadline).toLocaleDateString()}` : ''}</span>
              </article>
            ))}
          </div>
        )}
      </form>
      <div className="notification-center">
        <button className="icon-btn notification-btn" aria-label="Notifications" onClick={() => setOpen((value) => !value)}>
          <FiBell />
          {alerts.length ? <span>{alerts.length}</span> : null}
        </button>
        {open && (
          <div className="notification-menu">
            <strong>AI deadline alerts</strong>
            {alerts.length ? alerts.map((alert) => (
              <article className={`notification-item ${alert.tone}`} key={`${alert.id}-${alert.message}`}>
                <FiClock />
                <div>
                  <h4>{alert.title}</h4>
                  <p>{alert.message}</p>
                </div>
              </article>
            )) : <p className="empty-alert">No deadline alerts right now.</p>}
          </div>
        )}
      </div>
    </motion.header>
  );
}
