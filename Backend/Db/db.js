const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ Error: MONGO_URI is not defined in environment variables.');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB...');
    
    // Set connection options for better stability
    const options = {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error Details:');
    console.error(`- Message: ${error.message}`);
    console.error(`- Code: ${error.code}`);
    
    if (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED')) {
      console.error('👉 Suggestion: Check if your IP is whitelisted (0.0.0.0/0) in MongoDB Atlas.');
    } else if (error.message.includes('Authentication failed') || error.code === 8000) {
      console.error('👉 Suggestion: Double check your MongoDB username and password.');
    }
    
    process.exit(1);
  }
};

module.exports = connectDb;