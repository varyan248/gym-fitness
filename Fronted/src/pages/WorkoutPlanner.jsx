import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaDumbbell, FaInfoCircle } from 'react-icons/fa';

const WorkoutPlanner = () => {
  const { user, token } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const API_URL = import.meta.env.VITE_API_URL || 'http://gym-fitness-uvnr.onrender.com/api';

  // Default gym workouts for Monday to Saturday
  const defaultWorkouts = [
    {
      day: 'Monday',
      title: 'Chest Day',
      duration: 45,
      difficulty: 'Intermediate',
      exercises: [
        {
          name: 'Barbell Bench Press',
          sets: 4,
          reps: '8-10',
          instructions: 'Lie on bench, lower bar to chest, press up explosively'
        },
        {
          name: 'Incline Dumbbell Press',
          sets: 3,
          reps: '10-12',
          instructions: 'Set bench to 30-45°, press dumbbells from chest level'
        },
        {
          name: 'Chest Flyes',
          sets: 3,
          reps: '12-15',
          instructions: 'Slight bend in elbows, open arms wide, squeeze chest at top'
        },
        {
          name: 'Push-Ups',
          sets: 3,
          reps: '15-20',
          instructions: 'Keep body straight, lower chest to floor, push up'
        }
      ]
    },
    {
      day: 'Tuesday',
      title: 'Back Day',
      duration: 45,
      difficulty: 'Intermediate',
      exercises: [
        {
          name: 'Pull-Ups / Lat Pulldowns',
          sets: 4,
          reps: '8-10',
          instructions: 'Pull bar to upper chest, squeeze shoulder blades together'
        },
        {
          name: 'Barbell Rows',
          sets: 3,
          reps: '10-12',
          instructions: 'Bend at hips, pull bar to lower chest, squeeze back'
        },
        {
          name: 'Seated Cable Rows',
          sets: 3,
          reps: '10-12',
          instructions: 'Keep back straight, pull handle to stomach'
        },
        {
          name: 'Deadlifts',
          sets: 3,
          reps: '6-8',
          instructions: 'Keep back straight, lift with legs, drive through heels'
        }
      ]
    },
    {
      day: 'Wednesday',
      title: 'Shoulders & Traps',
      duration: 40,
      difficulty: 'Intermediate',
      exercises: [
        {
          name: 'Overhead Press',
          sets: 4,
          reps: '8-10',
          instructions: 'Press bar from shoulders to overhead, keep core tight'
        },
        {
          name: 'Lateral Raises',
          sets: 3,
          reps: '12-15',
          instructions: 'Raise dumbbells to shoulder height with slight elbow bend'
        },
        {
          name: 'Front Raises',
          sets: 3,
          reps: '12-15',
          instructions: 'Raise dumbbells straight in front to shoulder height'
        },
        {
          name: 'Barbell Shrugs',
          sets: 3,
          reps: '12-15',
          instructions: 'Hold heavy weight, shrug shoulders up toward ears'
        }
      ]
    },
    {
      day: 'Thursday',
      title: 'Leg Day',
      duration: 50,
      difficulty: 'Advanced',
      exercises: [
        {
          name: 'Barbell Squats',
          sets: 4,
          reps: '8-10',
          instructions: 'Keep chest up, go to parallel or below, drive through heels'
        },
        {
          name: 'Leg Press',
          sets: 3,
          reps: '10-12',
          instructions: 'Place feet shoulder-width, lower until knees at 90°'
        },
        {
          name: 'Romanian Deadlifts',
          sets: 3,
          reps: '10-12',
          instructions: 'Keep legs slightly bent, lower weight along shins'
        },
        {
          name: 'Leg Extensions',
          sets: 3,
          reps: '12-15',
          instructions: 'Extend legs fully, squeeze quads at top'
        },
        {
          name: 'Leg Curls',
          sets: 3,
          reps: '12-15',
          instructions: 'Curl weight toward glutes, squeeze hamstrings'
        }
      ]
    },
    {
      day: 'Friday',
      title: 'Arms (Biceps & Triceps)',
      duration: 40,
      difficulty: 'Intermediate',
      exercises: [
        {
          name: 'Barbell Curls',
          sets: 4,
          reps: '10-12',
          instructions: 'Keep elbows fixed at sides, curl bar up to shoulders'
        },
        {
          name: 'Triceps Pushdowns',
          sets: 4,
          reps: '12-15',
          instructions: 'Use cable machine, keep elbows tucked, push down'
        },
        {
          name: 'Hammer Curls',
          sets: 3,
          reps: '12-15',
          instructions: 'Palms facing each other, curl dumbbells keeping thumbs up'
        },
        {
          name: 'Overhead Triceps Extension',
          sets: 3,
          reps: '10-12',
          instructions: 'Hold dumbbell overhead, lower behind head'
        },
        {
          name: 'Concentration Curls',
          sets: 3,
          reps: '12-15',
          instructions: 'Sit on bench, curl dumbbell across body'
        },
        {
          name: 'Dips',
          sets: 3,
          reps: '10-12',
          instructions: 'Lower body until elbows at 90°, push up'
        }
      ]
    },
    {
      day: 'Saturday',
      title: 'Full Body / Cardio',
      duration: 45,
      difficulty: 'Intermediate',
      exercises: [
        {
          name: 'Burpees',
          sets: 3,
          reps: '10-12',
          instructions: 'Drop to push-up position, jump feet in, jump up'
        },
        {
          name: 'Kettlebell Swings',
          sets: 3,
          reps: '15-20',
          instructions: 'Hinge at hips, swing kettlebell to chest height'
        },
        {
          name: 'Box Jumps',
          sets: 3,
          reps: '8-10',
          instructions: 'Jump onto box, step down carefully'
        },
        {
          name: 'Mountain Climbers',
          sets: 3,
          reps: '20 each side',
          instructions: 'In plank position, alternate driving knees to chest'
        },
        {
          name: 'Plank',
          sets: 3,
          reps: '30-45 sec',
          instructions: 'Keep body straight, engage core and glutes'
        }
      ]
    }
  ];

  useEffect(() => {
    if (user && token) {
      fetchWorkouts();
    } else {
      // Use default workouts when not logged in
      setWorkouts(defaultWorkouts);
      setLoading(false);
    }
  }, [user, token]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/users/weekly-workout`, config);
      // If API returns data, use it; otherwise use defaults
      if (response.data.workouts && response.data.workouts.length > 0) {
        setWorkouts(response.data.workouts);
      } else {
        setWorkouts(defaultWorkouts);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      // Use default workouts on error
      setWorkouts(defaultWorkouts);
      setError(null); // Clear error since we have fallback
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutForDay = (day) => {
    return workouts.find(w => w.day === day);
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
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Workout Planner
        </h1>
        
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Schedule */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-600" />
                Weekly Schedule
              </h2>
              <div className="space-y-2">
                {days.map((day) => {
                  const workout = getWorkoutForDay(day);
                  const isRestDay = day === 'Sunday';
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedDay === day
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{day}</span>
                        {workout && !isRestDay ? (
                          <span className="text-sm flex items-center">
                            <FaDumbbell className="inline mr-1" />
                            {workout.duration} min
                          </span>
                        ) : isRestDay ? (
                          <span className="text-sm">Rest Day 🧘</span>
                        ) : (
                          <span className="text-sm">Workout</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Workout Details */}
          <div className="lg:col-span-2">
            {selectedDay ? (
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                {(() => {
                  const workout = getWorkoutForDay(selectedDay);
                  const isRestDay = selectedDay === 'Sunday';
                  
                  if (isRestDay) {
                    return (
                      <div className="text-center py-8">
                        <FaDumbbell className="text-6xl text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                          Sunday Rest Day! 🧘‍♀️💤
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Take a full break and recover. Your body needs rest to grow stronger and repair muscle tissue.
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-left">
                          <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                            🌟 Active Recovery Suggestions:
                          </h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• Light walking or yoga for 15-20 minutes</li>
                            <li>• Foam rolling to release muscle tension</li>
                            <li>• Stretching exercises for flexibility</li>
                            <li>• Get 7-9 hours of quality sleep</li>
                            <li>• Eat protein-rich meals for muscle repair</li>
                            <li>• Stay hydrated throughout the day</li>
                          </ul>
                        </div>
                      </div>
                    );
                  }
                  
                  if (!workout) {
                    return (
                      <div className="text-center py-8">
                        <FaDumbbell className="text-6xl text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                          No Workout Planned
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          Check back later for your workout plan.
                        </p>
                      </div>
                    );
                  }
                  
                  return (
                    <>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                          {workout.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <FaClock className="mr-1" />
                            {workout.duration} minutes
                          </span>
                          <span className="flex items-center">
                            <FaDumbbell className="mr-1" />
                            {workout.difficulty || 'Intermediate'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Exercises
                        </h3>
                        {workout.exercises && workout.exercises.map((exercise, idx) => (
                          <div key={idx} className="border-b dark:border-gray-700 pb-4 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                                {exercise.name}
                              </h4>
                              <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                {exercise.sets} sets × {exercise.reps} reps
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm flex items-start">
                              <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
                              {exercise.instructions}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                          💪 Pro Tip
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Remember to warm up for 5-10 minutes before starting and cool down afterwards. 
                          Stay hydrated throughout your workout! Listen to your body and adjust weights as needed.
                        </p>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center py-12">
                <FaCalendarAlt className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Select a Day
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a day from the calendar to view your workout plan
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkoutPlanner;