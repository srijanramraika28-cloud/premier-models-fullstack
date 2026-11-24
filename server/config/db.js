const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  // If already connected, return existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    let mongoURI = process.env.MONGODB_URI;

    // If no external MongoDB URI is provided, use mongodb-memory-server for zero-config local testing
    if (!mongoURI) {
      if (!mongod) {
        console.log('⚡ No MONGODB_URI provided in .env. Initializing in-memory MongoDB for local development...');
        try {
          const { MongoMemoryServer } = require('mongodb-memory-server');
          mongod = await MongoMemoryServer.create();
          mongoURI = mongod.getUri();
          console.log('✨ In-Memory MongoDB running successfully at:', mongoURI);
        } catch (memErr) {
          console.warn('⚠️ Could not start mongodb-memory-server. Trying local mongodb://localhost:27017/premiermodels', memErr.message);
          mongoURI = 'mongodb://localhost:27017/premiermodels';
        }
      } else {
        mongoURI = mongod.getUri();
      }
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
