import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import PageHeader from '../components/common/PageHeader';
import AIChatPanel from '../components/ai/AIChatPanel';

export default function DashboardLayout() {
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
