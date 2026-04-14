import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaStar, FaBolt, FaCrown, FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Plans = () => {
  const { user, token, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const plans = [
    {
      name: '1 Month',
      price: '1500',
      duration: '1 Month',
      icon: <FaStar className="text-4xl text-blue-500 mb-4" />,
      features: ['Access to gym equipment', 'Locker access', '1 Personal Training session'],
      color: 'from-blue-400 to-blue-600',
    },
    {
      name: '6 Months',
      price: '4000',
      duration: '6 Months',
      icon: <FaBolt className="text-4xl text-purple-500 mb-4" />,
      features: ['Access to gym equipment', 'Locker access', '5 Personal Training sessions', 'Diet plan consultation'],
      color: 'from-purple-400 to-purple-600',
      popular: true,
    },
    {
      name: '1 Year',
      price: '6000',
      duration: '1 Year',
      icon: <FaCrown className="text-4xl text-yellow-500 mb-4" />,
      features: ['Access to gym equipment', 'Locker access', '12 Personal Training sessions', 'Diet plan consultation', 'Free merchandise'],
      color: 'from-yellow-400 to-yellow-600',
    },
  ];

  const handleInitiateBuy = (plan) => {
    if (!token) {
      toast.error('Please login to buy a plan');
      navigate('/login');
      return;
    }
    setSelectedPlan(plan);
    setPaymentMethod('');
    setShowModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (paymentMethod === 'Credit/Debit Card') {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error('Please fill in all card details');
        return;
      }
    } else if (paymentMethod === 'UPI (GPay, PhonePe, Paytm)') {
      if (!upiId) {
        toast.error('Please enter your UPI ID');
        return;
      }
    }

    setProcessing(true);

    // Simulate payment gateway delay
    setTimeout(async () => {
      try {
        const response = await axios.post(
          `${API_URL}/users/buy-plan`,
          { plan: selectedPlan.name },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success && response.data.user) {
          updateUser(response.data.user);
          toast.success(`Your plan successfully buy! Subscribed to ${selectedPlan.name} plan.`);
          setShowModal(false);
        }
      } catch (error) {
        console.error('Error buying plan:', error);
        toast.error(error.response?.data?.message || 'Failed to purchase plan');
      } finally {
        setProcessing(false);
      }
    }, 2000); // 2 second delay to simulate payment processing
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Choose Your Membership Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Select the plan that best fits your fitness journey.
          </p>
          
          {user?.isPlanActive && (
            <div className="mt-6 inline-block bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded">
              <p className="font-bold">Active Subscription: {user.plan}</p>
              <p className="text-sm">Valid until: {new Date(user.planEndDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`relative flex flex-col rounded-2xl border shadow-xl bg-white dark:bg-gray-800 p-8 ${plan.popular ? 'border-purple-500 transform scale-105' : 'border-gray-200 dark:border-gray-700'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex justify-center">{plan.icon}</div>
                <h3 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="mt-4 flex items-baseline justify-center text-5xl font-extrabold text-gray-900 dark:text-white">
                  {plan.price}
                </p>
                <p className="mt-1 text-xl text-center text-gray-500 dark:text-gray-400">
                  for {plan.duration}
                </p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <FaCheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                        {feature}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleInitiateBuy(plan)}
                  disabled={loading || processing || (user?.isPlanActive && user?.plan === plan.name)}
                  className={`w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {user?.isPlanActive && user?.plan === plan.name ? 'Current Plan' : 'Subscribe Now'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <AnimatePresence>
        {showModal && selectedPlan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Secure Checkout</h3>
                  <p className="text-sm opacity-80">Powered by PaymentGateway</p>
                </div>
                <button 
                  onClick={() => !processing && setShowModal(false)}
                  disabled={processing}
                  className="text-white hover:text-gray-200 transition disabled:opacity-50"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-end mb-6 pb-6 border-b dark:border-gray-700">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Plan</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedPlan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Amount</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{selectedPlan.price}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Select Payment Method</p>
                  
                  <div className="mb-3">
                    <label className={`cursor-pointer flex items-center p-4 border rounded-xl transition ${paymentMethod === 'Credit/Debit Card' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                      <input 
                        type="radio" 
                        name="payment_method" 
                        value="Credit/Debit Card"
                        checked={paymentMethod === 'Credit/Debit Card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500 w-5 h-5"
                      />
                      <FaCreditCard className="mx-4 text-gray-500 text-xl" />
                      <span className="font-medium text-gray-900 dark:text-white">Credit / Debit Card</span>
                    </label>

                    <AnimatePresence>
                      {paymentMethod === 'Credit/Debit Card' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden px-2 mt-2 space-y-3"
                        >
                          <input 
                            type="text" 
                            placeholder="Card Number" 
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                          <input 
                            type="text" 
                            placeholder="Name on Card" 
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                          <div className="flex space-x-3">
                            <input 
                              type="text" 
                              placeholder="MM/YY" 
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <input 
                              type="text" 
                              placeholder="CVV" 
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mb-3">
                    <label className={`cursor-pointer flex items-center p-4 border rounded-xl transition ${paymentMethod === 'UPI (GPay, PhonePe, Paytm)' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                      <input 
                        type="radio" 
                        name="payment_method" 
                        value="UPI (GPay, PhonePe, Paytm)"
                        checked={paymentMethod === 'UPI (GPay, PhonePe, Paytm)'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500 w-5 h-5"
                      />
                      <FaMobileAlt className="mx-4 text-gray-500 text-xl" />
                      <span className="font-medium text-gray-900 dark:text-white">UPI (GPay, PhonePe, Paytm)</span>
                    </label>

                    <AnimatePresence>
                      {paymentMethod === 'UPI (GPay, PhonePe, Paytm)' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden px-2 mt-2"
                        >
                          <input 
                            type="text" 
                            placeholder="Enter UPI ID (e.g. user@okicici)" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mb-3">
                    <label className={`cursor-pointer flex items-center p-4 border rounded-xl transition ${paymentMethod === 'Cash on Facility' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                      <input 
                        type="radio" 
                        name="payment_method" 
                        value="Cash on Facility"
                        checked={paymentMethod === 'Cash on Facility'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500 w-5 h-5"
                      />
                      <FaMoneyBillWave className="mx-4 text-gray-500 text-xl" />
                      <span className="font-medium text-gray-900 dark:text-white">Cash on Facility</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  disabled={processing}
                  className="w-full flex items-center justify-center px-5 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg disabled:opacity-70 transition"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing Payment...
                    </>
                  ) : (
                    `Pay ${selectedPlan.price}`
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Plans;
