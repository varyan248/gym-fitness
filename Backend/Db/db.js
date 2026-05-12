const mongoose = require('mongoose');

const connectDb = async (retryCount = 3) => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ Error: MONGO_URI is not defined in environment variables.');
      process.exit(1);
    }

    // Mask URI for logging
    const maskedUri = process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@');
    console.log(`🔄 Connecting to MongoDB... (Target: ${maskedUri})`);
    
    const options = {
      serverSelectionTimeoutMS: 10000, // Increased timeout to 10s
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error(`- Message: ${error.message}`);
    
    if (retryCount > 0) {
      console.log(`⏳ Retrying in 5 seconds... (${retryCount} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDb(retryCount - 1);
    }

    console.error('\n🚩 PERSISTENT ERROR DETECTED');
    console.error('--------------------------------------------------');
    if (error.message.includes('ETIMEDOUT') || error.message.includes('selection timed out') || error.message.includes('ENOTFOUND')) {
      console.error('👉 Suggestion 1: Check your IP Whitelist in MongoDB Atlas.');
      console.error('   Action: Go to Atlas -> Network Access -> Add IP Address -> "Allow Access From Anywhere" (0.0.0.0/0).');
      console.error('👉 Suggestion 2: Check your internet connection or firewall settings.');
    } else if (error.message.includes('Authentication failed') || error.code === 8000) {
      console.error('👉 Suggestion: Double check your MongoDB username and password in .env.');
    } else {
      console.error('👉 Suggestion: Verify your MONGO_URI format in .env.');
    }
    console.error('--------------------------------------------------\n');
    
    process.exit(1);
  }
};

module.exports = connectDb;