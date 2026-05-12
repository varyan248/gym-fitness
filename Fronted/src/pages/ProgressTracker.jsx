import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FaWeight, FaChartLine, FaCalendarAlt, FaPlus, FaTrash, FaExclamationTriangle, FaDumbbell } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProgressTracker = () => {
  const { user, token } = useAuth();
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    weight: '',
    bodyFat: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingDemoMode, setUsingDemoMode] = useState(true); // Start in demo mode

  const API_URL = import.meta.env.VITE_API_URL || 'https://gym-fitness-uvnr.onrender.com/api';

  useEffect(() => {
    // Always use localStorage for now to avoid 401 errors
    loadFromLocalStorage();
    setLoading(false);
  }, []);

  const loadFromLocalStorage = () => {
    // Load from localStorage if available
    const savedProgress = localStorage.getItem('fitness_progress');
    const savedStats = localStorage.getItem('fitness_stats');
    
    if (savedProgress && savedStats) {
      setProgress(JSON.parse(savedProgress));
      setStats(JSON.parse(savedStats));
    } else {
      // Create sample data
      const sampleProgress = [
        { 
          _id: '1', 
          date: new Date(Date.now() - 30*24*60*60*1000).toISOString(), 
          weight: 75, 
          bmi: 24.5, 
          notes: 'Starting point - feeling motivated!' 
        },
        { 
          _id: '2', 
          date: new Date(Date.now() - 20*24*60*60*1000).toISOString(), 
          weight: 73.5, 
          bmi: 24.0, 
          notes: 'Making progress, clothes fit better' 
        },
        { 
          _id: '3', 
          date: new Date(Date.now() - 10*24*60*60*1000).toISOString(), 
          weight: 72, 
          bmi: 23.5, 
          notes: 'Energy levels are up!' 
        },
        { 
          _id: '4', 
          date: new Date().toISOString(), 
          weight: 70.5, 
          bmi: 23.0, 
          notes: 'Hit my first milestone! 🎉' 
        },
      ];
      setProgress(sampleProgress);
      setStats({
        startWeight: 75,
        currentWeight: 70.5,
        totalLost: 4.5
      });
      
      // Save to localStorage
      localStorage.setItem('fitness_progress', JSON.stringify(sampleProgress));
      localStorage.setItem('fitness_stats', JSON.stringify({
        startWeight: 75,
        currentWeight: 70.5,
        totalLost: 4.5
      }));
    }
  };

  const saveToLocalStorage = (updatedProgress, updatedStats) => {
    localStorage.setItem('fitness_progress', JSON.stringify(updatedProgress));
    localStorage.setItem('fitness_stats', JSON.stringify(updatedStats));
  };

  const calculateBMI = (weight, height = 1.75) => {
    // Default height 1.75m if not provided
    return parseFloat((weight / (height * height)).toFixed(1));
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    
    if (!newEntry.weight) {
      toast.error('Please enter your weight');
      return;
    }
    
    const weightValue = parseFloat(newEntry.weight);
    
    // Create new entry
    const newProgressEntry = {
      _id: Date.now().toString(),
      date: new Date().toISOString(),
      weight: weightValue,
      bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : null,
      bmi: calculateBMI(weightValue),
      notes: newEntry.notes || '',
    };
    
    // Add to progress array (newest first)
    const updatedProgress = [newProgressEntry, ...progress];
    setProgress(updatedProgress);
    
    // Update stats
    const weights = updatedProgress.map(p => p.weight);
    const startWeight = weights[weights.length - 1]; // Oldest entry
    const currentWeight = weights[0]; // Newest entry
    const totalLost = parseFloat((startWeight - currentWeight).toFixed(1));
    
    const updatedStats = {
      startWeight: startWeight,
      currentWeight: currentWeight,
      totalLost: totalLost
    };
    setStats(updatedStats);
    
    // Save to localStorage
    saveToLocalStorage(updatedProgress, updatedStats);
    
    toast.success('Progress entry added!');
    setNewEntry({ weight: '', bodyFat: '', notes: '' });
    setShowAddForm(false);
  };

  const handleDeleteProgress = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const updatedProgress = progress.filter(entry => entry._id !== id);
      setProgress(updatedProgress);
      
      // Update stats
      if (updatedProgress.length > 0) {
        const weights = updatedProgress.map(p => p.weight);
        const startWeight = weights[weights.length - 1];
        const currentWeight = weights[0];
        const totalLost = parseFloat((startWeight - currentWeight).toFixed(1));
        
        const updatedStats = {
          startWeight: startWeight,
          currentWeight: currentWeight,
          totalLost: totalLost
        };
        setStats(updatedStats);
        saveToLocalStorage(updatedProgress, updatedStats);
      } else {
        setStats(null);
        localStorage.removeItem('fitness_progress');
        localStorage.removeItem('fitness_stats');
      }
      
      toast.success('Entry deleted');
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all progress data? This cannot be undone.')) {
      localStorage.removeItem('fitness_progress');
      localStorage.removeItem('fitness_stats');
      setProgress([]);
      setStats(null);
      toast.success('All data cleared');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const chartData = [...progress]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      weight: entry.weight,
      bmi: entry.bmi,
    }));

  const weightChange = stats?.startWeight && stats?.currentWeight
    ? (stats.startWeight - stats.currentWeight).toFixed(1)
    : 0;
  const isLoss = weightChange > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Progress Tracker
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Entry
            </button>
            {progress.length > 0 && (
              <button
                onClick={clearAllData}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center"
              >
                <FaTrash className="mr-2" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Demo Mode Info */}
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 flex items-start">
          <FaDumbbell className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Local Storage Mode</p>
            <p className="text-sm">Your progress is saved in your browser. Data persists even after closing the browser.</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Start Weight</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.startWeight} kg
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
                  <p className="text-gray-500 dark:text-gray-400">Current Weight</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.currentWeight} kg
                  </p>
                </div>
                <FaWeight className="text-green-500 text-3xl" />
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
                  <p className="text-gray-500 dark:text-gray-400">Total {isLoss ? 'Lost' : 'Gained'}</p>
                  <p className={`text-2xl font-bold ${isLoss ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.abs(weightChange)} kg {isLoss ? '↓' : '↑'}
                  </p>
                </div>
                <FaChartLine className="text-purple-500 text-3xl" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Entry Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Add Progress Entry
            </h2>
            <form onSubmit={handleAddProgress} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newEntry.weight}
                    onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="70.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Body Fat % (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newEntry.bodyFat}
                    onChange={(e) => setNewEntry({ ...newEntry, bodyFat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="15"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Notes (Optional)
                </label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows="3"
                  placeholder="How do you feel today? Any achievements or challenges?"
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Progress Chart */}
        {chartData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Weight Progress Over Time
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis domain={['auto', 'auto']} stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3B82F6" 
                  fill="#93C5FD" 
                  fillOpacity={0.3}
                  strokeWidth={3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Progress History Table */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Progress History
          </h2>
          {progress.length === 0 ? (
            <div className="text-center py-12">
              <FaWeight className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No progress entries yet.
              </p>
              <p className="text-gray-400 mt-2">
                Click "Add Entry" to start tracking your fitness journey!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 text-sm">Date</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 text-sm">Weight</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 text-sm hidden sm:table-cell">BMI</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 text-sm hidden md:table-cell">Notes</th>
                    <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map((entry, index) => (
                    <motion.tr 
                      key={entry._id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white text-sm">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-semibold text-sm">
                        {entry.weight} kg
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white text-sm hidden sm:table-cell">
                        {entry.bmi || calculateBMI(entry.weight)} 
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white max-w-xs truncate text-sm hidden md:table-cell">
                        {entry.notes || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProgress(entry._id)}
                          className="text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Delete entry"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Motivation Quote */}
        {progress.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white text-center"
          >
            <p className="text-lg font-semibold">
              "The only bad workout is the one that didn't happen."
            </p>
            <p className="text-sm opacity-90 mt-2">
              Keep going! You've made {Math.abs(weightChange)} kg progress!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProgressTracker;