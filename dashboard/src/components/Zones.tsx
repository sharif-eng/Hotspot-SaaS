import { useState } from 'react';
import { MapPin, Plus, Wifi, Users, Activity, Settings, AlertCircle } from 'lucide-react';

export default function Zones() {
  const [zones] = useState([
    { 
      id: 1, 
      name: 'Main Campus', 
      location: 'Central Building', 
      mikrotikIp: '192.168.1.1', 
      status: 'Online', 
      activeUsers: 45, 
      maxUsers: 100, 
      totalSessions: 1250,
      revenue: 850000,
      lastSeen: '2024-01-15 18:30'
    },
    { 
      id: 2, 
      name: 'Library Zone', 
      location: 'University Library', 
      mikrotikIp: '192.168.2.1', 
      status: 'Online', 
      activeUsers: 23, 
      maxUsers: 50, 
      totalSessions: 680,
      revenue: 420000,
      lastSeen: '2024-01-15 18:29'
    },
    { 
      id: 3, 
      name: 'Cafeteria', 
      location: 'Student Cafeteria', 
      mikrotikIp: '192.168.3.1', 
      status: 'Offline', 
      activeUsers: 0, 
      maxUsers: 75, 
      totalSessions: 890,
      revenue: 560000,
      lastSeen: '2024-01-15 16:45'
    },
    { 
      id: 4, 
      name: 'Dormitory A', 
      location: 'Student Housing Block A', 
      mikrotikIp: '192.168.4.1', 
      status: 'Online', 
      activeUsers: 67, 
      maxUsers: 150, 
      totalSessions: 2100,
      revenue: 1200000,
      lastSeen: '2024-01-15 18:31'
    },
  ]);

  const getStatusColor = (status: string) => {
    return status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'Online' ? 
      <div className="w-2 h-2 bg-green-500 rounded-full"></div> : 
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const totalActiveUsers = zones.reduce((sum, zone) => sum + zone.activeUsers, 0);
  const totalRevenue = zones.reduce((sum, zone) => sum + zone.revenue, 0);
  const onlineZones = zones.filter(zone => zone.status === 'Online').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Zone Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Add Zone</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Zones</p>
              <p className="text-2xl font-bold text-gray-900">{zones.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Wifi className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Online Zones</p>
              <p className="text-2xl font-bold text-gray-900">{onlineZones}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalActiveUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">UGX {totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone) => {
          const utilization = (zone.activeUsers / zone.maxUsers) * 100;
          return (
            <div key={zone.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
                    <p className="text-sm text-gray-500">{zone.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(zone.status)}
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(zone.status)}`}>
                    {zone.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-xl font-bold text-gray-900">{zone.activeUsers}/{zone.maxUsers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-xl font-bold text-green-600">UGX {zone.revenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Utilization Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Utilization</span>
                  <span className="text-sm font-medium text-gray-900">{utilization.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUtilizationColor(utilization)}`}
                    style={{ width: `${utilization}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>IP: {zone.mikrotikIp}</span>
                <span>Last seen: {zone.lastSeen}</span>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 flex items-center justify-center space-x-1">
                  <Activity className="h-4 w-4" />
                  <span>Monitor</span>
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded hover:bg-gray-700 flex items-center justify-center space-x-1">
                  <Settings className="h-4 w-4" />
                  <span>Configure</span>
                </button>
              </div>

              {zone.status === 'Offline' && (
                <div className="mt-3 flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Zone is offline - Check MikroTik connection</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Zone Details Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Zone Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MikroTik IP</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                    <div className="text-sm text-gray-500">{zone.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(zone.status)}`}>
                      {getStatusIcon(zone.status)}
                      <span className="ml-1">{zone.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {zone.activeUsers}/{zone.maxUsers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {zone.totalSessions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    UGX {zone.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {zone.mikrotikIp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}