const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { xss } = require('express-xss-sanitizer');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const { limiter } = require('./helpers');
const { apiResponse, apiError, logger } = require('./utils');
const { asyncHandler, errorHandler } = require('./middlewares');
const { responseMessage } = require('./constants');
const {
  adminRouter,
  billingRouter,
  mockInterviewRouter,
  notificationRouter,
  resumeRouter,
  supportRouter,
  userRouter,
} = require('./routes');
const socketService = require('./services/socketService');
const { default: helmet } = require('helmet');
const { config } = require('./config/config');
const { ApplicationEnvironment } = require('./constants');
const { getAuthHandler } = require('./lib/auth');

const isDev = config.ENV !== ApplicationEnvironment.PRODUCTION;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (config.ORIGIN || '*').split(','),
  },
});

app.set('io', io);
socketService.init(io);
app.use(helmet());
app.use(
  cors({
    origin: (config.ORIGIN || '*').split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'X-Requested-With',
      'Origin',
      'Accept',
      'Access-Control-Allow-Origin',
    ],
    credentials: true,
  }),
);
app.all(/^\/api\/auth\/.*/, async (req, res, next) => {
  try {
    const authHandler = await getAuthHandler();
    return authHandler(req, res);
  } catch (error) {
    return next(error);
  }
});
app.use('/api/v1/billing/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(xss());
app.use(morgan(isDev ? 'dev' : 'combined', { stream: logger.stream }));
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
  }),
);

app.get(
  '/',
  asyncHandler((req, res, _next) => {
    const message = 'Welcome to NeroHire API';
    apiResponse(req, res, 200, message, null);
  }),
);
app.get(
  '/api/live',
  asyncHandler((req, res) => {
    apiResponse(req, res, 200, 'NeuroHire API is live', { status: 'ok' });
  }),
);
app.get(
  '/health',
  asyncHandler((req, res) => {
    const message = 'NeroHire API health check';
    apiResponse(req, res, 200, message, {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }),
);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/billing', billingRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/mock-interview', mockInterviewRouter);
app.use('/api/v1/resume', resumeRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/support', supportRouter);
app.use('/api/v1/questions', require('./routes/questionRoutes'));

app.use((req, _res, next) => {
  apiError(next, new Error(responseMessage.NOT_FOUND), req, 404);
});

app.use(errorHandler);

module.exports = server;
