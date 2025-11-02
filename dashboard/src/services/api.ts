const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    },
    
    register: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    }
  },

  users: {
    getProfile: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.json();
    }
  },

  dashboard: {
    getStats: async (token: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('API not available');
        return response.json();
      } catch (error) {
        // Return fallback data if API is not running
        return {
          totalUsers: 1,
          activeVouchers: 0,
          totalRevenue: 0,
          activeSessions: 0,
          totalZones: 1,
          recentPayments: [],
        };
      }
    }
  }
};