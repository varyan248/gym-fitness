// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
// import { FaSun, FaMoon, FaDumbbell, FaSignOutAlt, FaUser, FaChartLine, FaCalendarAlt, FaUtensils } from 'react-icons/fa';
// import { motion } from 'framer-motion';

// const Navbar = () => {
//   const { user, logout, isAdmin } = useAuth();
//   const { darkMode, toggleDarkMode } = useTheme();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (!user) return null;

//   const userLinks = [
//     { to: '/', icon: FaChartLine, label: 'Dashboard' },
//     { to: '/workouts', icon: FaCalendarAlt, label: 'Workouts' },
//     { to: '/diets', icon: FaUtensils, label: 'Diet' },
//     { to: '/progress', icon: FaChartLine, label: 'Progress' },
//     { to: '/profile', icon: FaUser, label: 'Profile' },
//   ];

//   const adminLinks = [
//     { to: '/admin', label: 'Admin Dashboard' },
//     { to: '/admin/users', label: 'Manage Users' },
//     { to: '/admin/workouts', label: 'Manage Workouts' },
//     { to: '/admin/diets', label: 'Manage Diets' },
//   ];

//   return (
//     <nav className="bg-white dark:bg-gray-800 shadow-lg">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           <Link to="/" className="flex items-center space-x-2">
//             <FaDumbbell className="text-blue-600 text-2xl" />
//             <span className="font-bold text-xl text-gray-800 dark:text-white">FitnessApp</span>
//           </Link>

//           <div className="hidden md:flex items-center space-x-6">
//             {!isAdmin && userLinks.map((link) => (
//               <Link
//                 key={link.to}
//                 to={link.to}
//                 className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
//               >
//                 <link.icon />
//                 <span>{link.label}</span>
//               </Link>
//             ))}
            
//             {isAdmin && adminLinks.map((link) => (
//               <Link
//                 key={link.to}
//                 to={link.to}
//                 className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           <div className="flex items-center space-x-4">
//             <button
//               onClick={toggleDarkMode}
//               className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
//             >
//               {darkMode ? <FaSun /> : <FaMoon />}
//             </button>
            
//             <div className="flex items-center space-x-3">
//               <span className="text-sm text-gray-600 dark:text-gray-300">
//                 {user.name}
//               </span>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
//               >
//                 <FaSignOutAlt />
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

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
                  <a href="http://localhost:5174/" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center">
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