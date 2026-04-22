// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">🏋️ GymPro</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-4">
              <Link to="/workouts" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Workouts
              </Link>
              <Link to="/diets" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Diets
              </Link>
              <Link to="/progress" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Progress
              </Link>
              <Link to="/plans" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Plans
              </Link>
              
              {/* Admin Links */}
              {isAdmin && (
                <div className="relative group">
                  <a href="https://localhost:5174/" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center">
                    👑 Admin Panel <span className="ml-1 text-xs opacity-50">↗</span>
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              👤 Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;