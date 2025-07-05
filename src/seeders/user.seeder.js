// src/seeders/user.seeder.js
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

const seedUserData = async () => {
  try {
    const existing = await User.findOne({ email: 'user1@example.com' });
    if (existing) {
      console.log('🛑 Users already seeded.');
      return;
    }

    const passwordHash = await bcrypt.hash('User@123', 10);

    const users = [
      {
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
        email: 'user1@example.com',
        phoneNo: '8888888888',
        password: passwordHash,
        role: 'user',
        color: 'green',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        userName: 'janesmith',
        email: 'user2@example.com',
        phoneNo: '7777777777',
        password: passwordHash,
        role: 'user',
        color: 'pink',
      }
    ];

    await User.insertMany(users);
    console.log('✅ Users seeded.');
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
  }
};

export default seedUserData;
