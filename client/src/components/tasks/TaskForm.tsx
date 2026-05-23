import { useState } from 'react';
import type { FormEvent } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import { FiCalendar, FiPlus, FiX } from 'react-icons/fi';
import { useAppDispatch } from '../../hooks/useAuth';
import { createTask } from '../../redux/thunks/taskThunk';
import ClipLoader from '../common/ClipLoader';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useAppDispatch();
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle || isAdding) return;
    setIsAdding(true);
    try {
      await dispatch(createTask({
        title: nextTitle,
        priority: 'medium',
        status: 'todo',
        progress: 0,
        deadline: deadline?.toISOString(),
      })).unwrap();
      setTitle('');
      setDeadline(null);
      setShowCalendar(false);
      toast.success('Task added');
    } catch {
      toast.error('Could not add task. Check backend session/API.');
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <form className="task-form" onSubmit={submit}>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add a smart task..." />
      <div className="calendar-picker">
        <button className={`icon-btn ${deadline ? 'active-deadline' : ''}`} type="button" aria-label="Choose deadline" onClick={() => setShowCalendar((value) => !value)}>
          <FiCalendar />
        </button>
        {deadline && (
          <button className="deadline-chip" type="button" onClick={() => setDeadline(null)}>
            {deadline.toLocaleDateString()} <FiX />
          </button>
        )}
        {showCalendar && (
          <div className="calendar-popover">
            <Calendar
              minDate={new Date()}
              value={deadline}
              onChange={(value) => {
                setDeadline(Array.isArray(value) ? value[0] : value);
                setShowCalendar(false);
              }}
            />
          </div>
        )}
      </div>
      <button className="icon-btn" type="submit" aria-label="Add task" disabled={isAdding || !title.trim()}>
        {isAdding ? <ClipLoader /> : <FiPlus />}
      </button>
    </form>
  );
}
