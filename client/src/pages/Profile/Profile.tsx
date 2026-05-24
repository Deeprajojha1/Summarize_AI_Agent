import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'react-toastify';
import { FiActivity, FiCheckCircle, FiGithub, FiMail, FiMapPin, FiSave, FiShield, FiStar, FiUser } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { syncProfileOverview } from '../../redux/slices/profileSlice';
import { updateProfile } from '../../redux/thunks/authThunk';
import ClipLoader from '../../components/common/ClipLoader';

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const tasks = useAppSelector((state) => state.tasks.items);
  const overview = useAppSelector((state) => state.profile.overview);
  const [name, setName] = useState(user?.name || '');
  const [githubUsername, setGithubUsername] = useState(user?.githubUsername || '');
  const [currentAddress, setCurrentAddress] = useState(user?.currentAddress || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(syncProfileOverview({ user, tasks }));
  }, [dispatch, tasks, user]);

  useEffect(() => {
    setName(user?.name || '');
    setGithubUsername(user?.githubUsername || '');
    setCurrentAddress(user?.currentAddress || '');
  }, [user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateProfile({ name, githubUsername, currentAddress })).unwrap();
      toast.success('Profile updated');
    } catch {
      toast.error('Could not update profile');
    } finally {
      setSaving(false);
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
          <span>{overview.secureSessionLabel}</span>
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
            Current address or city
            <input value={currentAddress} onChange={(event) => setCurrentAddress(event.target.value)} placeholder="Bengaluru, India" />
          </label>
          <label>
            Email
            <input value={user?.email || ''} disabled />
          </label>
          <button className="primary-btn" type="submit" disabled={saving || !name.trim()}>
            {saving ? <ClipLoader /> : <FiSave />} Save profile
          </button>
        </form>

        <div className="profile-side">
          <article className="glass-card profile-mini-card">
            <FiActivity />
            <div>
              <strong>{overview.productivityScore}%</strong>
              <span>Productivity score</span>
            </div>
          </article>
          <article className="glass-card profile-mini-card">
            <FiCheckCircle />
            <div>
              <strong>{overview.completedTasks}</strong>
              <span>Completed tasks</span>
            </div>
          </article>
          <article className="glass-card profile-mini-card">
            <FiGithub />
            <div>
              <strong>{overview.developerIdentity}</strong>
              <span>Developer identity</span>
            </div>
          </article>
          <article className="glass-card profile-mini-card">
            <FiMapPin />
            <div>
              <strong>{overview.locationContext}</strong>
              <span>Location context</span>
            </div>
          </article>
          <article className="glass-card profile-mini-card">
            <FiMail />
            <div>
              <strong>{overview.workspaceRole}</strong>
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
          <span>{overview.urgentTasks} urgent tasks</span>
          <span>AI reminders enabled</span>
          <span>Profile-aware tools</span>
          <span>Deadline alerts every 10 min</span>
        </div>
      </section>
    </div>
  );
}
