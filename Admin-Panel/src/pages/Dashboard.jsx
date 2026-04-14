import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUsers, FaSearch, FaUserShield, FaSignOutAlt, FaKey, FaTimes, FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { token, user, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Password Modal State
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  // Edit Plan Modal State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedUserForPlan, setSelectedUserForPlan] = useState(null);
  const [planName, setPlanName] = useState('');
  const [planDuration, setPlanDuration] = useState(0);
  const [planLoading, setPlanLoading] = useState(false);

  const openPlanModal = (userToEdit) => {
    setSelectedUserForPlan(userToEdit);
    setPlanName(userToEdit.plan !== 'None' && userToEdit.plan ? userToEdit.plan : '');
    // As we can't easily guess the duration if they just stored the text, we'll start at 0
    // so they have to input a new duration to extend/change.
    setPlanDuration(0);
    setShowPlanModal(true);
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserForPlan) return;
    setPlanLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const duration = Number(planDuration);
      const computedPlanName = duration > 0 ? (planName.trim() || `${duration} Month${duration > 1 ? 's' : ''}`) : 'None';

      const payload = { 
        plan: computedPlanName, 
        durationMonths: duration 
      };

      const response = await axios.put(`${API_URL}/admin/users/${selectedUserForPlan._id}/plan`, payload, config);
      
      if (response.data.success) {
        setUsers(users.map(u => u._id === selectedUserForPlan._id ? response.data.user : u));
        setShowPlanModal(false);
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      alert(error.response?.data?.message || 'Failed to update plan.');
    } finally {
      setPlanLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdLoading(true);
    const success = await changePassword(currentPassword, newPassword);
    setPwdLoading(false);
    if (success) {
      setShowPwdModal(false);
      setCurrentPassword('');
      setNewPassword('');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(`${API_URL}/admin/users`, config);
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you absolutely sure you want to completely delete ${userName}? This cannot be undone.`)) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.delete(`${API_URL}/admin/users/${userId}`, config);
        
        if (response.data.success) {
          // Update the state locally to remove the user instantly
          setUsers(users.filter(user => user._id !== userId));
          setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // select all except current admin
      const ids = filteredUsers.filter(u => u._id !== user?._id).map(u => u._id);
      setSelectedUsers(ids);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} selected users? This cannot be undone.`)) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.post(`${API_URL}/admin/users/bulk-delete`, { userIds: selectedUsers }, config);
        
        if (response.data.success) {
          setUsers(users.filter(u => !selectedUsers.includes(u._id)));
          setSelectedUsers([]);
        }
      } catch (error) {
        console.error('Error bulk deleting users:', error);
        alert(error.response?.data?.message || 'Failed to delete users.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
              <FaUserShield className="mr-3 text-indigo-600" /> 
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, Admin {user?.name}. Manage your application users here.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg px-6 py-4 text-center">
              <FaUsers className="mx-auto text-indigo-500 text-2xl mb-1" />
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold dark:text-white">{users.length}</p>
            </div>
            
            <button
              onClick={() => setShowPwdModal(true)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition-colors"
            >
              <FaKey />
              <span>Change Password</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition-colors"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Registered Users</h2>
              {selectedUsers.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="ml-4 flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg shadow transition"
                >
                  <FaTrash className="text-xs" />
                  <span>Delete Selected ({selectedUsers.length})</span>
                </button>
              )}
            </div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="px-6 py-4 border-b dark:border-gray-700">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.filter(u => u._id !== user?._id).length}
                        className="rounded text-indigo-600 focus:ring-indigo-500 bg-white"
                      />
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-700">Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-700">Email</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-700">Role</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-700">Goal</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-700">Plan</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-700">Plan Expiry</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-700">Joined</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          {u._id !== user?._id && (
                            <input 
                              type="checkbox"
                              checked={selectedUsers.includes(u._id)}
                              onChange={() => handleSelectUser(u._id)}
                              className="rounded text-indigo-600 focus:ring-indigo-500 bg-white"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          {u.name}
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-300">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-300">{u.goal || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isPlanActive && u.plan !== 'None' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                            {u.plan || 'None'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-300">{u.planEndDate ? new Date(u.planEndDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-300">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {u._id !== user?._id && (
                            <>
                              <button
                                onClick={() => openPlanModal(u)}
                                className="text-indigo-500 hover:text-indigo-700 transition font-medium text-sm px-3 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 rounded-md mr-2"
                              >
                                Edit Plan
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u._id, u.name)}
                                className="text-red-500 hover:text-red-700 transition font-medium text-sm px-3 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-md"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No users found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </motion.div>

      {/* Change Password Modal */}
      {showPwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
          >
            <button 
              onClick={() => setShowPwdModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <FaTimes size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <FaKey className="mr-3 text-indigo-500" /> Change Password
            </h2>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input 
                  type="password" 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter new password"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={pwdLoading}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-70 flex justify-center items-center"
              >
                {pwdLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showPlanModal && selectedUserForPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
          >
            <button 
              onClick={() => setShowPlanModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <FaTimes size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              Edit Plan
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Changing plan for: <span className="font-semibold text-gray-700 dark:text-gray-200">{selectedUserForPlan.name}</span>
            </p>
            
            <form onSubmit={handlePlanSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (Months)</label>
                <input 
                  type="number"
                  min="0"
                  required
                  value={planDuration}
                  onChange={(e) => setPlanDuration(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Set to 0 to remove the user's plan entirely.</p>
              </div>

              {Number(planDuration) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Plan Name (Optional)</label>
                  <input 
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder={`e.g. ${planDuration} Month${planDuration > 1 ? 's' : ''}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank to use default name.</p>
                </motion.div>
              )}
              
              <button 
                type="submit" 
                disabled={planLoading}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-70 flex justify-center items-center"
              >
                {planLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Update Plan"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
