const adminRouter = require('./adminRoutes');
const billingRouter = require('./billingRoutes');
const mockInterviewRouter = require("./mockInterviewRoutes");
const userRouter = require("./userRoutes");
const resumeRouter = require('./resumeRoutes');
const notificationRouter = require('./notificationRoutes');
const supportRouter = require('./supportRoutes');
const questionRouter = require('./questionRoutes');

module.exports = {
  adminRouter,
  billingRouter,
  mockInterviewRouter,
  notificationRouter,
  resumeRouter,
  supportRouter,
  userRouter,
  questionRouter,
};
