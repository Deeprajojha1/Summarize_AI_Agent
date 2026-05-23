import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLogIn } from 'react-icons/fi';
import { useAppDispatch } from '../../hooks/useAuth';
import { login } from '../../redux/thunks/authThunk';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await dispatch(login({ email, password })).unwrap();
    toast.success('Welcome back to NexFlow AI');
    navigate('/dashboard');
  };
  return (
    <form className="auth-card" onSubmit={submit}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <button className="primary-btn" type="submit"><FiLogIn /> Continue</button>
      <p>New here? <Link to="/signup">Create account</Link></p>
    </form>
  );
}
