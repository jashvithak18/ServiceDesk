import React, { createContext, useContext, useState, useEffect } from 'react';
import API, { setAccessToken } from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Silent refresh on app initial load (only when a prior session existed)
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const hasSession = localStorage.getItem('hasSession');

      // If user is an unauthenticated visitor, skip refresh to prevent console 401
      if (!storedRefreshToken && !hasSession) {
        setUser(null);
        setAccessToken(null);
        setLoading(false);
        return;
      }

      try {
        const res = await API.post('/auth/refresh', { refreshToken: storedRefreshToken });
        if (res.data.success) {
          setAccessToken(res.data.accessToken);
          if (res.data.refreshToken) {
            localStorage.setItem('refreshToken', res.data.refreshToken);
          }
          localStorage.setItem('hasSession', 'true');
          setUser(res.data.user);
        }
      } catch (err) {
        // No active session cookie or expired session
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('hasSession');
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        setAccessToken(res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        localStorage.setItem('hasSession', 'true');
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data.success) {
        setAccessToken(res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        localStorage.setItem('hasSession', 'true');
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      await API.post('/auth/logout', { refreshToken: storedRefreshToken });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('hasSession');
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
