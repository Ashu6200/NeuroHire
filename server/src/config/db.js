const { default: mongoose } = require("mongoose");
const { config } = require("./config");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection failed', { message: error.message });
    process.exit(1);
  }
};

module.exports = connectDB;
