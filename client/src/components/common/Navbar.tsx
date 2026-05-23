import { Link } from 'react-router-dom';
import { FiArrowRight, FiCpu, FiLogIn } from 'react-icons/fi';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand-mark"><FiCpu /> NexFlow AI</Link>
      <div className="nav-actions">
        <Link to="/login" className="ghost-btn"><FiLogIn /> Login</Link>
        <Link to="/signup" className="primary-btn">Start free <FiArrowRight /></Link>
      </div>
    </nav>
  );
}
