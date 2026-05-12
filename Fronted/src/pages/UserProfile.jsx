import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaCalendarAlt, FaRuler, FaWeight, FaBullseye, FaSave, 
  FaEdit, FaChartLine, FaHeartbeat, FaTrophy, FaMedal, FaFire, 
  FaWater, FaDumbbell, FaCheckCircle, FaArrowRight
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user, token, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    goal: '',
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [usingDemoMode, setUsingDemoMode] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://gym-fitness-uvnr.onrender.com/api';

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age !== null && user.age !== undefined ? user.age.toString() : '',
        height: user.height !== null && user.height !== undefined ? user.height.toString() : '',
        weight: user.weight !== null && user.weight !== undefined ? user.weight.toString() : '',
        goal: user.goal || 'Stay Fit',
      });
    }
    
    const savedDemoMode = localStorage.getItem('demoMode');
    if (savedDemoMode === 'true') {
      setUsingDemoMode(true);
    }
    
    console.log('Token status:', token ? 'Token exists' : 'No token');
    console.log('User status:', user ? 'User exists' : 'No user');
  }, [user, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data - send as-is without conversion
      const updatedUserData = {
        name: formData.name.trim(),
        age: formData.age && formData.age !== '' ? Number(formData.age) : null,
        height: formData.height && formData.height !== '' ? Number(formData.height) : null,
        weight: formData.weight && formData.weight !== '' ? Number(formData.weight) : null,
        goal: formData.goal,
      };
      
      console.log('Sending update request...');
      console.log('Update data:', updatedUserData);
      
      const response = await axios.put(
        `${API_URL}/users/profile`,
        updatedUserData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Update response:', response.data);
      
      if (response.data.success && response.data.user) {
        updateUser(response.data.user);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        
        if (error.response.status === 401) {
          toast.error('Session expired. Please login again.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          toast.error(error.response.data.message || 'Failed to update profile');
        }
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      let category = '';
      let color = '';
      if (bmi < 18.5) {
        category = 'Underweight';
        color = 'text-yellow-500';
      } else if (bmi < 25) {
        category = 'Normal weight';
        color = 'text-green-500';
      } else if (bmi < 30) {
        category = 'Overweight';
        color = 'text-orange-500';
      } else {
        category = 'Obese';
        color = 'text-red-500';
      }
      return { bmi, category, color };
    }
    return null;
  };

  const calculateBMR = () => {
    if (formData.weight && formData.height && formData.age) {
      const bmr = 10 * parseFloat(formData.weight) + 6.25 * parseFloat(formData.height) - 5 * parseFloat(formData.age) + 5;
      return Math.round(bmr);
    }
    return null;
  };

  const calculateDailyCalories = () => {
    const bmr = calculateBMR();
    if (bmr) {
      const calories = bmr * 1.55;
      return Math.round(calories);
    }
    return null;
  };

  const bmiData = calculateBMI();
  const bmr = calculateBMR();
  const dailyCalories = calculateDailyCalories();

  // Rest of your JSX remains the same...
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"
            >
              <FaUser className="text-4xl text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your personal information and track your fitness journey
            </p>
            {usingDemoMode && (
              <div className="mt-2 inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm">
                📱 Demo Mode - Data saved locally
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Form */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <FaUser className="mr-2" />
                      Personal Information
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition flex items-center text-sm"
                      >
                        <FaEdit className="mr-1" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative group">
                      <FaUser className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed dark:text-white"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Age
                      </label>
                      <div className="relative group">
                        <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition" />
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition"
                          min="1"
                          max="120"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Height (cm)
                      </label>
                      <div className="relative group">
                        <FaRuler className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition" />
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition"
                          min="50"
                          max="300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Weight (kg)
                      </label>
                      <div className="relative group">
                        <FaWeight className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition" />
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition"
                          min="20"
                          max="300"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Fitness Goal
                      </label>
                      <div className="relative group">
                        <FaBullseye className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition" />
                        <select
                          name="goal"
                          value={formData.goal}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition appearance-none"
                        >
                          <option value="Weight Loss">🏃 Weight Loss</option>
                          <option value="Muscle Gain">💪 Muscle Gain</option>
                          <option value="Stay Fit">🎯 Stay Fit</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition flex items-center justify-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <FaSave className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          if (user) {
                            setFormData({
                              name: user.name || '',
                              age: user.age !== null && user.age !== undefined ? user.age.toString() : '',
                              height: user.height !== null && user.height !== undefined ? user.height.toString() : '',
                              weight: user.weight !== null && user.weight !== undefined ? user.weight.toString() : '',
                              goal: user.goal || 'Stay Fit',
                            });
                          }
                        }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white px-6 py-2 rounded-lg transition font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center">
                        <FaCheckCircle className="mr-2" />
                        Your profile information is up to date. Click "Edit Profile" to make changes.
                      </p>
                    </div>
                  )}
                </form>
              </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* BMI Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center">
                    <FaHeartbeat className="mr-2" />
                    BMI Calculator
                  </h2>
                  <FaChartLine className="text-2xl opacity-75" />
                </div>
                
                {bmiData ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-5xl font-bold">{bmiData.bmi}</p>
                      <p className={`text-lg mt-2 font-semibold ${bmiData.color}`}>{bmiData.category}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Underweight</span>
                        <span>Normal</span>
                        <span>Overweight</span>
                        <span>Obese</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full h-2 transition-all"
                          style={{ width: `${Math.min(100, (bmiData.bmi / 40) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-xs space-y-1 bg-white/10 rounded-lg p-3">
                      <p>✓ Healthy BMI range: 18.5 - 24.9</p>
                      <p>✓ Track your BMI monthly</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-sm">Enter height and weight to calculate BMI</p>
                )}
              </motion.div>

              {/* BMR & Calories Card */}
              {bmr && dailyCalories && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center">
                      <FaFire className="mr-2" />
                      Metabolism
                    </h2>
                    <FaDumbbell className="text-2xl opacity-75" />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm opacity-90">Basal Metabolic Rate (BMR)</p>
                      <p className="text-2xl font-bold">{bmr} <span className="text-sm">calories/day</span></p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Daily Calorie Need</p>
                      <p className="text-2xl font-bold">{dailyCalories} <span className="text-sm">calories/day</span></p>
                    </div>
                    <div className="text-xs bg-white/10 rounded-lg p-3">
                      <p>Based on moderate activity level (exercise 3-5 days/week)</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Account Info Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
              >
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center">
                  <FaMedal className="mr-2 text-yellow-500" />
                  Account Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Member since:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Account type:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {user?.role === 'admin' ? '👑 Administrator' : '🏃 Regular User'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Fitness Goal:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formData.goal}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Progress Tip */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-6 text-white cursor-pointer hover:shadow-2xl transition transform hover:scale-105"
                onClick={() => window.location.href = '/progress'}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Track Your Progress</h3>
                    <p className="text-sm opacity-90">Log your achievements</p>
                  </div>
                  <FaArrowRight className="text-2xl" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;