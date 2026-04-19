const { ApplicationEnvironment } = require('../constants');

require('dotenv').config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  ENV: process.env.NODE_ENV || ApplicationEnvironment.DEVELOPMENT,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '1d',
  EMAILUSER: process.env.EMAIL_USER,
  EMAILPASS: process.env.EMAIL_PASSWORD,
  OPENAI_API_KEY : process.env.OPENAI_API_KEY,
  ORIGIN : process.env.ORIGIN,

};
module.exports = { config };