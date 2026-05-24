import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiMail, FiShield, FiUser, FiUserPlus } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { signup } from '../../redux/thunks/authThunk';
import ClipLoader from '../../components/common/ClipLoader';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);
  const navigate = useNavigate();
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(signup({ name, email, password })).unwrap();
      toast.success('Workspace created');
      navigate('/dashboard');
    } catch {
      toast.error('Could not create workspace');
    }
  };
  return (
    <form className="auth-card" onSubmit={submit}>
      <div className="auth-card-header">
        <span><FiShield /></span>
        <div>
          <h2>Create account</h2>
          <p>Set up your NexFlow workspace.</p>
        </div>
      </div>
      <label className="auth-field">
        <FiUser />
        <input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="auth-field">
        <FiMail />
        <input type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="auth-field">
        <FiLock />
        <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? <ClipLoader /> : <FiUserPlus />} {loading ? 'Creating...' : 'Create workspace'}
      </button>
      <p className="auth-switch">Already have access? <Link to="/login">Login</Link></p>
    </form>
  );
}
