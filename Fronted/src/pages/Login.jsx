// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { FaDumbbell, FaEnvelope, FaLock } from "react-icons/fa";
// import { motion } from "framer-motion";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const success = await login(email, password);
//     if (success) {
//       navigate("/");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl"
//       >
//         <div>
//           <div className="flex justify-center">
//             <FaDumbbell className="h-12 w-12 text-blue-600" />
//           </div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
//             Welcome Back!
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
//             Sign in to your fitness journey
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Email Address
//               </label>
//               <div className="mt-1 relative">
//                 <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="input pl-10"
//                   placeholder="you@example.com"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Password
//               </label>
//               <div className="mt-1 relative">
//                 <FaLock className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="input pl-10"
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>
//           </div>

//           <button type="submit" className="btn-primary w-full">
//             Sign In
//           </button>
//         </form>

//         <div className="text-center">
//           <Link
//             to="/register"
//             className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
//           >
//             Don't have an account? Sign up
//           </Link>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaDumbbell, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result && result.success) {
        if(result.user?.role === 'admin') {
           navigate("/admin");
        } else {
           navigate("/");
        }
      }
    } catch (error) {
      console.error("Login submission error:", error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
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
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to your fitness journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="mt-1 relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center space-y-3">
          <Link
            to="/register"
            className="block text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Don't have an account? Sign up
          </Link>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <a
              href="https://gym-fitness-uvnr.onrender.com"
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Authorized Personnel Login
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;