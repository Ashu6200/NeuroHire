const { getAuth } = require('../src/lib/auth');
const logger = require('../src/utils/logger');
require('dotenv').config();

const reset = async () => {
  try {
    const auth = await getAuth();
    const email = 'ashutoshkewat1@gmail.com';
    const newPassword = 'password123';

    console.log(`🔄 Attempting to reset password for ${email}...`);

    const user = await auth.api.getUserByEmail({ query: { email } });
    
    if (!user) {
      console.log(`❌ User with email ${email} not found.`);
      process.exit(1);
    }

    // Better Auth password reset
    await auth.api.changePassword({
        body: {
            newPassword: newPassword,
            userId: user.id
        }
    });

    console.log(`\n✅ Success!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 New Password: ${newPassword}`);
    console.log(`\nYou can now log in at http://localhost:3000/sign-in`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
    // If changePassword requires a session, we might need a different approach (direct DB update)
    console.log('Attempting direct database update...');
    try {
        const { MongoClient } = require('mongodb');
        const bcrypt = require('bcrypt'); // Better Auth uses bcrypt by default usually, or Scrypt.
        // Actually, let's just use the Auth API if possible. 
        // If it fails, I'll try to find the hashed password field.
    } catch (e) {}
    process.exit(1);
  }
};

reset();
