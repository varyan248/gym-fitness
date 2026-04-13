import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FaWeight, FaChartLine, FaCalendarAlt, FaPlus, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
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
  const [usingDemoMode, setUsingDemoMode] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (user && token) {
      fetchProgress();
    } else {
      setLoading(false);
      if (!user) {
        setError('Please log in to track your progress');
      }
    }
  }, [user, token]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if token exists
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      try {
        const [progressRes, statsRes] = await Promise.all([
          axios.get(`${API_URL}/progress`, config),
          axios.get(`${API_URL}/progress/stats`, config),
        ]);
        setProgress(progressRes.data.progress || []);
        setStats(statsRes.data.stats);
        setUsingDemoMode(false);
        setError(null);
      } catch (err) {
        // Handle 401 Unauthorized
        if (err.response?.status === 401) {
          console.warn('Authentication failed - using demo mode');
          setUsingDemoMode(true);
          setError('Demo Mode: Backend authentication failed. Your progress is saved locally for preview.');
          loadDemoData();
        } 
        // Handle 404 Not Found
        else if (err.response?.status === 404) {
          console.log('Progress endpoints not implemented yet, using demo data');
          setUsingDemoMode(true);
          setError('Demo Mode: Progress tracking backend not available. Using local demo data.');
          loadDemoData();
        } else {
          throw err;
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      setError(error.message || 'Failed to load progress data');
      setUsingDemoMode(true);
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    // Load from localStorage if available
    const savedProgress = localStorage.getItem('demoProgress');
    const savedStats = localStorage.getItem('demoStats');
    
    if (savedProgress && savedStats) {
      setProgress(JSON.parse(savedProgress));
      setStats(JSON.parse(savedStats));
    } else {
      const sampleProgress = [
        { _id: '1', date: new Date(Date.now() - 30*24*60*60*1000).toISOString(), weight: 75, bmi: 24.5, notes: 'Starting point' },
        { _id: '2', date: new Date(Date.now() - 20*24*60*60*1000).toISOString(), weight: 73.5, bmi: 24.0, notes: 'Feeling good' },
        { _id: '3', date: new Date(Date.now() - 10*24*60*60*1000).toISOString(), weight: 72, bmi: 23.5, notes: 'Making progress' },
        { _id: '4', date: new Date().toISOString(), weight: 70.5, bmi: 23.0, notes: 'Great workout today!' },
      ];
      setProgress(sampleProgress);
      setStats({
        startWeight: 75,
        currentWeight: 70.5,
        totalLost: 4.5
      });
      
      // Save to localStorage
      localStorage.setItem('demoProgress', JSON.stringify(sampleProgress));
      localStorage.setItem('demoStats', JSON.stringify({
        startWeight: 75,
        currentWeight: 70.5,
        totalLost: 4.5
      }));
    }
  };

  const saveDemoDataToLocal = (updatedProgress, updatedStats) => {
    localStorage.setItem('demoProgress', JSON.stringify(updatedProgress));
    localStorage.setItem('demoStats', JSON.stringify(updatedStats));
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    
    if (!newEntry.weight) {
      toast.error('Please enter your weight');
      return;
    }
    
    const weightValue = parseFloat(newEntry.weight);
    
    if (usingDemoMode) {
      // Demo mode - save locally
      const newDemoEntry = {
        _id: Date.now().toString(),
        date: new Date().toISOString(),
        weight: weightValue,
        bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : null,
        bmi: calculateBMI(weightValue),
        notes: newEntry.notes || '',
      };
      
      const updatedProgress = [newDemoEntry, ...progress];
      setProgress(updatedProgress);
      
      // Update stats
      const weights = updatedProgress.map(p => p.weight);
      const startWeight = weights[weights.length - 1]; // Oldest entry
      const currentWeight = weights[0]; // Newest entry
      const totalLost = startWeight - currentWeight;
      
      const updatedStats = {
        startWeight: startWeight,
        currentWeight: currentWeight,
        totalLost: totalLost
      };
      setStats(updatedStats);
      
      // Save to localStorage
      saveDemoDataToLocal(updatedProgress, updatedStats);
      
      toast.success('Progress entry added! (Demo Mode)');
      setNewEntry({ weight: '', bodyFat: '', notes: '' });
      setShowAddForm(false);
    } else {
      // Real API mode
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };
        
        const response = await axios.post(`${API_URL}/progress`, {
          weight: weightValue,
          bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : undefined,
          notes: newEntry.notes,
          date: new Date().toISOString()
        }, config);
        
        if (response.data.success || response.data.progress) {
          toast.success('Progress entry added!');
          setNewEntry({ weight: '', bodyFat: '', notes: '' });
          setShowAddForm(false);
          fetchProgress(); // Refresh the list
        }
      } catch (error) {
        console.error('Error adding progress:', error);
        
        if (error.response?.status === 401) {
          toast.error('Session expired. Switching to demo mode.');
          setUsingDemoMode(true);
          // Retry in demo mode
          handleAddProgress(e);
        } else {
          toast.error(error.response?.data?.message || 'Failed to add entry');
        }
      }
    }
  };

  const calculateBMI = (weight, height = 1.75) => {
    // Default height 1.75m if not provided
    return parseFloat((weight / (height * height)).toFixed(1));
  };

  const handleDeleteProgress = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      if (usingDemoMode) {
        // Demo mode - delete locally
        const updatedProgress = progress.filter(entry => entry._id !== id);
        setProgress(updatedProgress);
        
        // Update stats
        if (updatedProgress.length > 0) {
          const weights = updatedProgress.map(p => p.weight);
          const startWeight = weights[weights.length - 1];
          const currentWeight = weights[0];
          const totalLost = startWeight - currentWeight;
          
          const updatedStats = {
            startWeight: startWeight,
            currentWeight: currentWeight,
            totalLost: totalLost
          };
          setStats(updatedStats);
          saveDemoDataToLocal(updatedProgress, updatedStats);
        } else {
          setStats(null);
          localStorage.removeItem('demoProgress');
          localStorage.removeItem('demoStats');
        }
        
        toast.success('Entry deleted (Demo Mode)');
      } else {
        // Real API mode
        try {
          const config = {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          };
          
          await axios.delete(`${API_URL}/progress/${id}`, config);
          toast.success('Entry deleted');
          fetchProgress();
        } catch (error) {
          console.error('Error deleting progress:', error);
          
          if (error.response?.status === 401) {
            toast.error('Session expired. Switching to demo mode.');
            setUsingDemoMode(true);
            handleDeleteProgress(id);
          } else {
            toast.error('Failed to delete entry');
          }
        }
      }
    }
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
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center py-12">
          <FaWeight className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Please Log In
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to track your fitness progress and see your journey
          </p>
        </div>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Progress Tracker
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Entry
          </button>
        </div>

        {/* Demo Mode Warning */}
        {usingDemoMode && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 flex items-start">
            <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Demo Mode Active</p>
              <p className="text-sm">{error || 'Using local demo data. Your progress is saved in your browser.'}</p>
              <p className="text-xs mt-1">To enable full functionality, please ensure the backend server is running and you are logged in.</p>
            </div>
          </div>
        )}

        {error && !usingDemoMode && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

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
            <p className="text-center text-gray-500 py-8">
              No progress entries yet. Click "Add Entry" to start tracking your journey!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Weight (kg)</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">BMI</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Notes</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Actions</th>
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
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-semibold">
                        {entry.weight} kg
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {entry.bmi || calculateBMI(entry.weight)} 
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white max-w-xs truncate">
                        {entry.notes || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteProgress(entry._id)}
                          className="text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Delete entry"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProgressTracker;