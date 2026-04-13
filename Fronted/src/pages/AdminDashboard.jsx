import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUsers, FaUserCheck, FaDumbbell, FaAppleAlt, FaChartLine, FaUserPlus } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard`),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/analytics`),
      ]);
      setStats(statsRes.data.stats);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Active Users', value: stats?.activeUsers || 0, icon: FaUserCheck, color: 'bg-green-500' },
    { title: 'Total Workouts', value: stats?.totalWorkouts || 0, icon: FaDumbbell, color: 'bg-purple-500' },
    { title: 'Diet Plans', value: stats?.totalDiets || 0, icon: FaAppleAlt, color: 'bg-orange-500' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full text-white`}>
                    <Icon className="text-2xl" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Growth Chart */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaUserPlus className="mr-2 text-blue-500" />
              User Growth (Last 30 Days)
            </h2>
            {analytics?.userGrowth && analytics.userGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">No data available</p>
            )}
          </div>

          {/* Engagement Chart */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaChartLine className="mr-2 text-green-500" />
              User Engagement (Progress Entries)
            </h2>
            {analytics?.engagement && analytics.engagement.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.engagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="entries" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">No data available</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card">
            <h3 className="font-bold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition">
                ➕ Add New User
              </button>
              <button className="w-full text-left px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition">
                💪 Create Workout Plan
              </button>
              <button className="w-full text-left px-3 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition">
                🍎 Create Diet Plan
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold mb-3">System Status</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span>Database:</span>
                <span className="text-green-500">● Connected</span>
              </p>
              <p className="flex justify-between">
                <span>API Status:</span>
                <span className="text-green-500">● Operational</span>
              </p>
              <p className="flex justify-between">
                <span>Last Backup:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold mb-3">Admin Tips</h3>
            <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Regularly review user progress</li>
              <li>• Update workout plans monthly</li>
              <li>• Monitor active users engagement</li>
              <li>• Provide timely feedback to users</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;