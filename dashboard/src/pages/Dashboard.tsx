import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Overview from '../components/Overview';
import Users from '../components/Users';
import Vouchers from '../components/Vouchers';
import Payments from '../components/Payments';
import ZonesPage from './Zones';
import Settings from '../components/Settings';
import HotspotSettings from '../components/HotspotSettings';
import PendingPayments from '../components/PendingPayments';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="" element={<Overview />} />
            <Route path="users" element={<Users />} />
            <Route path="vouchers" element={<Vouchers />} />
            <Route path="payments" element={<Payments />} />
            <Route path="zones" element={<ZonesPage />} />
            <Route path="pending-payments" element={<PendingPayments />} />
            <Route path="settings" element={<Settings />} />
            <Route path="hotspot-settings" element={<HotspotSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}