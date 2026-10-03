import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session on mount
  const loadUserSession = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetchCurrentUser();
      if (res.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Session restoration failed:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserSession();
  }, [loadUserSession]);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    if (res.success) {
      const { user: userData, token: userToken } = res.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      await loadUserSession();
    }
    return res;
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    if (res.success) {
      const { user: registeredUser, token: userToken } = res.data;
      setUser(registeredUser);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      await loadUserSession();
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const refreshProfile = async () => {
    if (token) {
      await loadUserSession();
    }
  };

  const value = {
    user,
    token,
    profile,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    register,
    logout,
    refreshProfile,
    role: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
