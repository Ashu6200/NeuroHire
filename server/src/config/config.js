const { ApplicationEnvironment } = require('../constants');

require('dotenv').config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  ENV: process.env.NODE_ENV || ApplicationEnvironment.DEVELOPMENT,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  OPENAI_API_KEY : process.env.OPENAI_API_KEY,
  ORIGIN : process.env.ORIGIN,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  RAZORPAY_PLAN_IDS: {
    pro: process.env.RAZORPAY_PRO_PLAN_ID,
    max: process.env.RAZORPAY_MAX_PLAN_ID,
  },

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT || 465,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM || 'NeuroHire <noreply@neurohire.com>',

  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
};
module.exports = { config };
