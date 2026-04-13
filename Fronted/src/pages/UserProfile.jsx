import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaCalendarAlt, FaRuler, FaWeight, FaBullseye, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    goal: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || '',
        height: user.height || '',
        weight: user.weight || '',
        goal: user.goal || 'Stay Fit',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/users/profile`, formData);
      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      let category = '';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal weight';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obese';
      return { bmi, category };
    }
    return null;
  };

  const bmiData = calculateBMI();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Personal Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="input pl-10 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Age
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="input pl-10"
                        min="1"
                        max="120"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Height (cm)
                    </label>
                    <div className="relative">
                      <FaRuler className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="input pl-10"
                        min="50"
                        max="300"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Weight (kg)
                    </label>
                    <div className="relative">
                      <FaWeight className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="input pl-10"
                        min="20"
                        max="300"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fitness Goal
                    </label>
                    <div className="relative">
                      <FaBullseye className="absolute left-3 top-3 text-gray-400" />
                      <select
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        className="input pl-10"
                      >
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Muscle Gain">Muscle Gain</option>
                        <option value="Stay Fit">Stay Fit</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center"
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
              </form>
            </div>
          </div>

          {/* BMI Calculator Card */}
          <div className="lg:col-span-1">
            <div className="card bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <h2 className="text-xl font-bold mb-4">BMI Calculator</h2>
              
              {bmiData ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{bmiData.bmi}</p>
                    <p className="text-lg mt-2">{bmiData.category}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Underweight</span>
                      <span>Normal</span>
                      <span>Overweight</span>
                      <span>Obese</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 rounded-full h-2 transition-all"
                        style={{ width: `${Math.min(100, (bmiData.bmi / 40) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm mt-4">
                    <p>✓ Healthy BMI range: 18.5 - 24.9</p>
                    <p>✓ Keep track of your BMI monthly</p>
                  </div>
                </div>
              ) : (
                <p className="text-center">Enter height and weight to calculate BMI</p>
              )}
            </div>

            {/* Account Info Card */}
            <div className="card mt-6">
              <h3 className="font-semibold mb-3">Account Information</h3>
              <div className="space-y-2 text-sm">
                <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
                <p>Last login: {new Date(user?.lastLogin).toLocaleDateString()}</p>
                <p>Account type: {user?.role === 'admin' ? 'Administrator' : 'Regular User'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;