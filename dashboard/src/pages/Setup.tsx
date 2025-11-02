import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, User, MapPin, Phone, Mail, Globe, Check } from 'lucide-react';

export default function Setup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    businessType: 'university',
    ownerName: '',
    email: '',
    phone: '',
    
    // Location
    country: 'Uganda',
    city: '',
    address: '',
    
    // System Configuration
    systemName: '',
    currency: 'UGX',
    timezone: 'Africa/Kampala',
    
    // Admin Account
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    // Save customer configuration
    const customerConfig = {
      ...formData,
      setupDate: new Date().toISOString(),
      licenseKey: `SDH-${Date.now()}`,
    };
    
    localStorage.setItem('customerConfig', JSON.stringify(customerConfig));
    localStorage.setItem('setupComplete', 'true');
    
    // Redirect to dashboard
    navigate('/dashboard');
  };

  const steps = [
    { number: 1, title: 'Business Info', icon: Building },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'System Config', icon: Globe },
    { number: 4, title: 'Admin Account', icon: User },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Animated Video-like Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        {/* Moving Network Lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Animated Lines */}
          <g className="animate-pulse">
            <line x1="0" y1="20%" x2="100%" y2="20%" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2">
              <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0;0,100" dur="4s" repeatCount="indefinite" />
            </line>
            <line x1="0" y1="40%" x2="100%" y2="40%" stroke="rgba(147, 51, 234, 0.3)" strokeWidth="2">
              <animate attributeName="stroke-dasharray" values="100,0;50,50;0,100;100,0" dur="3s" repeatCount="indefinite" />
            </line>
            <line x1="0" y1="60%" x2="100%" y2="60%" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2">
              <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0;0,100" dur="5s" repeatCount="indefinite" />
            </line>
            <line x1="0" y1="80%" x2="100%" y2="80%" stroke="rgba(147, 51, 234, 0.3)" strokeWidth="2">
              <animate attributeName="stroke-dasharray" values="100,0;50,50;0,100;100,0" dur="3.5s" repeatCount="indefinite" />
            </line>
          </g>
        </svg>
        
        {/* Floating Tech Elements */}
        <div className="absolute top-10 left-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <div className="w-20 h-20 border-2 border-blue-400/40 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-blue-400/60 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
        
        <div className="absolute top-32 right-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <div className="w-16 h-16 border-2 border-purple-400/40 rounded-lg rotate-45 flex items-center justify-center">
            <div className="w-8 h-8 bg-purple-400/30 rounded-sm animate-pulse"></div>
          </div>
        </div>
        
        <div className="absolute bottom-20 left-20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
          <div className="w-24 h-24 border-2 border-indigo-400/40 rounded-full">
            <div className="w-full h-full border-4 border-transparent border-t-indigo-400/60 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>
        </div>
        
        <div className="absolute bottom-32 right-32 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}>
          <div className="w-18 h-18 border-2 border-cyan-400/40 rounded-xl">
            <div className="w-full h-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-xl animate-pulse"></div>
          </div>
        </div>
        
        {/* Data Flow Animation */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Scanning Lines Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse">
            <div className="w-full h-full animate-bounce" style={{ animationDuration: '6s' }}></div>
          </div>
        </div>
        
        {/* Matrix-like Code Rain */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-xs font-mono animate-bounce"
              style={{
                left: `${i * 12.5}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '4s'
              }}
            >
              {Array.from({ length: 20 }).map((_, j) => (
                <div key={j} className="opacity-30" style={{ animationDelay: `${j * 0.1}s` }}>
                  {Math.random() > 0.5 ? '1' : '0'}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Particle System */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-white/20 backdrop-blur-md rounded-full p-0.5 mb-4 shadow-2xl">
            <img 
              src="/logo.png" 
              alt="Sharif Digital Hub Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">WiFi Billing System Setup</h1>
          <p className="text-blue-200 mt-2">Configure your personalized billing system</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  step >= s.number 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg' 
                    : 'bg-white/10 text-white/60 border-white/30 backdrop-blur-sm'
                }`}>
                  {step > s.number ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step >= s.number ? 'text-white' : 'text-white/60'
                }`}>
                  {s.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ml-4 transition-all duration-300 ${
                    step > s.number ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    placeholder="Makerere University, Kampala International Hotel, Tech Valley Cafe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => updateField('businessType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="university">University</option>
                    <option value="school">School</option>
                    <option value="hotel">Hotel</option>
                    <option value="cafe">Cafe/Restaurant</option>
                    <option value="office">Office Building</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner/Manager Name *</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => updateField('ownerName', e.target.value)}
                    placeholder="Dr. John Mukasa, Sarah Nakato, Michael Ochieng"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="admin@makerere.ac.ug, manager@hotel.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+256 701 234 567, +256 752 345 678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Location Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Uganda">Uganda</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Kampala, Entebbe, Jinja, Mbarara"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Plot 123, University Road, Makerere Hill, Kampala"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">System Display Name *</label>
                  <input
                    type="text"
                    value={formData.systemName}
                    onChange={(e) => updateField('systemName', e.target.value)}
                    placeholder="Makerere WiFi Portal, Hotel Guest Internet, Cafe Hotspot"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">This will appear in your dashboard header</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => updateField('currency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="UGX">UGX - Ugandan Shilling</option>
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="TZS">TZS - Tanzanian Shilling</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => updateField('timezone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Africa/Kampala">Africa/Kampala (UTC+3)</option>
                    <option value="Africa/Nairobi">Africa/Nairobi (UTC+3)</option>
                    <option value="Africa/Dar_es_Salaam">Africa/Dar_es_Salaam (UTC+3)</option>
                    <option value="UTC">UTC (UTC+0)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Admin Account</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email *</label>
                  <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => updateField('adminEmail', e.target.value)}
                    placeholder="admin@makerere.ac.ug, it@hotel.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => updateField('adminPassword', e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">
                      {formData.businessName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase() || 'BN'}
                    </span>
                  </div>
                  Setup Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <p className="font-medium">Business Details</p>
                    <p className="text-blue-700">{formData.businessName || 'Not specified'}</p>
                    <p className="text-blue-600">{formData.ownerName || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="font-medium">System Configuration</p>
                    <p className="text-blue-700">{formData.systemName || 'Not specified'}</p>
                    <p className="text-blue-600">{formData.city}, {formData.country}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={step === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Complete Setup
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-white/70">
          Powered by <strong className="text-white">Sharif Digital Hub</strong> - WiFi Billing Solutions
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
      `}</style>
    </div>
  );
}