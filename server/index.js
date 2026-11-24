const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const Model = require('./models/Model');
const seedDatabase = require('./seed/seed');

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend Assets
app.use(express.static(path.join(__dirname, '../client')));

// REST API Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Premier Models Full Stack API',
    timestamp: new Date().toISOString()
  });
});

// Mount Modular REST API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/models', require('./routes/modelRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Serve HTML Frontend for main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database and Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is brand new / empty
    const modelCount = await Model.countDocuments();
    if (modelCount === 0) {
      console.log('🌱 Empty database detected. Auto-seeding initial models and admin credentials...');
      await seedDatabase();
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 PREMIER MODELS SERVER RUNNING ON PORT ${PORT}`);
      console.log(`🌐 Local Application URL: http://localhost:${PORT}`);
      console.log(`🌐 Alternative IP URL: http://127.0.0.1:${PORT}`);
      console.log(`📡 REST API Health Check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
  }
};

startServer();
