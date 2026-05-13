import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load components for faster initial bundle
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const WorkoutPlanner = lazy(() => import('./pages/WorkoutPlanner'));
const DietPlanner = lazy(() => import('./pages/DietPlanner'));
const ProgressTracker = lazy(() => import('./pages/ProgressTracker'));
const Plans = lazy(() => import('./pages/Plans'));

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <Toaster position="top-right" />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                <Route path="/workouts" element={<PrivateRoute><WorkoutPlanner /></PrivateRoute>} />
                <Route path="/diets" element={<PrivateRoute><DietPlanner /></PrivateRoute>} />
                <Route path="/progress" element={<PrivateRoute><ProgressTracker /></PrivateRoute>} />
                <Route path="/plans" element={<PrivateRoute><Plans /></PrivateRoute>} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;