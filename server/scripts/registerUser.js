
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { config } = require('../src/config/config');
const { getAuth } = require('../src/lib/auth');
const UserModel = require('../src/models/userModel');

// ==========================================
// CONFIGURATION: Edit these values to register a user
// ==========================================
const DEFAULT_NAME = 'Test User';
const DEFAULT_EMAIL = 'user@example.com';
const DEFAULT_PASSWORD = 'Password123';
const DEFAULT_ROLE = 'user'; // Options: user, support, billing_admin, admin, super_admin
// ==========================================

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--') && i + 1 < args.length) {
      params[args[i].slice(2)] = args[i + 1];
      i++;
    }
  }
  return params;
}

async function main() {
  const args = parseArgs();
  
  const name = args.name || DEFAULT_NAME;
  const email = args.email || DEFAULT_EMAIL;
  const password = args.password || DEFAULT_PASSWORD;
  const role = args.role || DEFAULT_ROLE;

  if (!email || !password) {
    console.error('\nError: Email and Password are required.');
    process.exit(1);
  }

  console.log(`\nRegistering user:`);
  console.log(`  Name    : ${name}`);
  console.log(`  Email   : ${email}`);
  console.log(`  Role    : ${role}\n`);

  await mongoose.connect(config.MONGODB_URI);
  console.log('[db] MongoDB connected');

  let betterAuthUserId;

  try {
    const auth = await getAuth();
    let baUser;

    try {
      // Try to create user via Better Auth admin API
      const result = await auth.api.createUser({
        body: {
          email,
          password,
          name: name,
          role,
          data: { emailVerified: true },
        },
      });
      baUser = result.user;
      console.log(`[auth] User created via Better Auth admin API (id: ${baUser.id})`);
    } catch (err) {
      console.warn(`[auth] createUser failed (${err.message}), falling back to signUpEmail…`);
      // Fallback to standard sign up
      const fallback = await auth.api.signUpEmail({
        body: { email, password, name: name },
      });
      baUser = fallback.user;
      console.log(`[auth] User created via signUpEmail (id: ${baUser.id})`);
    }

    betterAuthUserId = baUser.id;

    // Patch Better Auth's internal user record
    const mongoClient = new MongoClient(config.MONGODB_URI);
    await mongoClient.connect();
    try {
      const db = mongoClient.db();
      // Better Auth usually creates a collection named 'user'
      const { modifiedCount } = await db.collection('users').updateOne(
        { id: betterAuthUserId },
        { $set: { emailVerified: true, role } },
      );
      if (modifiedCount > 0) {
        console.log('[db] Better Auth user patched (emailVerified=true, role set)');
      }
    } finally {
      await mongoClient.close();
    }

    // Upsert our App's User Model
    await UserModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $set: {
          id: betterAuthUserId,
          name: name,
          email: email.toLowerCase(),
          role,
          status: 'active',
          emailVerified: true
        },
      },
      { upsert: true, new: true },
    );
    console.log('[db] UserModel upserted');

    console.log('\n✓ User registered successfully!\n');
  } catch (err) {
    console.error('\n[error]', err.message || err);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('\n[error]', err);
  process.exit(1);
});
