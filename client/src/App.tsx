import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/AppRoutes';
import Loader from './components/common/Loader';
import { useAppDispatch, useAppSelector } from './hooks/useAuth';
import { fetchMe } from './redux/thunks/authThunk';

export default function App() {
  const dispatch = useAppDispatch();
  const { hydrated, loading } = useAppSelector((state) => state.auth);
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    if (!hydrated) void dispatch(fetchMe());
  }, [dispatch, hydrated]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  if (!hydrated) {
    return <Loader label={loading ? 'Checking secure session' : 'Preparing NexFlow AI'} />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer position="top-right" theme={theme} closeButton={false} />
    </BrowserRouter>
  );
}
