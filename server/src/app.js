const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const { xss } = require("express-xss-sanitizer");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const { limiter } = require("./helpers");
const { apiResponse, apiError } = require("./utils");
const { asyncHandler, errorHandler } = require("./middlewares");
const { responseMessage } = require("./constants");
const { userRouter, mockInterviewRouter } = require("./routes");
const { default: helmet } = require("helmet");
const { config } = require("./config/config");



const app = express();

app.use(helmet())
app.use(
  cors({
    origin: (config.ORIGIN).split(','),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH",],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Origin", "Accept", "Access-Control-Allow-Origin",],
    credentials: true,
  })
);
app.use(express.json());
app.use(xss());
app.use(morgan("dev"));
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression({
  level: 6,
  threshold: 100 * 1000,
}));


app.get("/", asyncHandler((req, res, _next) => {
  const message = "Welcome to NeroHire API";
  apiResponse(req, res, 200, message, null);
}));
app.get('/health', asyncHandler((req, res) => {
  const message = "NeroHire API health check";
  apiResponse(req, res, 200, message, {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
}));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/mock-interview", mockInterviewRouter);

app.use((req, _res, next) => {
  apiError(next, new Error(responseMessage.NOT_FOUND), req, 404);
});

app.use(errorHandler);

module.exports = app;
