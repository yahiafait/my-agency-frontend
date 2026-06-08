import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && user) {
      setUser(null);
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    persistAuth(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    persistAuth(data);
    return data;
  };

  const persistAuth = (data) => {
    localStorage.setItem('token', data.token);
    const userData = {
      id: data.userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
