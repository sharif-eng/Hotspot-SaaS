import { useState, useEffect } from 'react';
import { Settings, Save, Plus, Trash2 } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  duration: number;
  price: number;
  currency: string;
  description: string;
  popular?: boolean;
}

interface PaymentStep {
  step: number;
  text: string;
}

export default function HotspotSettings() {
  const [config, setConfig] = useState({
    businessName: '',
    logoUrl: '',
    merchantCode: '',
    packages: [] as Package[],
    paymentInstructions: [] as PaymentStep[],
    theme: {
      primaryColor: '#3B82F6',
      backgroundColor: 'from-blue-900 via-purple-900 to-indigo-900',
      textColor: '#FFFFFF',
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/hotspot-config');
      const data = await response.json();
      
      setConfig({
        businessName: data.businessName || '',
        logoUrl: data.logoUrl || '',
        merchantCode: data.merchantCode || '',
        packages: JSON.parse(data.packages || '[]'),
        paymentInstructions: JSON.parse(data.paymentInstructions || '[]'),
        theme: JSON.parse(data.theme || '{}'),
      });
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hotspot-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        alert('Configuration saved successfully!');
      } else {
        alert('Failed to save configuration');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const addPackage = () => {
    const newPackage: Package = {
      id: `pkg-${Date.now()}`,
      name: 'New Package',
      duration: 60,
      price: 1000,
      currency: 'UGX',
      description: 'Package description',
    };
    setConfig(prev => ({
      ...prev,
      packages: [...prev.packages, newPackage],
    }));
  };

  const updatePackage = (index: number, field: keyof Package, value: any) => {
    setConfig(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === index ? { ...pkg, [field]: value } : pkg
      ),
    }));
  };

  const removePackage = (index: number) => {
    setConfig(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index),
    }));
  };

  const addPaymentStep = () => {
    const newStep: PaymentStep = {
      step: config.paymentInstructions.length + 1,
      text: 'New payment step',
    };
    setConfig(prev => ({
      ...prev,
      paymentInstructions: [...prev.paymentInstructions, newStep],
    }));
  };

  const updatePaymentStep = (index: number, text: string) => {
    setConfig(prev => ({
      ...prev,
      paymentInstructions: prev.paymentInstructions.map((step, i) => 
        i === index ? { ...step, text } : step
      ),
    }));
  };

  const removePaymentStep = (index: number) => {
    setConfig(prev => ({
      ...prev,
      paymentInstructions: prev.paymentInstructions.filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, step: i + 1 })),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Hotspot Landing Page Settings</h2>
        </div>
        <button
          onClick={saveConfig}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={config.businessName}
                onChange={(e) => setConfig(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Your Business Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="text"
                value={config.logoUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="/logo.png"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Money Merchant Code
              </label>
              <input
                type="text"
                value={config.merchantCode}
                onChange={(e) => setConfig(prev => ({ ...prev, merchantCode: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="123456"
              />
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={config.theme.primaryColor}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  theme: { ...prev.theme, primaryColor: e.target.value }
                }))}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Gradient
              </label>
              <select
                value={config.theme.backgroundColor}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  theme: { ...prev.theme, backgroundColor: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="from-blue-900 via-purple-900 to-indigo-900">Blue Purple</option>
                <option value="from-green-900 via-teal-900 to-blue-900">Green Teal</option>
                <option value="from-purple-900 via-pink-900 to-red-900">Purple Pink</option>
                <option value="from-gray-900 via-gray-800 to-black">Dark Gray</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Internet Packages */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Internet Packages</h3>
          <button
            onClick={addPackage}
            className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Package</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {config.packages.map((pkg, index) => (
            <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => updatePackage(index, 'name', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={pkg.duration}
                    onChange={(e) => updatePackage(index, 'duration', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    value={pkg.price}
                    onChange={(e) => updatePackage(index, 'price', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={pkg.currency}
                    onChange={(e) => updatePackage(index, 'currency', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={pkg.description}
                    onChange={(e) => updatePackage(index, 'description', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => removePackage(index)}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Payment Instructions</h3>
          <button
            onClick={addPaymentStep}
            className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Step</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {config.paymentInstructions.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                {step.step}
              </span>
              <input
                type="text"
                value={step.text}
                onChange={(e) => updatePaymentStep(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Payment instruction step"
              />
              <button
                onClick={() => removePaymentStep(index)}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}