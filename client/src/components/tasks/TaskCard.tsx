import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiClock, FiEdit2, FiFlag, FiSave, FiTrash2, FiX } from 'react-icons/fi';
import { useAppDispatch } from '../../hooks/useAuth';
import { deleteTask, updateTask } from '../../redux/thunks/taskThunk';
import type { Task } from '../../types/task.types';
import ClipLoader from '../common/ClipLoader';

const toDateTimeLocal = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export default function TaskCard({ task }: { task: Task }) {
  const dispatch = useAppDispatch();
  const [action, setAction] = useState<'complete' | 'delete' | 'save' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [deadline, setDeadline] = useState(toDateTimeLocal(task.deadline));

  const completeTask = async () => {
    setAction('complete');
    try {
      await dispatch(updateTask({ id: task._id, payload: { status: 'done', progress: 100 } })).unwrap();
      toast.success('Task completed');
    } catch {
      toast.error('Could not update task');
    } finally {
      setAction(null);
    }
  };

  const removeTask = async () => {
    setAction('delete');
    try {
      await dispatch(deleteTask(task._id)).unwrap();
      toast.success('Task deleted');
    } catch {
      toast.error('Could not delete task');
    } finally {
      setAction(null);
    }
  };

  const saveTask = async () => {
    const nextTitle = title.trim();
    if (!nextTitle) {
      toast.error('Task title cannot be empty');
      return;
    }

    setAction('save');
    try {
      await dispatch(updateTask({
        id: task._id,
        payload: {
          title: nextTitle,
          priority,
          deadline: deadline ? new Date(deadline).toISOString() : undefined,
        },
      })).unwrap();
      toast.success('Task updated');
      setIsEditing(false);
    } catch {
      toast.error('Could not edit task');
    } finally {
      setAction(null);
    }
  };

  const cancelEdit = () => {
    setTitle(task.title);
    setPriority(task.priority);
    setDeadline(toDateTimeLocal(task.deadline));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <article className="task-card edit-task-card">
        <div className="edit-task-fields">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" />
          <select value={priority} onChange={(event) => setPriority(event.target.value as Task['priority'])}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <input type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
        </div>
        <div className="edit-task-actions">
          <button className="icon-btn" type="button" onClick={() => void saveTask()} aria-label="Save task" disabled={Boolean(action)}>
            {action === 'save' ? <ClipLoader /> : <FiSave />}
          </button>
          <button className="icon-btn danger" type="button" onClick={cancelEdit} aria-label="Cancel edit" disabled={Boolean(action)}>
            <FiX />
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="task-card">
      <button className="icon-btn" onClick={() => void completeTask()} aria-label="Complete" disabled={Boolean(action) || task.status === 'done'}>
        {action === 'complete' ? <ClipLoader /> : <FiCheckCircle />}
      </button>
      <div>
        <h4>{task.title}</h4>
        <span><FiFlag /> {task.priority} - <FiClock /> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
        <div className="progress"><i style={{ width: `${task.progress}%` }} /></div>
      </div>
      <div className="task-actions">
        <button className="icon-btn" onClick={() => setIsEditing(true)} aria-label="Edit task" disabled={Boolean(action)}>
          <FiEdit2 />
        </button>
        <button className="icon-btn danger" onClick={() => void removeTask()} aria-label="Delete" disabled={Boolean(action)}>
          {action === 'delete' ? <ClipLoader /> : <FiTrash2 />}
        </button>
      </div>
    </article>
  );
}
