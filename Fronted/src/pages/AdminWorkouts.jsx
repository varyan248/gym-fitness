import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaDumbbell } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState({
    day: 'Monday',
    goal: 'All',
    title: '',
    duration: '',
    difficulty: 'Beginner',
    exercises: [{ name: '', sets: '', reps: '', instructions: '' }],
  });
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const goals = ['Weight Loss', 'Muscle Gain', 'Stay Fit', 'All'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/workouts`);
      setWorkouts(response.data.workouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises[index][field] = value;
    setFormData({ ...formData, exercises: updatedExercises });
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: '', reps: '', instructions: '' }],
    });
  };

  const removeExercise = (index) => {
    const updatedExercises = formData.exercises.filter((_, i) => i !== index);
    setFormData({ ...formData, exercises: updatedExercises });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorkout) {
        await axios.put(`${process.env.REACT_APP_API_URL}/workouts/${editingWorkout}`, formData);
        toast.success('Workout updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/workouts`, formData);
        toast.success('Workout created successfully');
      }
      resetForm();
      fetchWorkouts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save workout');
    }
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout._id);
    setFormData({
      day: workout.day,
      goal: workout.goal,
      title: workout.title,
      duration: workout.duration,
      difficulty: workout.difficulty,
      exercises: workout.exercises.map(ex => ({ ...ex })),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/workouts/${id}`);
        toast.success('Workout deleted successfully');
        fetchWorkouts();
      } catch (error) {
        toast.error('Failed to delete workout');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      day: 'Monday',
      goal: 'All',
      title: '',
      duration: '',
      difficulty: 'Beginner',
      exercises: [{ name: '', sets: '', reps: '', instructions: '' }],
    });
    setEditingWorkout(null);
    setShowForm(false);
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
          <h1 className="text-3xl font-bold">Manage Workouts</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Workout
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card mb-8"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingWorkout ? 'Edit Workout' : 'Create New Workout'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Day</label>
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Goal</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    {goals.map(goal => (
                      <option key={goal} value={goal}>{goal}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input"
                    required
                    placeholder="Full Body Workout"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="input"
                    required
                    placeholder="45"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    {difficulties.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Exercises Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium">Exercises</label>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Exercise
                  </button>
                </div>
                {formData.exercises.map((exercise, idx) => (
                  <div key={idx} className="border dark:border-gray-700 rounded-lg p-4 mb-3">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold">Exercise {idx + 1}</h4>
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => removeExercise(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Exercise Name"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                        className="input"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Sets"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                          className="input"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Reps (e.g., 10-12)"
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                          className="input"
                          required
                        />
                      </div>
                      <textarea
                        placeholder="Instructions"
                        value={exercise.instructions}
                        onChange={(e) => handleExerciseChange(idx, 'instructions', e.target.value)}
                        className="input col-span-2"
                        rows="2"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  <FaSave className="inline mr-2" />
                  {editingWorkout ? 'Update Workout' : 'Create Workout'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  <FaTimes className="inline mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Workouts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workouts.map((workout) => (
            <motion.div
              key={workout._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{workout.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {workout.day} • {workout.duration} min • {workout.difficulty}
                  </p>
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    {workout.goal}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(workout)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(workout._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold">Exercises:</p>
                {workout.exercises.map((ex, idx) => (
                  <div key={idx} className="text-sm pl-3 border-l-2 border-blue-500">
                    <p className="font-medium">{ex.name}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {ex.sets} sets × {ex.reps} reps
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {workouts.length === 0 && (
          <p className="text-center text-gray-500 py-8">No workouts created yet</p>
        )}
      </motion.div>
    </div>
  );
};

export default AdminWorkouts;