const server = require('./app');
const { config } = require('./config/config');
const connectDB = require('./config/db');

const PORT = config.PORT;
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
startServer();
