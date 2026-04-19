const { default: mongoose } = require("mongoose");
const { config } = require("./config");

const connectDB= async () => {
    try {
        await mongoose.connect(config.MONGODB_URI)
        console.log('MongoDB connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
module.exports = connectDB;
