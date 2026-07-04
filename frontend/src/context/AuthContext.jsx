import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/dataService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate session by calling /auth/me — the HttpOnly cookie is sent automatically
    authService.getMe()
      .then(res => {
        const userData = res.data.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      })
      .catch(() => {
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { user: userData } = res.data.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    const { user: userData } = res.data.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the API call fails, clear local state
    }
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user && ['super_admin', 'admin', 'officer', 'reviewer'].includes(user.role);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
