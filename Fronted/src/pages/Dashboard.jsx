import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FaCalendarCheck, 
  FaAppleAlt, 
  FaChartLine, 
  FaTint, 
  FaDumbbell, 
  FaFire,
  FaWeight,
  FaArrowRight
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://gym-fitness-wg3l.onrender.com/api';

  useEffect(() => {
    // Get current day
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    setCurrentDay(today);
    
    if (user && token) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const fetchDashboardData = async () => {
    try {
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      try {
        const progressRes = await axios.get(`${API_URL}/progress/stats`, config);
        setProgress(progressRes.data.stats || []);
      } catch (error) {
        console.log('Progress endpoint not available:', error.response?.status);
        // Set sample progress data
        setProgress({
          weightTrend: [
            { date: 'Week 1', weight: 75 },
            { date: 'Week 2', weight: 74 },
            { date: 'Week 3', weight: 73 },
            { date: 'Week 4', weight: 72 },
            { date: 'Week 5', weight: 71 },
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (user?.height && user?.weight) {
      const heightInMeters = user.height / 100;
      return (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return 'N/A';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Please log in to view your dashboard</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Today is {currentDay} - Ready to crush your fitness goals?
        </p>

        {/* Plan Status Banner */}
        <div className="mb-8">
          {user.isPlanActive ? (
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
              <div>
                <p className="font-bold text-xl mb-1">Active Subscription: {user.plan}</p>
                <p className="text-sm text-green-100 flex items-center">
                  <FaCalendarCheck className="mr-2" /> Valid until: {new Date(user.planEndDate).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => navigate('/plans')} className="w-full sm:w-auto bg-white text-green-600 px-6 py-2.5 rounded-lg font-bold hover:bg-green-50 transition transform hover:scale-105 shadow-md">
                View Plans
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
              <div>
                <p className="font-bold text-xl mb-1">No Active Plan</p>
                <p className="text-sm text-red-100">Subscribe to a plan to unlock premium features and personal training.</p>
              </div>
              <button onClick={() => navigate('/plans')} className="w-full sm:w-auto bg-white text-red-600 px-6 py-2.5 rounded-lg font-bold hover:bg-red-50 transition transform hover:scale-105 shadow-md">
                Subscribe Now
              </button>
            </div>
          )}
        </div>
        
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Current Weight</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.weight || 'N/A'} kg
                </p>
              </div>
              <FaWeight className="text-blue-500 text-3xl" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">BMI</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {calculateBMI()}
                </p>
              </div>
              <FaChartLine className="text-green-500 text-3xl" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Goal</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.goal || 'Fitness'}
                </p>
              </div>
              <FaFire className="text-red-500 text-3xl" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Daily Goal</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  8 glasses
                </p>
              </div>
              <FaTint className="text-cyan-500 text-3xl" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Workout - Link to Workout Planner */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate('/workouts')}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FaDumbbell className="mr-2" />
                Today's Workout
              </h2>
              <FaArrowRight className="text-white text-xl opacity-75" />
            </div>
            <div className="text-white space-y-2">
              <p className="text-2xl font-bold">Ready to Train? 💪</p>
              <p className="text-white/90">Check your personalized workout plan for {currentDay}</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm text-white/80">Click to view full workout schedule →</p>
              </div>
            </div>
          </motion.div>

          {/* Today's Meal Plan - Link to Diet Planner */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate('/diets')}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FaAppleAlt className="mr-2" />
                Today's Meal Plan
              </h2>
              <FaArrowRight className="text-white text-xl opacity-75" />
            </div>
            <div className="text-white space-y-2">
              <p className="text-2xl font-bold">Fuel Your Body 🍎</p>
              <p className="text-white/90">View your nutrition plan for {currentDay}</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm text-white/80">Click to see full diet schedule →</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/workouts')}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition text-left flex items-center justify-between group"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">View Workout Plan</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">See your weekly schedule</p>
              </div>
              <FaDumbbell className="text-blue-500 text-2xl group-hover:scale-110 transition" />
            </button>
            
            <button
              onClick={() => navigate('/diets')}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition text-left flex items-center justify-between group"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">View Diet Plan</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Check your nutrition</p>
              </div>
              <FaAppleAlt className="text-green-500 text-2xl group-hover:scale-110 transition" />
            </button>
            
            <button
              onClick={() => navigate('/progress')}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition text-left flex items-center justify-between group"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Track Progress</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Log your achievements</p>
              </div>
              <FaChartLine className="text-purple-500 text-2xl group-hover:scale-110 transition" />
            </button>
          </div>
        </motion.div>

        {/* Progress Chart */}
        {progress && progress.weightTrend && progress.weightTrend.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Progress Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progress.weightTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Motivational Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 italic">
            "The difference between who you are and who you want to be is what you do today."
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;