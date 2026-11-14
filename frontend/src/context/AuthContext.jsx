import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../services/api';
import { getAuthSession, saveAuthSession, clearAuthSession } from '../../utils/storage';

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredSession();
  }, []);

  const loadStoredSession = async () => {
    try {
      const session = await getAuthSession();
      if (session?.token && session?.user) {
        setToken(session.token);
        setUser(session.user);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      await saveAuthSession(res.data.token, res.data.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      await saveAuthSession(res.data.token, res.data.user);
    }
    return res;
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await clearAuthSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
