import { FiMail, FiUser } from 'react-icons/fi';
import { useAppSelector } from '../../hooks/useAuth';

export default function Profile() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <section className="glass-card profile-card">
      <div className="avatar">{user?.name?.slice(0, 1) || 'N'}</div>
      <h2>{user?.name}</h2>
      <p><FiMail /> {user?.email}</p>
      <p><FiUser /> {user?.role}</p>
    </section>
  );
}
