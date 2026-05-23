import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUserPlus } from 'react-icons/fi';
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
      <h2>Create account</h2>
      <input placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? <ClipLoader /> : <FiUserPlus />} {loading ? 'Creating...' : 'Create workspace'}
      </button>
      <p>Already have access? <Link to="/login">Login</Link></p>
    </form>
  );
}
