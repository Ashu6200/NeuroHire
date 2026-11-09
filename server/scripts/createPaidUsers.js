const mongoose = require('mongoose');
const { UserModel, SubscriptionModel } = require('../src/models');
const connectDB = require('../src/config/db');
require('dotenv').config();

const createPaidUsers = async () => {
  try {
    await connectDB();
    console.log('🚀 Connected to database...');

    const getNextMonth = () => {
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      return d;
    };

    const users = [
      {
        id: 'pro-user-id',
        name: 'Pro Member',
        email: 'pro@nerohire.com',
        plan: 'pro',
      },
      {
        id: 'max-user-id',
        name: 'Max Power',
        email: 'max@nerohire.com',
        plan: 'max',
      },
    ];

    for (const userData of users) {
      console.log(`\n👤 Processing user: ${userData.name} (${userData.plan})...`);
      
      // 1. Create or Update User
      const user = await UserModel.findOneAndUpdate(
        { email: userData.email },
        { 
          $set: { 
            id: userData.id,
            name: userData.name,
            plan: userData.plan,
            status: 'active'
          } 
        },
        { upsert: true, new: true }
      );
      console.log(`✅ User ${user.email} created/updated.`);

      // 2. Create or Update Subscription
      const subscription = await SubscriptionModel.findOneAndUpdate(
        { userId: user.id },
        {
          $set: {
            planCode: userData.plan,
            status: 'active',
            source: 'internal',
            currentPeriodStart: new Date(),
            currentPeriodEnd: getNextMonth(),
          }
        },
        { upsert: true, new: true }
      );
      console.log(`✅ Active ${userData.plan} subscription linked to user.`);

      // 3. Link subscription to user model if needed
      user.subscriptionId = subscription._id;
      await user.save();
    }

    console.log('\n✨ All users created successfully with their respective plans!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating users:', error);
    process.exit(1);
  }
};

createPaidUsers();
