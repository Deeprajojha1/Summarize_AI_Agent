import { useEffect } from 'react';
import { FiList } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { fetchTasks } from '../../redux/thunks/taskThunk';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

export default function TaskList() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);
  useEffect(() => { void dispatch(fetchTasks()); }, [dispatch]);

  return (
    <section className="glass-card tall-card">
      <div className="task-header">
        <div className="card-title"><FiList /> Smart Tasks</div>
        <TaskForm />
      </div>
      <div className="task-list">
        {tasks.length ? tasks.map((task) => <TaskCard key={task._id} task={task} />) : <p className="empty-state">Your command queue is clean. Add tasks or ask AI to plan your day.</p>}
      </div>
    </section>
  );
}
