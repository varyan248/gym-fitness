import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import WorkoutPlanner from './pages/WorkoutPlanner';
import DietPlanner from './pages/DietPlanner';
import ProgressTracker from './pages/ProgressTracker';
import Plans from './pages/Plans';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <Toaster position="top-right" />
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
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;