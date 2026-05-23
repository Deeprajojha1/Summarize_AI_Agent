import { FiCheckCircle, FiClock, FiFlag, FiTrash2 } from 'react-icons/fi';
import { useAppDispatch } from '../../hooks/useAuth';
import { deleteTask, updateTask } from '../../redux/thunks/taskThunk';
import type { Task } from '../../types/task.types';

export default function TaskCard({ task }: { task: Task }) {
  const dispatch = useAppDispatch();
  return (
    <article className="task-card">
      <button className="icon-btn" onClick={() => void dispatch(updateTask({ id: task._id, payload: { status: 'done', progress: 100 } }))} aria-label="Complete"><FiCheckCircle /></button>
      <div>
        <h4>{task.title}</h4>
        <span><FiFlag /> {task.priority} · <FiClock /> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
        <div className="progress"><i style={{ width: `${task.progress}%` }} /></div>
      </div>
      <button className="icon-btn danger" onClick={() => void dispatch(deleteTask(task._id))} aria-label="Delete"><FiTrash2 /></button>
    </article>
  );
}
