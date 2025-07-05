// src/seeders/index.js
import dotenv from 'dotenv';
import connectDB from '../db/index.js'; // make sure this points to your DB connection
import seedAdminData from './admin.seeder.js';
import seedUserData from './user.seeder.js';

dotenv.config({ path: './.env' });

async function seedAllData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected!');

    await seedAdminData();
    await seedUserData();

    console.log('🌱 Seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err.message);
    process.exit(1);
  }
}

seedAllData();
