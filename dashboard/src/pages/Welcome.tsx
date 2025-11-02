import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Wifi, Shield, Zap, Users, Eye, EyeOff, Building } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Welcome() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (isLogin) {
      try {
        await login(email, password);
        navigate('/dashboard');
      } catch (error) {
        console.error('Login failed');
      }
    } else {
      // Redirect to setup for signup
      navigate('/setup');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Landing Content */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Floating WiFi Signals */}
          <div className="absolute top-20 left-20 animate-pulse">
            <div className="w-32 h-32 border-4 border-blue-400/30 rounded-full animate-ping"></div>
            <Wifi className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-400" />
          </div>
          
          <div className="absolute top-40 right-32 animate-pulse delay-1000">
            <div className="w-24 h-24 border-4 border-purple-400/30 rounded-full animate-ping"></div>
            <Shield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-400" />
          </div>
          
          <div className="absolute bottom-32 left-32 animate-pulse delay-2000">
            <div className="w-28 h-28 border-4 border-indigo-400/30 rounded-full animate-ping"></div>
            <Users className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-7 w-7 text-indigo-400" />
          </div>

          {/* Network Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-white/20"></div>
              ))}
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-12 lg:px-20">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full p-0.5">
                <img 
                  src="/logo.png" 
                  alt="Sharif Digital Hub Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Sharif Digital Hub</h1>
                <p className="text-blue-200 text-sm">WiFi Billing Solutions</p>
              </div>
            </div>

            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                WiFi Business
              </span>
            </h2>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Professional hotspot management with mobile money integration, 
              real-time analytics, and automated voucher systems. 
              Trusted by 500+ businesses across East Africa.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">5-Min Setup</p>
                  <p className="text-blue-200 text-sm">Instant activation</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Bank-Level Security</p>
                  <p className="text-blue-200 text-sm">99.9% uptime</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">MikroTik Ready</p>
                  <p className="text-blue-200 text-sm">Seamless integration</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">24/7 Support</p>
                  <p className="text-blue-200 text-sm">Local expertise</p>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Trusted by universities, hotels & cafes across Uganda
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full max-w-md bg-white flex flex-col justify-center px-8 py-12">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-0.5 shadow-lg">
              <img 
                src="/logo.png" 
                alt="Sharif Digital Hub Logo" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          
          {/* Form Header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h3>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to your dashboard' : 'Create your WiFi billing system'}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="relative flex bg-gray-100 rounded-xl p-1 mb-6">
            {/* Sliding Background */}
            <div 
              className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm transition-transform duration-300 ease-in-out ${
                isLogin ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
            
            <button
              onClick={() => setIsLogin(true)}
              className={`relative z-10 flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300 ${
                isLogin ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`relative z-10 flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300 ${
                !isLogin ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {isLogin && (
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            )}

            {/* Animated Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Start Free Setup'}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Forgot your password?
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 Sharif Digital Hub. All rights reserved.
            </p>
            {!isLogin && (
              <p className="text-xs text-gray-400 mt-2">
                No credit card required • Instant setup • 24/7 support
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}