import { NavLink, useNavigate } from 'react-router-dom';
import { FiActivity, FiCommand, FiCpu, FiGithub, FiLogOut, FiMoon, FiUser } from 'react-icons/fi';
import { useAppDispatch } from '../../hooks/useAuth';
import { logout } from '../../redux/thunks/authThunk';
import { toggleTheme } from '../../redux/slices/uiSlice';

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
        <NavLink to="/analytics"><FiActivity /> Analytics</NavLink>
        <button type="button" onClick={() => dispatch(toggleTheme())}><FiMoon /> Theme</button>
      </div>
      <button className="logout-btn" type="button" onClick={handleLogout}><FiLogOut /> Logout</button>
    </aside>
  );
}
