import { useState } from 'react';
import type { FormEvent } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useAppDispatch } from '../../hooks/useAuth';
import { createTask } from '../../redux/thunks/taskThunk';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const dispatch = useAppDispatch();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    void dispatch(createTask({ title, priority: 'medium', status: 'todo', progress: 0 }));
    setTitle('');
  };
  return (
    <form className="task-form" onSubmit={submit}>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add a smart task..." />
      <button className="icon-btn" type="submit" aria-label="Add task"><FiPlus /></button>
    </form>
  );
}
