import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Ticket, CreditCard, MapPin, Settings, Wifi, Clock } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Vouchers', href: '/dashboard/vouchers', icon: Ticket },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Pending Payments', href: '/dashboard/pending-payments', icon: Clock },
  { name: 'Zones', href: '/dashboard/zones', icon: MapPin },
  { name: 'Hotspot Settings', href: '/dashboard/hotspot-settings', icon: Wifi },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  // Get customer configuration
  const customerConfig = JSON.parse(localStorage.getItem('customerConfig') || '{}');
  const businessName = customerConfig.businessName || 'Sharif Digital Hub';
  const initials = businessName.split(' ').map(word => word[0]).join('').substring(0, 3).toUpperCase() || 'SDH';
  
  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">{initials}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">{businessName}</h2>
            <p className="text-xs text-gray-400">Billing System</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white border-r-2 border-blue-400'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Sharif Digital Hub
        </div>
      </div>
    </div>
    </>
  );
}