import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('adminToken');
        const storedUser = localStorage.getItem('adminUser');

        if (storedToken && storedUser) {
          const cleanToken = storedToken.trim().replace(/^["']|["']$/g, '');
          setToken(cleanToken);
          setUser(JSON.parse(storedUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;
        }
      } catch (err) {
        console.error("Auth init error:", err);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (authToken, userData) => {
    const cleanToken = authToken.trim().replace(/^["']|["']$/g, '');
    setToken(cleanToken);
    setUser(userData);
    localStorage.setItem('adminToken', cleanToken);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.success) {
        const { token: authToken, user: userData } = response.data;
        if (userData.role !== 'admin') {
           toast.error("Access denied: Not an administrator");
           return { success: false, user: userData };
        }
        handleAuthSuccess(authToken, userData);
        toast.success('Admin Login successful!');
        return { success: true, user: userData };
      }
      return { success: false };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false };
    }
  };

  const registerAdmin = async (userData, adminSecret) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register-admin`, {
        ...userData,
        adminSecret
      });
      if (response.data.success) {
        const { token: authToken, user: newUserData } = response.data;
        handleAuthSuccess(authToken, newUserData);
        toast.success('Admin Registration successful!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin Registration failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(`${API_URL}/auth/change-password`, {
        currentPassword,
        newPassword
      });
      if (response.data.success) {
        toast.success('Password updated successfully!');
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      registerAdmin,
      logout,
      changePassword,
      isAdmin: user?.role === 'admin'
    }}>
      {!loading && children}
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
