import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from './Loader';
import { fetchMe } from '../../redux/thunks/authThunk';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';

export default function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const { user, loading, hydrated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!hydrated) void dispatch(fetchMe());
  }, [dispatch, hydrated]);

  if (loading || !hydrated) return <Loader label="Restoring secure session" />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
