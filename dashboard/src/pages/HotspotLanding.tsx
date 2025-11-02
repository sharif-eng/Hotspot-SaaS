import { useState, useEffect } from 'react';
import { Wifi, Clock, Shield, Phone, CreditCard } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  duration: number;
  price: number;
  currency: string;
  description: string;
  popular?: boolean;
}

export default function HotspotLanding() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentStep, setPaymentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mikrotikParams, setMikrotikParams] = useState<any>({});
  const [packages, setPackages] = useState<Package[]>([]);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // Get MikroTik parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    setMikrotikParams({
      dst: urlParams.get('dst'),
      popup: urlParams.get('popup'),
      serverName: urlParams.get('server-name'),
      serverAddress: urlParams.get('server-address')
    });

    // Fetch available packages from API
    fetchPackages();
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/hotspot-config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/hotspot-config');
      const config = await response.json();
      
      if (config.packages) {
        setPackages(JSON.parse(config.packages));
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    }
  };



  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} mins`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hour${Math.floor(minutes / 60) > 1 ? 's' : ''}`;
    return `${Math.floor(minutes / 1440)} day${Math.floor(minutes / 1440) > 1 ? 's' : ''}`;
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setPaymentStep(2);
  };

  const handlePaymentConfirm = async () => {
    if (!phoneNumber || !transactionId) {
      alert('Please enter both phone number and transaction ID');
      return;
    }

    setLoading(true);
    try {
      // Submit payment for admin verification
      const paymentData = {
        id: `PAY${Date.now()}`,
        phoneNumber,
        transactionId,
        packageId: selectedPackage?.id,
        packageName: selectedPackage?.name,
        amount: selectedPackage?.price,
        currency: selectedPackage?.currency,
        status: 'PENDING',
        submittedAt: new Date().toISOString(),
        mikrotikParams
      };
      
      // Store in localStorage for demo (in production, send to API)
      const existingPayments = JSON.parse(localStorage.getItem('pendingPayments') || '[]');
      existingPayments.unshift(paymentData);
      localStorage.setItem('pendingPayments', JSON.stringify(existingPayments));
      
      alert(`Payment submitted successfully!\n\nTransaction ID: ${transactionId}\n\nYour payment is being verified by our admin team. You will receive your voucher code once approved.\n\nPlease wait for verification (usually takes 2-5 minutes).`);
      
      setSelectedPackage(null);
      setPhoneNumber('');
      setTransactionId('');
      setPaymentStep(1);
    } catch (error) {
      console.error('Payment submission error:', error);
      alert('Failed to submit payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 animate-pulse">
          <div className="w-32 h-32 border-4 border-blue-400/30 rounded-full animate-ping"></div>
          <Wifi className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-400" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 p-3">
              <img 
                src={config?.logoUrl || '/logo.png'} 
                alt="Business Logo" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{config?.businessName || 'WiFi Access Portal'}</h1>
            <p className="text-blue-200">Get instant internet access with mobile money</p>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            {paymentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Your Internet Package</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handlePackageSelect(pkg)}
                      className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        pkg.popular 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                        <p className="text-2xl font-bold text-blue-600 mb-2">
                          {formatPrice(pkg.price, pkg.currency)}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">{formatDuration(pkg.duration)}</p>
                        <p className="text-xs text-gray-500">{pkg.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {paymentStep === 2 && selectedPackage && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Make Payment</h2>
                
                <div className="max-w-md mx-auto">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Selected Package</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800">{selectedPackage.name}</span>
                      <span className="font-bold text-blue-900">
                        {formatPrice(selectedPackage.price, selectedPackage.currency)}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">{formatDuration(selectedPackage.duration)}</p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      MTN Mobile Money Payment
                    </h3>
                    
                    <div className="space-y-3 text-sm text-yellow-800">
                      <div className="flex items-center space-x-2">
                        <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-xs font-medium">1</span>
                        <span>Dial <strong>*165#</strong> on your MTN phone</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-xs font-medium">2</span>
                        <span>Select <strong>MoMoPay</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-xs font-medium">3</span>
                        <span>Enter merchant code: <strong>{config?.merchantCode || '123456'}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-xs font-medium">4</span>
                        <span>Enter amount: <strong>{selectedPackage.price}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-xs font-medium">5</span>
                        <span>Confirm payment with your PIN</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => setPaymentStep(1)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setPaymentStep(3)}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700"
                    >
                      I've Paid
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Confirm Payment</h2>
                
                <div className="max-w-md mx-auto">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number Used for Payment
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="256701234567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction ID (from SMS)
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="MP240101.1234.A12345"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => setPaymentStep(2)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePaymentConfirm}
                      disabled={loading || !phoneNumber || !transactionId}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      ) : null}
                      {loading ? 'Verifying...' : 'Verify Payment'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-8 text-sm text-white/70">
            <p>Powered by <strong className="text-white">Sharif Digital Hub</strong></p>
            <p className="mt-1">Secure • Fast • Reliable</p>
          </div>
        </div>
      </div>
    </div>
  );
}