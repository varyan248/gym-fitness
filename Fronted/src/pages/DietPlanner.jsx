import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FaAppleAlt, FaUtensils, FaCoffee, FaMoon, FaInfoCircle, FaWater, 
  FaCalendarAlt, FaClock, FaDumbbell, FaFire, FaCarrot, FaFish, 
  FaEgg, FaSeedling, FaCheese, FaBreadSlice 
} from 'react-icons/fa';

const DietPlanner = () => {
  const { user, token } = useAuth();
  const [dietPlan, setDietPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://gym-fitness-uvnr.onrender.com/api';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Complete weekly diet plan with gym integration
  const weeklyDietPlan = {
    Monday: {
      workout: 'Chest Day 💪',
      waterIntake: 8,
      totalCalories: 1950,
      breakfast: {
        items: ['Protein Oatmeal with berries', '2 boiled eggs', 'Black coffee'],
        calories: 450,
        instructions: 'Add whey protein to oatmeal for muscle recovery'
      },
      lunch: {
        items: ['Grilled chicken breast', 'Brown rice', 'Steamed broccoli', 'Avocado'],
        calories: 550,
        instructions: 'Season chicken with herbs and lemon'
      },
      preWorkout: {
        items: ['Banana', 'Black coffee', 'Rice cakes with honey'],
        calories: 200,
        instructions: 'Eat 1 hour before workout for energy'
      },
      postWorkout: {
        items: ['Protein shake (whey)', 'Apple'],
        calories: 250,
        instructions: 'Consume within 30 minutes after workout'
      },
      dinner: {
        items: ['Lean beef steak', 'Sweet potato', 'Asparagus', 'Mixed greens salad'],
        calories: 500,
        instructions: 'Lightly season with olive oil and herbs'
      }
    },
    Tuesday: {
      workout: 'Back Day 🔥',
      waterIntake: 9,
      totalCalories: 2000,
      breakfast: {
        items: ['Greek yogurt parfait', 'Granola', 'Mixed berries', 'Green tea'],
        calories: 420,
        instructions: 'Layer yogurt, granola, and berries'
      },
      lunch: {
        items: ['Turkey breast sandwich', 'Whole grain bread', 'Spinach', 'Tomato', 'Mustard'],
        calories: 520,
        instructions: 'Use lean turkey and load with vegetables'
      },
      preWorkout: {
        items: ['Oatmeal', '1 scoop protein powder', 'Cinnamon'],
        calories: 220,
        instructions: 'Quick digesting carbs before workout'
      },
      postWorkout: {
        items: ['Chocolate milk', 'Protein bar'],
        calories: 280,
        instructions: 'Fast absorbing protein and carbs'
      },
      dinner: {
        items: ['Baked salmon', 'Quinoa', 'Roasted Brussels sprouts', 'Lemon dill sauce'],
        calories: 560,
        instructions: 'Rich in omega-3 for joint recovery'
      }
    },
    Wednesday: {
      workout: 'Shoulders & Traps 🏋️',
      waterIntake: 8,
      totalCalories: 1850,
      breakfast: {
        items: ['Scrambled eggs with spinach', 'Whole wheat toast', 'Avocado'],
        calories: 480,
        instructions: 'Add turmeric for anti-inflammatory benefits'
      },
      lunch: {
        items: ['Chicken quinoa bowl', 'Black beans', 'Corn', 'Salsa', 'Lime'],
        calories: 530,
        instructions: 'High protein and fiber for satiety'
      },
      preWorkout: {
        items: ['Apple', 'Almond butter', 'Rice cake'],
        calories: 190,
        instructions: 'Natural sugars for sustained energy'
      },
      postWorkout: {
        items: ['Protein smoothie', 'Banana', 'Almond milk'],
        calories: 240,
        instructions: 'Blend with ice for refreshing recovery drink'
      },
      dinner: {
        items: ['Lean ground turkey chili', 'Kidney beans', 'Bell peppers', 'Greek yogurt topping'],
        calories: 410,
        instructions: 'Make a batch for multiple meals'
      }
    },
    Thursday: {
      workout: 'Leg Day 🦵🔥',
      waterIntake: 10,
      totalCalories: 2150,
      breakfast: {
        items: ['Protein pancakes', 'Sugar-free syrup', 'Turkey sausage', 'Coffee'],
        calories: 520,
        instructions: 'Use banana and egg whites in pancake mix'
      },
      lunch: {
        items: ['Tuna salad', 'Quinoa', 'Cucumber', 'Cherry tomatoes', 'Olive oil dressing'],
        calories: 540,
        instructions: 'Choose tuna in water, not oil'
      },
      preWorkout: {
        items: ['Sweet potato', 'Chicken breast (small)', 'Green tea'],
        calories: 250,
        instructions: 'Complex carbs for leg day endurance'
      },
      postWorkout: {
        items: ['Recovery shake', 'BCAA', 'Creatine', 'Dextrose'],
        calories: 320,
        instructions: 'Prioritize rapid muscle repair'
      },
      dinner: {
        items: ['Grilled shrimp', 'Brown rice pasta', 'Pesto sauce', 'Cherry tomatoes'],
        calories: 520,
        instructions: 'Light but protein-rich dinner'
      }
    },
    Friday: {
      workout: 'Arms Day 💪',
      waterIntake: 8,
      totalCalories: 1900,
      breakfast: {
        items: ['Cottage cheese bowl', 'Peaches', 'Walnuts', 'Honey drizzle'],
        calories: 440,
        instructions: 'Cottage cheese is rich in casein protein'
      },
      lunch: {
        items: ['Chicken wrap', 'Whole wheat tortilla', 'Lettuce', 'Tomato', 'Light ranch'],
        calories: 510,
        instructions: 'Add hot sauce for metabolism boost'
      },
      preWorkout: {
        items: ['Rice cakes', 'Peanut butter', 'Banana slices'],
        calories: 210,
        instructions: 'Easy to digest pre-workout fuel'
      },
      postWorkout: {
        items: ['Whey protein shake', 'Dextrose powder'],
        calories: 260,
        instructions: 'Fast absorption for muscle synthesis'
      },
      dinner: {
        items: ['Lean pork tenderloin', 'Roasted vegetables', 'Quinoa pilaf'],
        calories: 480,
        instructions: 'Pork is an underrated lean protein'
      }
    },
    Saturday: {
      workout: 'Full Body / Cardio 🏃',
      waterIntake: 9,
      totalCalories: 1950,
      breakfast: {
        items: ['Veggie omelette', '3 egg whites + 1 whole egg', 'Mushrooms', 'Onions', 'Spinach'],
        calories: 460,
        instructions: 'Load with colorful vegetables'
      },
      lunch: {
        items: ['Sushi bowl', 'Brown rice', 'Canned tuna', 'Cucumber', 'Avocado', 'Nori strips'],
        calories: 530,
        instructions: 'Homemade version saves calories'
      },
      preWorkout: {
        items: ['Energy gel', 'Coconut water', 'Dates'],
        calories: 230,
        instructions: 'Quick energy for cardio session'
      },
      postWorkout: {
        items: ['Egg white omelette', 'Sweet potato'],
        calories: 280,
        instructions: 'Lean protein with complex carbs'
      },
      dinner: {
        items: ['Grilled cod', 'Cauliflower rice', 'Roasted zucchini', 'Lemon butter sauce'],
        calories: 450,
        instructions: 'Light dinner before rest day'
      }
    },
    Sunday: {
      workout: 'Rest Day 🧘',
      waterIntake: 8,
      totalCalories: 1750,
      breakfast: {
        items: ['Overnight oats', 'Chia seeds', 'Almond milk', 'Blueberries', 'Maple syrup'],
        calories: 420,
        instructions: 'Prepare night before for easy morning'
      },
      lunch: {
        items: ['Mediterranean bowl', 'Falafel', 'Hummus', 'Tabbouleh', 'Feta cheese'],
        calories: 510,
        instructions: 'Plant-based protein focus'
      },
      snacks: {
        items: ['Fresh fruit salad', 'Handful of almonds', 'Herbal tea'],
        calories: 220,
        instructions: 'Light snacks on rest day'
      },
      dinner: {
        items: ['Vegetable stir-fry', 'Tofu', 'Brown rice', 'Ginger soy sauce'],
        calories: 400,
        instructions: 'Give digestive system a break with plant-based meal'
      }
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchDietPlan();
    } else {
      // Use weekly diet plan when not logged in
      setDietPlan(weeklyDietPlan[selectedDay]);
      setLoading(false);
    }
  }, [user, token, selectedDay]);

  const fetchDietPlan = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/users/diet-plan`, config);
      setDietPlan(response.data.diet);
      setError(null);
    } catch (error) {
      console.error('Error fetching diet plan:', error);
      setError(error.response?.data?.message || 'Failed to load diet plan');
      
      // Use weekly diet plan as fallback
      setDietPlan(weeklyDietPlan[selectedDay]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDayPlan = () => {
    return weeklyDietPlan[selectedDay];
  };

  const meals = [
    { key: 'breakfast', icon: FaCoffee, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', time: '7:00 - 9:00 AM', label: 'Breakfast' },
    { key: 'lunch', icon: FaUtensils, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', time: '12:00 - 1:00 PM', label: 'Lunch' },
    { key: 'preWorkout', icon: FaDumbbell, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', time: '1 hour before workout', label: 'Pre-Workout' },
    { key: 'postWorkout', icon: FaFire, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', time: 'Within 30 min after', label: 'Post-Workout' },
    { key: 'dinner', icon: FaMoon, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', time: '7:00 - 8:00 PM', label: 'Dinner' },
    { key: 'snacks', icon: FaAppleAlt, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', time: '3:00 - 4:00 PM', label: 'Snacks' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentPlan = getCurrentDayPlan();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Diet & Nutrition Planner
        </h1>

        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Day Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-600" />
                Weekly Schedule
              </h2>
              <div className="space-y-2">
                {days.map((day) => {
                  const plan = weeklyDietPlan[day];
                  const isSelected = selectedDay === day;
                  const isRestDay = day === 'Sunday';
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold">{day}</span>
                          <p className="text-xs opacity-80">{plan?.workout}</p>
                        </div>
                        {!isRestDay && (
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            {plan?.totalCalories} cal
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Macro Tips */}
              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">💡 Daily Macros</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Protein:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">30-35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Carbs:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">40-45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fats:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">20-25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diet Plan Details */}
          <div className="lg:col-span-3">
            {/* Workout & Water Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold mb-2 flex items-center">
                    <FaDumbbell className="mr-2" />
                    Today's Workout: {currentPlan?.workout}
                  </h2>
                  <p className="text-sm opacity-90">Fuel your body for optimal performance</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <FaWater className="mr-2 text-cyan-200" />
                    <span className="text-lg font-bold">{currentPlan?.waterIntake} glasses</span>
                  </div>
                  <p className="text-xs opacity-80">Daily water goal</p>
                </div>
              </div>
            </div>

            {/* Total Calories Card */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg p-4 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaFire className="text-2xl mr-3" />
                  <div>
                    <p className="text-sm opacity-90">Total Daily Calories</p>
                    <p className="text-2xl font-bold">{currentPlan?.totalCalories} kcal</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Meals: 5-6 per day</p>
                  <p className="text-sm opacity-90">Eat every 3-4 hours</p>
                </div>
              </div>
            </div>

            {/* Meals */}
            {meals.map((meal) => {
              const mealData = currentPlan?.[meal.key];
              if (!mealData) return null;
              
              const Icon = meal.icon;
              return (
                <motion.div
                  key={meal.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-4 ${meal.bg}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Icon className={`text-2xl ${meal.color} mr-3`} />
                      <div>
                        <h2 className="text-xl font-bold capitalize text-gray-900 dark:text-white">
                          {meal.label}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{meal.time}</p>
                      </div>
                    </div>
                    {mealData.calories > 0 && (
                      <span className="text-sm bg-white dark:bg-gray-700 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300">
                        {mealData.calories} kcal
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {mealData.items && mealData.items.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
                          <FaUtensils className="mr-2 text-sm" />
                          Food Items:
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                          {mealData.items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {mealData.instructions && (
                      <div className="mt-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-sm flex items-start text-gray-700 dark:text-gray-300">
                          <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                          {mealData.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Nutrition Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-4">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                💡 Nutrition Tips for {selectedDay}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="text-green-500 text-xl">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Time Your Meals
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Eat pre-workout meal 1-2 hours before training
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-500 text-xl">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Post-Workout Window
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Consume protein within 30 minutes after workout
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-500 text-xl">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Stay Hydrated
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drink water throughout the day, especially during workouts
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-500 text-xl">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Whole Foods First
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Prioritize nutrient-dense whole foods over supplements
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DietPlanner;