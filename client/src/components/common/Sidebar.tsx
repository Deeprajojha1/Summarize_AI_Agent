import { NavLink, useNavigate } from 'react-router-dom';
import { FiActivity, FiCommand, FiCpu, FiGithub, FiLogOut, FiMoon, FiUser } from 'react-icons/fi';
import { useAppDispatch } from '../../hooks/useAuth';
import { logout } from '../../redux/thunks/authThunk';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="brand-mark"><FiCpu /> NexFlow AI</div>
      <div className="sidebar-section">
        <NavLink to="/dashboard"><FiCommand /> Command</NavLink>
        <NavLink to="/profile"><FiUser /> Profile</NavLink>
        <a href="https://github.com" target="_blank"><FiGithub /> GitHub</a>
        <button type="button"><FiActivity /> Analytics</button>
        <button type="button"><FiMoon /> Theme</button>
      </div>
      <button className="logout-btn" type="button" onClick={handleLogout}><FiLogOut /> Logout</button>
    </aside>
  );
}
