import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import Loader from './components/common/Loader';
import { useAppDispatch, useAppSelector } from './hooks/useAuth';
import { fetchMe } from './redux/thunks/authThunk';

export default function App() {
  const dispatch = useAppDispatch();
  const { hydrated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!hydrated) void dispatch(fetchMe());
  }, [dispatch, hydrated]);

  if (!hydrated) {
    return <Loader label={loading ? 'Checking secure session' : 'Preparing NexFlow AI'} />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
