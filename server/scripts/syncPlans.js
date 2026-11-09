const mongoose = require('mongoose');
const { seedPlans } = require('../src/services/subscriptionService');
const connectDB = require('../src/config/db');
require('dotenv').config();

const sync = async () => {
  try {
    await connectDB();
    console.log('🚀 Connected to database...');
    
    console.log('🔄 Syncing plans to database...');
    await seedPlans();
    console.log('✅ Plans synced successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing plans:', error);
    process.exit(1);
  }
};

sync();
