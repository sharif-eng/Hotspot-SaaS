import { useState, useEffect } from 'react';
import { CreditCard, Search, Download, CheckCircle, Clock, XCircle, Smartphone } from 'lucide-react';

export default function Payments() {
  const [payments, setPayments] = useState([
    { id: 'PAY001', user: 'John Doe', amount: 15000, method: 'MTN Mobile Money', phone: '256701234567', status: 'COMPLETED', date: '2024-01-15 14:30', reference: 'MTN123456789' },
    { id: 'PAY002', user: 'Jane Smith', amount: 2000, method: 'Airtel Money', phone: '256751234567', status: 'PENDING', date: '2024-01-15 15:45', reference: 'ATL987654321' },
    { id: 'PAY003', user: 'Mike Johnson', amount: 50000, method: 'MTN Mobile Money', phone: '256781234567', status: 'FAILED', date: '2024-01-15 16:20', reference: 'MTN555666777' },
    { id: 'PAY004', user: 'Sarah Wilson', amount: 1000, method: 'Cash', phone: '-', status: 'COMPLETED', date: '2024-01-15 17:10', reference: 'CASH001' },
  ]);
  const [loading, setLoading] = useState(false);

  const [fallbackPayments] = useState([
    { id: 'PAY001', user: 'John Doe', amount: 15000, method: 'MTN Mobile Money', phone: '256701234567', status: 'COMPLETED', date: '2024-01-15 14:30', reference: 'MTN123456789' },
    { id: 'PAY002', user: 'Jane Smith', amount: 2000, method: 'Airtel Money', phone: '256751234567', status: 'PENDING', date: '2024-01-15 15:45', reference: 'ATL987654321' },
    { id: 'PAY003', user: 'Mike Johnson', amount: 50000, method: 'MTN Mobile Money', phone: '256781234567', status: 'FAILED', date: '2024-01-15 16:20', reference: 'MTN555666777' },
    { id: 'PAY004', user: 'Sarah Wilson', amount: 1000, method: 'Cash', phone: '-', status: 'COMPLETED', date: '2024-01-15 17:10', reference: 'CASH001' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'FAILED': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getMethodIcon = (method: string) => {
    if (method.includes('MTN') || method.includes('Airtel')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <CreditCard className="h-4 w-4" />;
  };

  const totalRevenue = payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.status === 'COMPLETED').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.status === 'PENDING').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">UGX {totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Amount</p>
            <p className="text-2xl font-bold text-yellow-600">UGX {pendingAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Payment Methods Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">MTN Mobile Money</h3>
                <p className="text-sm text-gray-600">{payments.filter(p => p.method.includes('MTN')).length} transactions</p>
                <p className="text-sm font-semibold text-green-600">
                  UGX {payments.filter(p => p.method.includes('MTN') && p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Airtel Money</h3>
                <p className="text-sm text-gray-600">{payments.filter(p => p.method.includes('Airtel')).length} transactions</p>
                <p className="text-sm font-semibold text-green-600">
                  UGX {payments.filter(p => p.method.includes('Airtel') && p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cash</h3>
                <p className="text-sm text-gray-600">{payments.filter(p => p.method === 'Cash').length} transactions</p>
                <p className="text-sm font-semibold text-green-600">
                  UGX {payments.filter(p => p.method === 'Cash' && p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search payments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>COMPLETED</option>
            <option>PENDING</option>
            <option>FAILED</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>All Methods</option>
            <option>MTN Mobile Money</option>
            <option>Airtel Money</option>
            <option>Cash</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.user}</div>
                    {payment.phone !== '-' && (
                      <div className="text-sm text-gray-500">{payment.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    UGX {payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getMethodIcon(payment.method)}
                      <span className="text-sm text-gray-900">{payment.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">{payment.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {payment.reference}
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