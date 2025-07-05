// src/seeders/admin.seeder.js
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

const seedAdminData = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin', email: 'admin@example.com' });

    if (existingAdmin) {
      console.log('🛑 Admin already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const admin = new User({
      firstName: 'Super',
      lastName: 'Admin',
      userName: 'superadmin',
      email: 'admin@example.com',
      phoneNo: '9999988888',
      password: hashedPassword,
      role: 'admin',
      color: 'red',
    });

    await admin.save();
    console.log('✅ Admin seeded.');
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
};

export default seedAdminData;
