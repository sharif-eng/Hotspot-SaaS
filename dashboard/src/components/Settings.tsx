import { useState } from 'react';
import { Settings as SettingsIcon, Save, Key, Shield, Database, Wifi, Bell, Globe, Upload } from 'lucide-react';
import Toggle from './ui/Toggle';
import Avatar from './ui/Avatar';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: 'Sharif Digital Hub',
      systemName: 'WiFi Billing System',
      timezone: 'Africa/Kampala',
      currency: 'UGX',
      language: 'English',
    },
    security: {
      jwtExpiry: '15m',
      refreshExpiry: '7d',
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      twoFactorAuth: false,
    },
    payment: {
      mtnEnabled: true,
      airtelEnabled: true,
      cashEnabled: true,
      autoRefund: false,
      paymentTimeout: 300,
    },
    mikrotik: {
      defaultPort: 8728,
      connectionTimeout: 5000,
      autoReconnect: true,
      healthCheckInterval: 60,
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      webhookEnabled: true,
      lowBalanceAlert: true,
      systemAlerts: true,
    },
  });

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'payment', name: 'Payments', icon: Key },
    { id: 'mikrotik', name: 'MikroTik', icon: Wifi },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  const handleSave = () => {
    // Simulate save
    alert('Settings saved successfully!');
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
              
              {/* Profile Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Business Profile</h3>
                <div className="flex items-center space-x-6">
                  <Avatar 
                    name={settings.general.companyName}
                    size="xl"
                    editable
                    onUpload={(file) => console.log('Upload:', file.name)}
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{settings.general.companyName}</h4>
                    <p className="text-sm text-gray-600">{settings.general.systemName}</p>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                      <Upload className="h-4 w-4" />
                      <span>Upload Logo</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={settings.general.companyName}
                    onChange={(e) => updateSetting('general', 'companyName', e.target.value)}
                    placeholder="e.g., Makerere University, Kampala Hotel, Tech Cafe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
                  <input
                    type="text"
                    value={settings.general.systemName}
                    onChange={(e) => updateSetting('general', 'systemName', e.target.value)}
                    placeholder="e.g., Campus WiFi Portal, Hotel Internet, Cafe Hotspot"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Africa/Kampala">Africa/Kampala (UTC+3)</option>
                    <option value="Africa/Nairobi">Africa/Nairobi (UTC+3)</option>
                    <option value="UTC">UTC (UTC+0)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={settings.general.currency}
                    onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="UGX">UGX - Ugandan Shilling</option>
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">JWT Token Expiry</label>
                  <select
                    value={settings.security.jwtExpiry}
                    onChange={(e) => updateSetting('security', 'jwtExpiry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="15m">15 minutes</option>
                    <option value="30m">30 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="24h">24 hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Token Expiry</label>
                  <select
                    value={settings.security.refreshExpiry}
                    onChange={(e) => updateSetting('security', 'refreshExpiry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="7d">7 days</option>
                    <option value="30d">30 days</option>
                    <option value="90d">90 days</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </label>
                <Toggle
                  enabled={settings.security.twoFactorAuth}
                  onChange={(enabled) => updateSetting('security', 'twoFactorAuth', enabled)}
                />
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Payment Settings</h2>
              
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-900">MTN Mobile Money</label>
                      <p className="text-xs text-gray-500">Accept payments via MTN MoMo</p>
                    </div>
                    <Toggle
                      enabled={settings.payment.mtnEnabled}
                      onChange={(enabled) => updateSetting('payment', 'mtnEnabled', enabled)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Airtel Money</label>
                      <p className="text-xs text-gray-500">Accept payments via Airtel Money</p>
                    </div>
                    <Toggle
                      enabled={settings.payment.airtelEnabled}
                      onChange={(enabled) => updateSetting('payment', 'airtelEnabled', enabled)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Cash Payments</label>
                      <p className="text-xs text-gray-500">Accept manual cash payments</p>
                    </div>
                    <Toggle
                      enabled={settings.payment.cashEnabled}
                      onChange={(enabled) => updateSetting('payment', 'cashEnabled', enabled)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Automatic Refunds</label>
                      <p className="text-xs text-gray-500">Process refunds automatically</p>
                    </div>
                    <Toggle
                      enabled={settings.payment.autoRefund}
                      onChange={(enabled) => updateSetting('payment', 'autoRefund', enabled)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Timeout (seconds)</label>
                  <input
                    type="number"
                    value={settings.payment.paymentTimeout}
                    onChange={(e) => updateSetting('payment', 'paymentTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mikrotik' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">MikroTik Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default API Port</label>
                  <input
                    type="number"
                    value={settings.mikrotik.defaultPort}
                    onChange={(e) => updateSetting('mikrotik', 'defaultPort', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Connection Timeout (ms)</label>
                  <input
                    type="number"
                    value={settings.mikrotik.connectionTimeout}
                    onChange={(e) => updateSetting('mikrotik', 'connectionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Health Check Interval (seconds)</label>
                  <input
                    type="number"
                    value={settings.mikrotik.healthCheckInterval}
                    onChange={(e) => updateSetting('mikrotik', 'healthCheckInterval', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-900">Auto-Reconnect</label>
                  <p className="text-xs text-gray-500">Automatically reconnect to MikroTik devices</p>
                </div>
                <Toggle
                  enabled={settings.mikrotik.autoReconnect}
                  onChange={(enabled) => updateSetting('mikrotik', 'autoReconnect', enabled)}
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailEnabled"
                    checked={settings.notifications.emailEnabled}
                    onChange={(e) => updateSetting('notifications', 'emailEnabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailEnabled" className="ml-2 block text-sm text-gray-900">
                    Enable Email Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsEnabled"
                    checked={settings.notifications.smsEnabled}
                    onChange={(e) => updateSetting('notifications', 'smsEnabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="smsEnabled" className="ml-2 block text-sm text-gray-900">
                    Enable SMS Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="webhookEnabled"
                    checked={settings.notifications.webhookEnabled}
                    onChange={(e) => updateSetting('notifications', 'webhookEnabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="webhookEnabled" className="ml-2 block text-sm text-gray-900">
                    Enable Webhook Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowBalanceAlert"
                    checked={settings.notifications.lowBalanceAlert}
                    onChange={(e) => updateSetting('notifications', 'lowBalanceAlert', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="lowBalanceAlert" className="ml-2 block text-sm text-gray-900">
                    Low Balance Alerts
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="systemAlerts"
                    checked={settings.notifications.systemAlerts}
                    onChange={(e) => updateSetting('notifications', 'systemAlerts', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="systemAlerts" className="ml-2 block text-sm text-gray-900">
                    System Health Alerts
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Version</p>
            <p className="text-lg font-semibold text-gray-900">v1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-lg font-semibold text-gray-900">2024-01-15</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">License</p>
            <p className="text-lg font-semibold text-gray-900">Sharif Digital Hub</p>
          </div>
        </div>
      </div>
    </div>
  );
}