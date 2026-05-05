require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const { config } = require('../src/config/config');
const { getAuth } = require('../src/lib/auth');
const UserModel = require('../src/models/userModel');

const VALID_ROLES = ['admin', 'support'];

// ==========================================
// CONFIGURATION: Edit these values to register an admin/support
// ==========================================
const DEFAULT_NAME = 'Admin User';
const DEFAULT_EMAIL = 'admin@example.com';
const DEFAULT_PASSWORD = 'AdminPassword123';
const DEFAULT_ROLE = 'admin'; // Options: admin, support
// ==========================================
// Admin:
// Email: ashutoshkewat1@gmail.com
// Role: admin
// Password: Admin@123 (Please change this after logging in)
// Support:
// Email: support.nero@gmail.com
// Role: support
// Password: Support@123 (Please change this after logging in)
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
    console.error(
      '\nUsage: node scripts/registerAdmin.js --email <email> --password <password> [--name <name>] [--role admin]\n' +
        `Roles: ${VALID_ROLES.join(' | ')}\n`,
    );
    process.exit(1);
  }

  if (!VALID_ROLES.includes(role)) {
    console.error(
      `\nInvalid role "${role}". Must be one of: ${VALID_ROLES.join(', ')}\n`,
    );
    process.exit(1);
  }

  const adminName = name;
  await mongoose.connect(config.MONGODB_URI);
  console.log('[db] MongoDB connected');

  let betterAuthUserId;

  try {
    const auth = await getAuth();
    let baUser;
    try {
      const result = await auth.api.createUser({
        body: {
          email,
          password,
          name: adminName,
          role,
          data: { emailVerified: true },
        },
      });
      baUser = result.user;
      console.log(
        `[auth] User created via Better Auth admin API (id: ${baUser.id})`,
      );
    } catch (err) {
      console.warn(
        `[auth] createUser failed (${err.message}), falling back to signUpEmail…`,
      );
      const fallback = await auth.api.signUpEmail({
        body: { email, password, name: adminName },
      });
      baUser = fallback.user;
      console.log(`[auth] User created via signUpEmail (id: ${baUser.id})`);
    }

    betterAuthUserId = baUser.id;

    const mongoClient = new MongoClient(config.MONGODB_URI);
    await mongoClient.connect();
    try {
      const db = mongoClient.db();
      const { modifiedCount } = await db
        .collection('users')
        .updateOne(
          { id: betterAuthUserId },
          { $set: { emailVerified: true, role } },
        );
      if (modifiedCount > 0) {
        console.log(
          '[db] Better Auth user patched (emailVerified=true, role set)',
        );
      }
    } finally {
      await mongoClient.close();
    }

    await UserModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $set: {
          id: betterAuthUserId,
          name: adminName,
          email: email.toLowerCase(),
          role,
          status: 'active',
        },
      },
      { upsert: true, new: true },
    );
    console.log('[db] UserModel upserted');

    console.log('\n✓ Admin registered successfully!');
    console.log(`  Name  : ${adminName}`);
    console.log(`  Email : ${email}`);
    console.log(`  Role  : ${role}`);
    console.log(`  ID    : ${betterAuthUserId}\n`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('\n[error]', err);
  process.exit(1);
});
