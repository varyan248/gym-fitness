import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL || "https://gym-fitness-wg3l.onrender.com/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
      setUser(null);
      localStorage.removeItem('user');
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user:', error);
      // Only logout if it's an authentication error (401)
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.success) {
        const { token: authToken, user: userData } = response.data;
        handleAuthSuccess(authToken, userData);
        toast.success('Login successful!');
        return { success: true, user: userData };
      }
      return { success: false };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      const formattedData = {
        name: userData.fullName || userData.name,
        email: userData.email,
        password: userData.password,
        age: parseInt(userData.age) || null,
        height: parseInt(userData.height) || null,
        weight: parseInt(userData.weight) || null,
        goal: userData.goal || 'Stay Fit'
      };

      const response = await axios.post(`${API_URL}/auth/register`, formattedData);
      
      if (response.data.success) {
        const { token: authToken, user: userData } = response.data;
        handleAuthSuccess(authToken, userData);
        toast.success('Registration successful!');
        return true;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const registerAdmin = async (userData, adminSecret) => {
    try {
      const formattedData = {
        name: userData.fullName || userData.name,
        email: userData.email,
        password: userData.password,
        adminSecret
      };

      const response = await axios.post(`${API_URL}/auth/register-admin`, formattedData);
      
      if (response.data.success) {
        const { token: authToken, user: registeredUser } = response.data;
        handleAuthSuccess(authToken, registeredUser);
        toast.success('Admin registration successful!');
        return true;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Admin registration failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const handleAuthSuccess = (authToken, userData) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    login,
    register,
    registerAdmin,
    logout,
    updateUser,
    loading,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};