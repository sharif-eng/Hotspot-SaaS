import { useState } from 'react';
import { Ticket, Plus, Search, Download, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Vouchers() {
  const [vouchers, setVouchers] = useState([
    { id: 'VCH001', code: 'ABC12345', plan: '1 Hour - 1GB', price: 2000, status: 'ACTIVE', zone: 'Main Campus', createdAt: '2024-01-15', expiresAt: '2024-01-16' },
    { id: 'VCH002', code: 'DEF67890', plan: '24 Hours - 5GB', price: 15000, status: 'USED', zone: 'Library', createdAt: '2024-01-14', expiresAt: '2024-01-15' },
    { id: 'VCH003', code: 'GHI11111', plan: '1 Week - Unlimited', price: 50000, status: 'EXPIRED', zone: 'Cafeteria', createdAt: '2024-01-10', expiresAt: '2024-01-17' },
    { id: 'VCH004', code: 'JKL22222', plan: '30 Minutes - 500MB', price: 1000, status: 'ACTIVE', zone: 'Main Campus', createdAt: '2024-01-15', expiresAt: '2024-01-16' },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, []);
  const [createModal, setCreateModal] = useState(false);
  const [bulkModal, setBulkModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleGenerateVoucher = async (planId: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/vouchers/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          planId: planId.toString(),
          quantity: 1,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Generated voucher: ${result.code || 'Success'}`);
        fetchVouchers();
      } else {
        alert('Failed to generate voucher');
      }
    } catch (error) {
      alert('Error generating voucher');
    } finally {
      setLoading(false);
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await fetch('/api/vouchers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setVouchers(data);
      }
    } catch (error) {
      console.error('Failed to fetch vouchers:', error);
    }
  };

  const fetchVouchers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:3000/api/vouchers', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setVouchers(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch vouchers');
    }
  };

  const [vouchers2] = useState([
    { id: 'VCH001', code: 'ABC12345', plan: '1 Hour - 1GB', price: 2000, status: 'ACTIVE', zone: 'Main Campus', createdAt: '2024-01-15', expiresAt: '2024-01-16' },
    { id: 'VCH002', code: 'DEF67890', plan: '24 Hours - 5GB', price: 15000, status: 'USED', zone: 'Library', createdAt: '2024-01-14', expiresAt: '2024-01-15' },
    { id: 'VCH003', code: 'GHI11111', plan: '1 Week - Unlimited', price: 50000, status: 'EXPIRED', zone: 'Cafeteria', createdAt: '2024-01-10', expiresAt: '2024-01-17' },
    { id: 'VCH004', code: 'JKL22222', plan: '30 Minutes - 500MB', price: 1000, status: 'ACTIVE', zone: 'Main Campus', createdAt: '2024-01-15', expiresAt: '2024-01-16' },
  ]);

  const [plans] = useState([
    { id: 1, name: '30 Minutes - 500MB', duration: 30, dataLimit: '500MB', price: 1000, tier: 'BASIC' },
    { id: 2, name: '1 Hour - 1GB', duration: 60, dataLimit: '1GB', price: 2000, tier: 'BASIC' },
    { id: 3, name: '24 Hours - 5GB', duration: 1440, dataLimit: '5GB', price: 15000, tier: 'PREMIUM' },
    { id: 4, name: '1 Week - Unlimited', duration: 10080, dataLimit: 'Unlimited', price: 50000, tier: 'VIP' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'USED': return 'bg-blue-100 text-blue-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4" />;
      case 'USED': return <CheckCircle className="h-4 w-4" />;
      case 'EXPIRED': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Voucher Management</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => setBulkModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            <span>Bulk Generate</span>
          </button>
          <button 
            onClick={() => setCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Create Voucher</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Ticket className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Vouchers</p>
              <p className="text-2xl font-bold text-gray-900">{vouchers.filter(v => v.status === 'ACTIVE').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Used Vouchers</p>
              <p className="text-2xl font-bold text-gray-900">{vouchers.filter(v => v.status === 'USED').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">{vouchers.filter(v => v.status === 'EXPIRED').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">UGX {vouchers.filter(v => v.status === 'USED').reduce((sum, v) => sum + v.price, 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Voucher Plans */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Voucher Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Duration: {plan.duration} minutes</p>
                <p>Data: {plan.dataLimit}</p>
                <p className="font-semibold text-green-600">UGX {plan.price.toLocaleString()}</p>
              </div>
              <button 
                onClick={() => handleGenerateVoucher(plan.id)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Generate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Vouchers List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search vouchers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>ACTIVE</option>
            <option>USED</option>
            <option>EXPIRED</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vouchers.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-gray-900">{voucher.code}</div>
                    <div className="text-sm text-gray-500">{voucher.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {voucher.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    UGX {voucher.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(voucher.status)}`}>
                      {getStatusIcon(voucher.status)}
                      <span className="ml-1">{voucher.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {voucher.zone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {voucher.expiresAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Voucher Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Create Single Voucher</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Plan</label>
                <select 
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Choose a plan</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.name}>{plan.name} - UGX {plan.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setCreateModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (selectedPlan) {
                    const plan = plans.find(p => p.name === selectedPlan);
                    handleGenerateVoucher(plan?.id || 1);
                    setCreateModal(false);
                    setSelectedPlan('');
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Generate Modal */}
      {bulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Bulk Generate Vouchers</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Plan</label>
                <select 
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Choose a plan</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.name}>{plan.name} - UGX {plan.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input 
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setBulkModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (selectedPlan && quantity) {
                    const plan = plans.find(p => p.name === selectedPlan);
                    for (let i = 0; i < parseInt(quantity); i++) {
                      handleGenerateVoucher(plan?.id || 1);
                    }
                    setBulkModal(false);
                    setSelectedPlan('');
                    setQuantity('1');
                  }
                }}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg"
              >
                Generate {quantity} Vouchers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}