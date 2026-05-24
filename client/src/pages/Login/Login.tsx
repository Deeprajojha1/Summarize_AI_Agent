import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiLogIn, FiMail, FiShield } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { login } from '../../redux/thunks/authThunk';
import ClipLoader from '../../components/common/ClipLoader';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);
  const navigate = useNavigate();
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      toast.success('Welcome back to NexFlow AI');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid credentials or server unavailable');
    }
  };
  return (
    <form className="auth-card" onSubmit={submit}>
      <div className="auth-card-header">
        <span><FiShield /></span>
        <div>
          <h2>Welcome back</h2>
          <p>Sign in to continue your workspace.</p>
        </div>
      </div>
      <label className="auth-field">
        <FiMail />
        <input type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="auth-field">
        <FiLock />
        <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? <ClipLoader /> : <FiLogIn />} {loading ? 'Signing in...' : 'Continue'}
      </button>
      <p className="auth-switch">New here? <Link to="/signup">Create account</Link></p>
    </form>
  );
}
