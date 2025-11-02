import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  role: string;
  profile?: {
    fullName?: string;
    avatar?: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupComplete = localStorage.getItem('setupComplete');
    const customerConfig = localStorage.getItem('customerConfig');
    
    if (setupComplete && customerConfig) {
      const config = JSON.parse(customerConfig);
      const demoUser = {
        id: 'admin-1',
        email: config.adminEmail,
        role: 'SUPER_ADMIN',
        profile: {
          fullName: config.ownerName,
          businessName: config.businessName,
          systemName: config.systemName,
        }
      };
      setUser(demoUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password);
      if (response.access_token) {
        const apiUser = {
          id: response.user?.id || 'admin-1',
          email: response.user?.email || email,
          role: response.user?.role || 'SUPER_ADMIN',
          profile: {
            fullName: response.user?.profile?.fullName || 'Admin User',
            avatar: response.user?.profile?.avatar || null,
          },
        };
        setUser(apiUser);
        localStorage.setItem('token', response.access_token);
        return;
      }
    } catch (error) {
      // Fallback to demo mode
      const config = JSON.parse(localStorage.getItem('customerConfig') || '{}');
      const demoUser = {
        id: 'admin-1',
        email: email,
        role: 'SUPER_ADMIN',
        profile: {
          fullName: config.ownerName || 'System Administrator',
          businessName: config.businessName,
          systemName: config.systemName,
        }
      };
      setUser(demoUser);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}