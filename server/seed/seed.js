const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Model = require('../models/Model');
const Blog = require('../models/Blog');
const Booking = require('../models/Booking');
const seedData = require('./seedData');

const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    console.log('🧹 Clearing existing collections...');
    await User.deleteMany();
    await Model.deleteMany();
    await Blog.deleteMany();
    await Booking.deleteMany();

    console.log('👤 Seeding Users (Admin & Client)...');
    await User.create([seedData.admin, seedData.client]);

    console.log(`👗 Seeding ${seedData.models.length} Models (Letters A-Z)...`);
    await Model.insertMany(seedData.models);

    console.log(`📰 Seeding ${seedData.blogs.length} Editorial Blog Posts...`);
    await Blog.insertMany(seedData.blogs);

    console.log(`📅 Seeding ${seedData.bookings.length} Sample Casting Inquiries...`);
    await Booking.insertMany(seedData.bookings);

    console.log('🎉 ==============================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('🔑 Admin Account: admin@premiermodels.com / Admin@123');
    console.log('🔑 Client Account: casting@vogue.com / Client@123');
    console.log('🎉 ==============================================');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
