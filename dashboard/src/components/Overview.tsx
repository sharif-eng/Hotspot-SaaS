import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Ticket, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Overview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeVouchers: 0,
    totalRevenue: 0,
    activeSessions: 0,
    totalZones: 0,
    recentPayments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.dashboard.getStats(token);
          setStats(response);
        } else {
          setStats({
            totalUsers: 1,
            activeVouchers: 0,
            totalRevenue: 0,
            activeSessions: 0,
            totalZones: 1,
            recentPayments: [],
          });
        }
      } catch (error) {
        setStats({
          totalUsers: 1,
          activeVouchers: 0,
          totalRevenue: 0,
          activeSessions: 0,
          totalZones: 1,
          recentPayments: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const revenueChart = [
    { date: '01/01', revenue: 12000 },
    { date: '01/02', revenue: 19000 },
    { date: '01/03', revenue: 15000 },
    { date: '01/04', revenue: 25000 },
    { date: '01/05', revenue: 22000 },
    { date: '01/06', revenue: 30000 },
    { date: '01/07', revenue: 28000 }
  ];

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Revenue',
      value: `UGX ${stats.totalRevenue.toLocaleString()}`,
      change: '+8%',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Active Vouchers',
      value: stats.activeVouchers.toLocaleString(),
      change: '+23%',
      icon: Ticket,
      color: 'bg-purple-500',
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions.toLocaleString(),
      change: '+5%',
      icon: Activity,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Demo Mode
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              <span className="text-sm text-gray-600"> from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend (Last 7 Days)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`UGX ${Number(value).toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">• New user registered: john@example.com</div>
            <div className="text-sm text-gray-600">• Voucher purchased: VCH-ABC123</div>
            <div className="text-sm text-gray-600">• Payment completed: UGX 15,000</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">System Status</h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Database: Online</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Payment Gateway: Active</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span>MikroTik: Demo Mode</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
              + Generate Vouchers
            </button>
            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
              + Add New User
            </button>
            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
              + View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}