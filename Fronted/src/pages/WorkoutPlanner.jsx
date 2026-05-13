import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaDumbbell, 
  FaInfoCircle, 
  FaTint, 
  FaChevronRight,
  FaArrowLeft
} from 'react-icons/fa';
import SEO from '../components/SEO';

const WorkoutPlanner = () => {
  const { user, token } = useAuth();
  
  // Use caching for instant load
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('cached_workouts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(!localStorage.getItem('cached_workouts'));
  const [error, setError] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const API_URL = import.meta.env.VITE_API_URL || 'https://gym-fitness-wg3l.onrender.com/api';

  const defaultWorkouts = useMemo(() => [
    {
      day: 'Monday',
      title: 'Chest Day',
      duration: 45,
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: '8-10', instructions: 'Lie on bench, lower bar to chest, press up explosively' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', instructions: 'Set bench to 30-45°, press dumbbells from chest level' },
        { name: 'Chest Flyes', sets: 3, reps: '12-15', instructions: 'Slight bend in elbows, open arms wide, squeeze chest at top' },
        { name: 'Push-Ups', sets: 3, reps: '15-20', instructions: 'Keep body straight, lower chest to floor, push up' }
      ]
    },
    {
      day: 'Tuesday',
      title: 'Back Day',
      duration: 45,
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Pull-Ups / Lat Pulldowns', sets: 4, reps: '8-10', instructions: 'Pull bar to upper chest, squeeze shoulder blades together' },
        { name: 'Barbell Rows', sets: 3, reps: '10-12', instructions: 'Bend at hips, pull bar to lower chest, squeeze back' },
        { name: 'Seated Cable Rows', sets: 3, reps: '10-12', instructions: 'Keep back straight, pull handle to stomach' },
        { name: 'Deadlifts', sets: 3, reps: '6-8', instructions: 'Keep back straight, lift with legs, drive through heels' }
      ]
    },
    {
      day: 'Wednesday',
      title: 'Shoulders & Traps',
      duration: 40,
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Overhead Press', sets: 4, reps: '8-10', instructions: 'Press bar from shoulders to overhead, keep core tight' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', instructions: 'Raise dumbbells to shoulder height with slight elbow bend' },
        { name: 'Front Raises', sets: 3, reps: '12-15', instructions: 'Raise dumbbells straight in front to shoulder height' },
        { name: 'Barbell Shrugs', sets: 3, reps: '12-15', instructions: 'Hold heavy weight, shrug shoulders up toward ears' }
      ]
    },
    {
      day: 'Thursday',
      title: 'Leg Day',
      duration: 50,
      difficulty: 'Advanced',
      exercises: [
        { name: 'Barbell Squats', sets: 4, reps: '8-10', instructions: 'Keep chest up, go to parallel or below, drive through heels' },
        { name: 'Leg Press', sets: 3, reps: '10-12', instructions: 'Place feet shoulder-width, lower until knees at 90°' },
        { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', instructions: 'Keep legs slightly bent, lower weight along shins' },
        { name: 'Leg Extensions', sets: 3, reps: '12-15', instructions: 'Extend legs fully, squeeze quads at top' },
        { name: 'Leg Curls', sets: 3, reps: '12-15', instructions: 'Curl weight toward glutes, squeeze hamstrings' }
      ]
    },
    {
      day: 'Friday',
      title: 'Arms (Biceps & Triceps)',
      duration: 40,
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Barbell Curls', sets: 4, reps: '10-12', instructions: 'Keep elbows fixed at sides, curl bar up to shoulders' },
        { name: 'Triceps Pushdowns', sets: 4, reps: '12-15', instructions: 'Use cable machine, keep elbows tucked, push down' },
        { name: 'Hammer Curls', sets: 3, reps: '12-15', instructions: 'Palms facing each other, curl dumbbells keeping thumbs up' },
        { name: 'Overhead Triceps Extension', sets: 3, reps: '10-12', instructions: 'Hold dumbbell overhead, lower behind head' },
        { name: 'Concentration Curls', sets: 3, reps: '12-15', instructions: 'Sit on bench, curl dumbbell across body' },
        { name: 'Dips', sets: 3, reps: '10-12', instructions: 'Lower body until elbows at 90°, push up' }
      ]
    },
    {
      day: 'Saturday',
      title: 'Full Body / Cardio',
      duration: 45,
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Burpees', sets: 3, reps: '10-12', instructions: 'Drop to push-up position, jump feet in, jump up' },
        { name: 'Kettlebell Swings', sets: 3, reps: '15-20', instructions: 'Hinge at hips, swing kettlebell to chest height' },
        { name: 'Box Jumps', sets: 3, reps: '8-10', instructions: 'Jump onto box, step down carefully' },
        { name: 'Mountain Climbers', sets: 3, reps: '20 each side', instructions: 'In plank position, alternate driving knees to chest' },
        { name: 'Plank', sets: 3, reps: '30-45 sec', instructions: 'Keep body straight, engage core and glutes' }
      ]
    }
  ], []);

  useEffect(() => {
    let isMounted = true;

    const loadWorkouts = async () => {
      try {
        if (user && token) {
          const config = { headers: { 'Authorization': `Bearer ${token}` } };
          const response = await axios.get(`${API_URL}/users/weekly-workout`, config);
          if (isMounted) {
            if (response.data.success && response.data.workouts?.length > 0) {
              setWorkouts(response.data.workouts);
              localStorage.setItem('cached_workouts', JSON.stringify(response.data.workouts));
            } else {
              setWorkouts(defaultWorkouts);
            }
            setError(null);
          }
        } else if (!user) {
          if (isMounted) {
            setWorkouts(defaultWorkouts);
          }
        }
      } catch (err) {
        console.error('Error fetching workouts:', err);
        if (isMounted && workouts.length === 0) {
          setWorkouts(defaultWorkouts);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadWorkouts();
    return () => { isMounted = false; };
  }, [user, token, defaultWorkouts, API_URL]);

  const getWorkoutForDay = (day) => {
    return Array.isArray(workouts) ? workouts.find(w => w.day === day) : null;
  };

  if (loading && workouts.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-500 font-medium">Loading your plan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <SEO 
        title="Workout Planner" 
        description="Plan your weekly gym routine with GymPro. Custom chest, back, leg, and arm workouts tailored to your goals." 
        keywords="workout plan, gym routine, weightlifting, bodybuilding, fitness schedule"
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Workout <span className="text-blue-600">Planner</span>
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Track your weekly performance and stay consistent.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Day Selector Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-bold flex items-center text-gray-800 dark:text-white">
                <FaCalendarAlt className="mr-2 text-blue-600" />
                Weekly Schedule
              </h2>
            </div>
            <div className="p-2 space-y-1">
              {days.map((day) => {
                const workout = getWorkoutForDay(day);
                const isSelected = selectedDay === day;
                const isRestDay = day === 'Sunday';
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none translate-x-1' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-bold">{day}</span>
                      <span className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                        {isRestDay ? 'Rest & Recovery' : (workout?.title || 'Personal Training')}
                      </span>
                    </div>
                    <FaChevronRight className={`text-sm transition-transform ${isSelected ? 'rotate-90' : 'opacity-30'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Workout Details Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[500px]"
              >
                {(() => {
                  const workout = getWorkoutForDay(selectedDay);
                  const isRestDay = selectedDay === 'Sunday';

                  if (isRestDay) {
                    return (
                      <div className="p-12 text-center h-full flex flex-col justify-center items-center">
                        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                          <FaDumbbell className="text-4xl text-blue-600 opacity-20" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Rest & Recovery</h2>
                        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                          Today is your day to recharge. Recovery is just as important as training for muscle growth and mental health.
                        </p>
                      </div>
                    );
                  }

                  if (!workout) {
                    return (
                      <div className="p-12 text-center flex flex-col justify-center items-center h-full">
                        <FaInfoCircle className="text-5xl text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Plan in Progress</h3>
                        <p className="text-gray-500 mt-2">Your personalized workout for {selectedDay} is being generated.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="flex flex-col h-full">
                      {/* Header Banner */}
                      <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                        <div className="flex flex-wrap justify-between items-end gap-4">
                          <div>
                            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                              Daily Routine
                            </span>
                            <h2 className="text-3xl font-black">{workout.title}</h2>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center bg-white/10 p-3 rounded-2xl backdrop-blur-md min-w-[80px]">
                              <FaClock className="text-blue-200 mb-1" />
                              <span className="text-lg font-bold leading-none">{workout.duration}</span>
                              <span className="text-[10px] opacity-60 uppercase">Mins</span>
                            </div>
                            <div className="flex flex-col items-center bg-white/10 p-3 rounded-2xl backdrop-blur-md min-w-[80px]">
                              <FaTint className="text-cyan-200 mb-1" />
                              <span className="text-lg font-bold leading-none">High</span>
                              <span className="text-[10px] opacity-60 uppercase">Intensity</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Exercises List */}
                      <div className="p-8 space-y-6 flex-grow">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Exercises Plan</h3>
                        <div className="space-y-4">
                          {workout.exercises && Array.isArray(workout.exercises) ? workout.exercises.map((ex, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="group p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    {ex.name}
                                  </h4>
                                  <p className="text-sm text-gray-500 mt-1 flex items-start">
                                    <FaInfoCircle className="mt-1 mr-2 text-xs opacity-50 flex-shrink-0" />
                                    {ex.instructions}
                                  </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-xs font-black text-blue-600">
                                  {ex.sets} × {ex.reps}
                                </div>
                              </div>
                            </motion.div>
                          )) : (
                            <p className="text-gray-400 italic">No exercises found for this session.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 flex flex-col items-center justify-center text-center h-[500px]">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
                  <FaArrowLeft className="text-2xl text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Choose a Session</h3>
                <p className="text-gray-500 mt-2 max-w-xs leading-relaxed">
                  Select a day from your weekly schedule to see your personalized training routine.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanner;