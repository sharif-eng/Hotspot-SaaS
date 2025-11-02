import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Eye, Phone, CreditCard } from 'lucide-react';

interface PendingPayment {
  id: string;
  phoneNumber: string;
  transactionId: string;
  packageId: string;
  packageName: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  mikrotikParams?: any;
}

export default function PendingPayments() {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPendingPayments();
    const interval = setInterval(loadPendingPayments, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPendingPayments = () => {
    const pendingPayments = JSON.parse(localStorage.getItem('pendingPayments') || '[]');
    setPayments(pendingPayments);
  };

  const handleApprove = (payment: PendingPayment) => {
    // Generate voucher code
    const voucherCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Update payment status
    const updatedPayments = payments.map(p => 
      p.id === payment.id 
        ? { ...p, status: 'APPROVED' as const, voucherCode, approvedAt: new Date().toISOString() }
        : p
    );
    
    setPayments(updatedPayments);
    localStorage.setItem('pendingPayments', JSON.stringify(updatedPayments));
    
    // Add to completed payments
    const completedPayments = JSON.parse(localStorage.getItem('completedPayments') || '[]');
    completedPayments.unshift({
      id: payment.id,
      user: 'Guest User',
      amount: payment.amount,
      method: 'MTN Mobile Money',
      phone: payment.phoneNumber,
      status: 'COMPLETED',
      date: new Date().toLocaleString(),
      reference: payment.transactionId,
      voucherCode
    });
    localStorage.setItem('completedPayments', JSON.stringify(completedPayments));
    
    alert(`Payment approved! Voucher code: ${voucherCode}\n\nThe customer will receive this code for WiFi access.`);
    setShowModal(false);
  };

  const handleReject = (payment: PendingPayment) => {
    const updatedPayments = payments.map(p => 
      p.id === payment.id 
        ? { ...p, status: 'REJECTED' as const, rejectedAt: new Date().toISOString() }
        : p
    );
    
    setPayments(updatedPayments);
    localStorage.setItem('pendingPayments', JSON.stringify(updatedPayments));
    
    alert('Payment rejected. Customer will be notified.');
    setShowModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const pendingCount = payments.filter(p => p.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Verification</h1>
          <p className="text-gray-600">Review and approve customer payments</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg font-medium">
          {pendingCount} Pending Approvals
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.status === 'APPROVED').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.status === 'REJECTED').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Requests</h2>
        
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No payment requests yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{payment.phoneNumber}</span>
                        </div>
                        <div className="text-sm text-gray-500 font-mono">{payment.transactionId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.packageName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Review Payment</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone Number:</span>
                    <span className="font-medium">{selectedPayment.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-xs">{selectedPayment.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-medium">{selectedPayment.packageName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-green-600">
                      {selectedPayment.currency} {selectedPayment.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span>{new Date(selectedPayment.submittedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Verification Steps</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Verify transaction ID in MTN/Airtel system</li>
                  <li>2. Confirm amount matches package price</li>
                  <li>3. Check phone number matches sender</li>
                  <li>4. Approve to generate voucher code</li>
                </ol>
              </div>
            </div>

            {selectedPayment.status === 'PENDING' ? (
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedPayment)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedPayment)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            ) : (
              <div className="flex mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}