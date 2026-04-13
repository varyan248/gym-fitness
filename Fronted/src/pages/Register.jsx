import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaDumbbell, FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaRuler, FaWeight, FaBullseye } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    height: '',
    weight: '',
    goal: 'Stay Fit',
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      navigate('/');
    }
    console.log('Registration form submitted with data:', formData); // Debug log
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl"
      >
        <div>
          <div className="flex justify-center">
            <FaDumbbell className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Start your fitness journey today
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <div className="mt-1 relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input pl-10"
                placeholder="John Doe"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="mt-1 relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="mt-1 relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input pl-10"
                placeholder="Enter Your Password"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Age
              </label>
              <div className="mt-1 relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="25"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Height (cm)
              </label>
              <div className="mt-1 relative">
                <FaRuler className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="175"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Weight (kg)
              </label>
              <div className="mt-1 relative">
                <FaWeight className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="70"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Goal
              </label>
              <div className="mt-1 relative">
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
            className="btn-primary w-full"
          >
            Create Account
          </button>

        </form>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

