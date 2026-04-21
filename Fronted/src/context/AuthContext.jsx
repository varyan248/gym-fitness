// // import React, { createContext, useState, useContext, useEffect } from 'react';
// // import axios from 'axios';
// // import toast from 'react-hot-toast';

// // const AuthContext = createContext();

// // export const useAuth = () => useContext(AuthContext);

// // // Use Vite environment variable or fallback to local backend port
// // const API_URL = import.meta.env.VITE_API_URL || 'http://gym-fitness-uvnr.onrender.com/api';

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [token, setToken] = useState(localStorage.getItem('token'));

// //   useEffect(() => {
// //     if (token) {
// //       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// //       fetchUser();
// //     } else {
// //       setLoading(false);
// //     }
// //   }, [token]);

// //   const fetchUser = async () => {
// //     try {
// //       const response = await axios.get(`${API_URL}/auth/me`);
// //       setUser(response.data.user);
// //     } catch (error) {
// //       console.error('Error fetching user:', error);
// //       logout();
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const login = async (email, password) => {
// //     try {
// //       const response = await axios.post(`${API_URL}/auth/login`, { email, password });
// //       if (response.data.success) {
// //         const { token, user } = response.data;
// //         handleAuthSuccess(token, user);
// //         toast.success('Login successful!');
// //         console.log("Login successful, user data:", user); // Debug log
// //         return true;
// //       }
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || 'Login failed');
// //       console.error("Full Error Object:", error);
// //       console.error("Server Response Data:", error.response?.data);
// //       console.error("Error Status:", error.response?.status);
// //       console.error("Error Messaege:", error.response?.data?.message);
// //       return false;
// //     }
// //   };

// //   const register = async (userData) => {
// //     try {
// //       // IMPORTANT FIX: Backend expects 'name' not 'fullName'
// //       const formattedData = {
// //         name: userData.fullName || userData.name,  // Changed from fullName to name
// //         email: userData.email,
// //         password: userData.password,
// //         age: parseInt(userData.age),
// //         height: parseInt(userData.height),
// //         weight: parseInt(userData.weight),
// //         goal: userData.goal
// //       };

// //       console.log("Sending registration data:", formattedData);
      
// //       const response = await axios.post(`${API_URL}/auth/register`, formattedData);
      
// //       if (response.data.success) {
// //         const { token, user } = response.data;
// //         handleAuthSuccess(token, user);
// //         toast.success('Registration successful!');
// //         return true;
// //       }
// //     } catch (error) {
// //       // Detailed logging to catch why it's "undefined"
// //       console.error("Full Error Object:", error);
// //       console.error("Server Response Data:", error.response?.data);
// //       console.error("Error Status:", error.response?.status);
// //       console.error("Error Messaege:", error.response?.data?.message);
      
// //       // Show more specific error message
// //       const errorMessage = error.response?.data?.message || 
// //                           error.response?.data?.error || 
// //                           'Registration failed. Please check your inputs.';
// //       toast.error(errorMessage);
// //       return false;
// //     }
// //   };

// //   const handleAuthSuccess = (token, user) => {
// //     localStorage.setItem('token', token);
// //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// //     setToken(token);
// //     setUser(user);
// //   };

// //   const logout = () => {
// //     localStorage.removeItem('token');
// //     delete axios.defaults.headers.common['Authorization'];
// //     setToken(null);
// //     setUser(null);
// //     toast.success('Logged out successfully');
// //   };

// //   const value = {
// //     user,
// //     login,
// //     register,
// //     logout,
// //     loading,
// //     isAdmin: user?.role === 'admin',
// //   };

// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // };

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// // Use Vite environment variable or fallback to local backend port
// const API_URL = import.meta.env.VITE_API_URL || 'http://gym-fitness-uvnr.onrender.com/api';

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(localStorage.getItem('token'));

//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/auth/me`);
//       setUser(response.data.user);
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post(`${API_URL}/auth/login`, { email, password });
//       if (response.data.success) {
//         const { token: authToken, user: userData } = response.data;
//         handleAuthSuccess(authToken, userData);
//         toast.success('Login successful!');
//         console.log("Login successful, user data:", userData);
//         return true;
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Login failed');
//       console.error("Full Error Object:", error);
//       console.error("Server Response Data:", error.response?.data);
//       console.error("Error Status:", error.response?.status);
//       return false;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       // Backend expects 'name' not 'fullName'
//       const formattedData = {
//         name: userData.fullName || userData.name,
//         email: userData.email,
//         password: userData.password,
//         age: parseInt(userData.age),
//         height: parseInt(userData.height),
//         weight: parseInt(userData.weight),
//         goal: userData.goal
//       };

//       console.log("Sending registration data:", formattedData);
      
//       const response = await axios.post(`${API_URL}/auth/register`, formattedData);
      
//       if (response.data.success) {
//         const { token: authToken, user: userData } = response.data;
//         handleAuthSuccess(authToken, userData);
//         toast.success('Registration successful!');
//         return true;
//       }
//     } catch (error) {
//       console.error("Full Error Object:", error);
//       console.error("Server Response Data:", error.response?.data);
//       console.error("Error Status:", error.response?.status);
      
//       const errorMessage = error.response?.data?.message || 
//                           error.response?.data?.error || 
//                           'Registration failed. Please check your inputs.';
//       toast.error(errorMessage);
//       return false;
//     }
//   };

//   const handleAuthSuccess = (authToken, userData) => {
//     localStorage.setItem('token', authToken);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
//     setToken(authToken);
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//     setToken(null);
//     setUser(null);
//     toast.success('Logged out successfully');
//   };

//   const updateUser = (updatedUser) => {
//     setUser(updatedUser);
//     localStorage.setItem('user', JSON.stringify(updatedUser));
//   };

//   const value = {
//     user,
//     token,
//     login,
//     register,
//     logout,
//     updateUser,
//     loading,
//     isAdmin: user?.role === 'admin',
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://gym-fitness-uvnr.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
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
        age: parseInt(userData.age),
        height: parseInt(userData.height),
        weight: parseInt(userData.weight),
        goal: userData.goal
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
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
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