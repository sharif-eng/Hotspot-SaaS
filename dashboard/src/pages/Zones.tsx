import { useState, useEffect } from 'react';
import { Router, Users, Activity, Settings, Plus, TestTube } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  location: string;
  mikrotikIp: string;
  isActive: boolean;
  maxUsers: number;
  activeUsers?: number;
}

interface ActiveUser {
  user: string;
  address: string;
  macAddress: string;
  uptime: string;
  bytesIn: number;
  bytesOut: number;
}

export default function Zones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newZone, setNewZone] = useState({ name: '', location: '', mikrotikIp: '', apiUser: 'admin', apiPassword: '', maxUsers: 100 });

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('http://localhost:3000/api/zones', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setZones(data);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to fetch zones:', error);
      }
      
      // Fallback to database data
      setZones([
        {
          id: 'zone001',
          name: 'Main Campus',
          location: 'Kampala, Uganda',
          mikrotikIp: '192.168.1.1',
          isActive: true,
          maxUsers: 100,
          activeUsers: 2
        }
      ]);
    };

    fetchZones();
  }, []);

  const testConnection = async (zoneId: string) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Connection test successful! RouterOS 7.11.2 (simulated)');
    } catch (error) {
      alert('Connection test failed');
    } finally {
      setLoading(false);
    }
  };

  const loadActiveUsers = async (zone: Zone) => {
    setSelectedZone(zone);
    setLoading(true);
    try {
      // Mock active users - replace with API call
      const mockUsers: ActiveUser[] = [
        {
          user: 'demo_user_001',
          address: '192.168.1.100',
          macAddress: '00:11:22:33:44:55',
          uptime: '00:15:30',
          bytesIn: 1024000,
          bytesOut: 512000
        },
        {
          user: 'demo_user_002',
          address: '192.168.1.101',
          macAddress: '00:11:22:33:44:56',
          uptime: '01:22:15',
          bytesIn: 5120000,
          bytesOut: 2048000
        }
      ];
      setActiveUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load active users');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MikroTik Zones</h1>
          <p className="text-gray-600">Manage your hotspot zones and monitor active users</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Zone</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zones List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Router className="h-5 w-5 mr-2 text-blue-600" />
              Hotspot Zones
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {zones.map((zone) => (
              <div key={zone.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                    <p className="text-sm text-gray-600">{zone.location}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    zone.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {zone.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">IP Address</p>
                    <p className="font-mono text-sm">{zone.mikrotikIp}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Users</p>
                    <p className="text-sm">{zone.activeUsers || 0} / {zone.maxUsers}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => testConnection(zone.id)}
                    disabled={loading}
                    className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 disabled:opacity-50 flex items-center justify-center space-x-1"
                  >
                    <TestTube className="h-4 w-4" />
                    <span>Test</span>
                  </button>
                  <button
                    onClick={() => loadActiveUsers(zone)}
                    className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 flex items-center justify-center space-x-1"
                  >
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </button>
                  <button className="bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Active Users
              {selectedZone && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  - {selectedZone.name}
                </span>
              )}
            </h2>
          </div>
          
          <div className="p-6">
            {!selectedZone ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Select a zone to view active users</p>
              </div>
            ) : loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading users...</p>
              </div>
            ) : activeUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No active users in this zone</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeUsers.map((user, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{user.user}</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Online
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">IP Address</p>
                        <p className="font-mono">{user.address}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">MAC Address</p>
                        <p className="font-mono text-xs">{user.macAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Uptime</p>
                        <p>{user.uptime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Data Usage</p>
                        <p>↓ {formatBytes(user.bytesIn)} ↑ {formatBytes(user.bytesOut)}</p>
                      </div>
                    </div>
                    
                    <button className="mt-3 w-full bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100">
                      Disconnect User
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Zone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Zone</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Zone Name"
                value={newZone.name}
                onChange={(e) => setNewZone({...newZone, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={newZone.location}
                onChange={(e) => setNewZone({...newZone, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="MikroTik IP Address"
                value={newZone.mikrotikIp}
                onChange={(e) => setNewZone({...newZone, mikrotikIp: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="API Username"
                value={newZone.apiUser}
                onChange={(e) => setNewZone({...newZone, apiUser: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="API Password"
                value={newZone.apiPassword}
                onChange={(e) => setNewZone({...newZone, apiPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max Users"
                value={newZone.maxUsers}
                onChange={(e) => setNewZone({...newZone, maxUsers: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newZone.name && newZone.mikrotikIp) {
                    const zone = {
                      id: `zone-${Date.now()}`,
                      name: newZone.name,
                      location: newZone.location,
                      mikrotikIp: newZone.mikrotikIp,
                      isActive: true,
                      maxUsers: newZone.maxUsers,
                      activeUsers: 0
                    };
                    setZones(prev => [zone, ...prev]);
                    setShowAddModal(false);
                    setNewZone({ name: '', location: '', mikrotikIp: '', apiUser: 'admin', apiPassword: '', maxUsers: 100 });
                    alert('Zone added successfully!');
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Zone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}