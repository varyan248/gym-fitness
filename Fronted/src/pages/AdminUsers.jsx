import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaSearch, FaUserPlus, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/users`);
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (userId, updatedData) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/admin/users/${userId}`, updatedData);
      if (response.data.success) {
        toast.success('User updated successfully');
        fetchUsers();
        setEditingUser(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/admin/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const getGoalColor = (goal) => {
    switch(goal) {
      case 'Weight Loss': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'Muscle Gain': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <button className="btn-primary flex items-center">
            <FaUserPlus className="mr-2" />
            Add User
          </button>
        </div>

        {/* Search Bar */}
        <div className="card mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Age</th>
                  <th className="text-left py-3 px-4">Weight</th>
                  <th className="text-left py-3 px-4">Goal</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    {editingUser === user._id ? (
                      <>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            defaultValue={user.name}
                            className="input text-sm"
                            id={`name-${user._id}`}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="email"
                            defaultValue={user.email}
                            className="input text-sm"
                            id={`email-${user._id}`}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            defaultValue={user.age}
                            className="input text-sm w-20"
                            id={`age-${user._id}`}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            defaultValue={user.weight}
                            className="input text-sm w-20"
                            id={`weight-${user._id}`}
                            step="0.1"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <select
                            defaultValue={user.goal}
                            className="input text-sm"
                            id={`goal-${user._id}`}
                          >
                            <option value="Weight Loss">Weight Loss</option>
                            <option value="Muscle Gain">Muscle Gain</option>
                            <option value="Stay Fit">Stay Fit</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            defaultValue={user.isActive ? 'active' : 'inactive'}
                            className="input text-sm"
                            id={`status-${user._id}`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                const name = document.getElementById(`name-${user._id}`).value;
                                const email = document.getElementById(`email-${user._id}`).value;
                                const age = document.getElementById(`age-${user._id}`).value;
                                const weight = document.getElementById(`weight-${user._id}`).value;
                                const goal = document.getElementById(`goal-${user._id}`).value;
                                const status = document.getElementById(`status-${user._id}`).value;
                                
                                handleEditUser(user._id, {
                                  name,
                                  email,
                                  age: parseInt(age),
                                  weight: parseFloat(weight),
                                  goal,
                                  isActive: status === 'active',
                                });
                              }}
                              className="text-green-500 hover:text-green-700"
                            >
                              <FaSave />
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 font-medium">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.age || '-'}</td>
                        <td className="py-3 px-4">{user.weight ? `${user.weight} kg` : '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getGoalColor(user.goal)}`}>
                            {user.goal}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.isActive 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30' 
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingUser(user._id)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 py-8">No users found</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminUsers;