import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import PageHeader from '../components/common/PageHeader';
import AIChatPanel from '../components/ai/AIChatPanel';
import { useAppDispatch, useAppSelector } from '../hooks/useAuth';
import { syncProfileOverview } from '../redux/slices/profileSlice';
import { fetchGithub } from '../redux/thunks/githubThunk';
import { fetchTasks } from '../redux/thunks/taskThunk';
import { fetchWeather } from '../redux/thunks/weatherThunk';

export default function DashboardLayout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const tasks = useAppSelector((state) => state.tasks.items);

  useEffect(() => {
    if (!user?.id) return;
    void dispatch(fetchTasks());
  }, [dispatch, user?.id]);

  useEffect(() => {
    dispatch(syncProfileOverview({ user, tasks }));
  }, [dispatch, tasks, user]);

  useEffect(() => {
    if (user?.githubUsername) {
      void dispatch(fetchGithub(user.githubUsername));
    }
  }, [dispatch, user?.githubUsername]);

  useEffect(() => {
    if (user?.currentAddress) {
      void dispatch(fetchWeather(user.currentAddress));
    }
  }, [dispatch, user?.currentAddress]);

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-main">
        <PageHeader />
        <Outlet />
      </main>
      <AIChatPanel />
    </div>
  );
}
