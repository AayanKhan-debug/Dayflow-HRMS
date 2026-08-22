const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dayflow';
    
    // Attempt connecting to configured MongoDB instance with a short timeout
    mongoose.set('strictQuery', false);
    
    try {
      const conn = await mongoose.connect(connStr, {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`[MongoDB] Connected to MongoDB host: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn('[MongoDB] Standard connection failed. Initializing MongoMemoryServer fallback for demo...');
    }

    // Fallback: MongoMemoryServer for zero-config demo execution
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected to In-Memory MongoDB at ${mongoUri}`);
  } catch (error) {
    console.error(`[MongoDB Error] Failed to connect: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
