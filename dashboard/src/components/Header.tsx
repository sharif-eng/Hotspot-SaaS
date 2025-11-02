import { Bell, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Avatar from './ui/Avatar';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);

  useEffect(() => {
    const handleAvatarUpdate = () => {
      setAvatarKey(prev => prev + 1);
    };
    
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdate);
  }, []);
  
  // Get customer configuration
  const customerConfig = JSON.parse(localStorage.getItem('customerConfig') || '{}');
  const businessName = customerConfig.businessName || 'Sharif Digital Hub';
  const systemName = customerConfig.systemName || 'WiFi Billing System';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="{businessName} Logo" 
              className="h-8 w-8 object-cover rounded-full"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">
                {businessName}
              </h1>
              <span className="text-sm text-gray-500">{systemName}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">3</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
            >
              <Avatar 
                key={avatarKey}
                name={user?.profile?.fullName || user?.email}
                size="sm"
              />
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-700">
                  {user?.profile?.fullName || 'Admin User'}
                </div>
                <div className="text-xs text-gray-500">{user?.role}</div>
              </div>
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Account Settings
                </button>
                <hr className="my-1" />
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 inline mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}