import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'react-toastify';
import { FiActivity, FiCheckCircle, FiGithub, FiMail, FiSave, FiShield, FiStar, FiUser } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { updateProfile } from '../../redux/thunks/authThunk';
import ClipLoader from '../../components/common/ClipLoader';

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const tasks = useAppSelector((state) => state.tasks.items);
  const [name, setName] = useState(user?.name || '');
  const [githubUsername, setGithubUsername] = useState(user?.githubUsername || '');

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'done').length;
    const urgent = tasks.filter((task) => task.priority === 'urgent').length;
    const score = tasks.length ? Math.round((completed / tasks.length) * 100) : 92;
    return { completed, urgent, score };
  }, [tasks]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(updateProfile({ name, githubUsername })).unwrap();
      toast.success('Profile updated');
    } catch {
      toast.error('Could not update profile');
    }
  };

  return (
    <div className="profile-page">
      <section className="profile-hero glass-card">
        <div className="profile-avatar">{user?.name?.slice(0, 1) || 'N'}</div>
        <div>
          <span className="eyebrow"><FiStar /> Smart Workspace Profile</span>
          <h1>{user?.name || 'NexFlow User'}</h1>
          <p>{user?.email}</p>
        </div>
        <div className="profile-status">
          <FiShield />
          <span>HTTP-only cookie session</span>
        </div>
      </section>

      <section className="profile-grid">
        <form className="glass-card profile-editor" onSubmit={submit}>
          <div className="card-title"><FiUser /> Account Identity</div>
          <label>
            Full name
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
          </label>
          <label>
            GitHub username
            <input value={githubUsername} onChange={(event) => setGithubUsername(event.target.value)} placeholder="octocat" />
          </label>
          <label>
            Email
            <input value={user?.email || ''} disabled />
          </label>
          <button className="primary-btn" type="submit" disabled={loading || !name.trim()}>
            {loading ? <ClipLoader /> : <FiSave />} Save profile
          </button>
        </form>

        <div className="profile-side">
          <article className="glass-card profile-mini-card">
            <FiActivity />
            <div>
              <strong>{stats.score}%</strong>
              <span>Productivity score</span>
            </div>
          </article>
          <article className="glass-card profile-mini-card">
            <FiCheckCircle />
            <div>
              <strong>{stats.completed}</strong>
              <span>Completed tasks</span>
            </div>
          </article>
          <article className="glass-card profile-mini-card">
            <FiGithub />
            <div>
              <strong>{user?.githubUsername || 'Not linked'}</strong>
              <span>Developer identity</span>
            </div>
          </article>
          <article className="glass-card profile-mini-card">
            <FiMail />
            <div>
              <strong>{user?.role || 'user'}</strong>
              <span>Workspace role</span>
            </div>
          </article>
        </div>
      </section>

      <section className="glass-card profile-insights">
        <div className="card-title"><FiStar /> AI Profile Insights</div>
        <p>Your profile powers smarter recommendations across tasks, GitHub activity, and AI productivity planning.</p>
        <div className="insight-pills">
          <span>Secure auth active</span>
          <span>{stats.urgent} urgent tasks</span>
          <span>AI reminders enabled</span>
          <span>Deadline alerts every 10 min</span>
        </div>
      </section>
    </div>
  );
}
