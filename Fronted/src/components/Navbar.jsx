// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaDumbbell, FaUtensils, FaChartLine, FaClipboardList } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span className="text-2xl font-bold text-blue-600">🏋️ GymPro</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-4">
              <Link to="/workouts" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Workouts
              </Link>
              <Link to="/diets" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Diets
              </Link>
              <Link to="/progress" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Progress
              </Link>
              <Link to="/plans" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Plans
              </Link>
              
              {isAdmin && (
                <a href="https://localhost:5174/" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors">
                  👑 Admin <span className="ml-1 text-xs opacity-50">↗</span>
                </a>
              )}
            </div>
          </div>
          
          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/profile" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium transition-colors">
              <FaUser className="mr-2" /> Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/workouts" 
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaDumbbell className="mr-3" /> Workouts
            </Link>
            <Link 
              to="/diets" 
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUtensils className="mr-3" /> Diets
            </Link>
            <Link 
              to="/progress" 
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaChartLine className="mr-3" /> Progress
            </Link>
            <Link 
              to="/plans" 
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaClipboardList className="mr-3" /> Plans
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUser className="mr-3" /> Profile
            </Link>
            
            {isAdmin && (
              <a 
                href="https://localhost:5174/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                👑 Admin Panel <span className="ml-2 text-xs opacity-50">↗</span>
              </a>
            )}

            <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full bg-red-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 transition-colors"
              >
                <FaSignOutAlt className="mr-3" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;