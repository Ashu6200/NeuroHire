const { config } = require('../config/config');
const { ApplicationEnvironment } = require('../constants');
const logger = require('../utils/logger');
const BaseError = require('../utils/baseError');

const errorHandler = (err, req, res, _next) => {
  const isBaseError = err instanceof BaseError;
  const isBetterAuthError = err?.name === 'BetterAuthError';

  let status = 500;
  if (isBaseError) status = err.statusCode;
  else if (isBetterAuthError) status = err.status || err.statusCode || 400;
  else if (err.statusCode) status = err.statusCode;

  logger.error('Request error', {
    message: err?.message,
    name: err?.name,
    statusCode: status,
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
    stack: err?.stack,
    cause: err?.cause ? (err.cause.message ?? String(err.cause)) : undefined,
    ...(isBaseError && err.errors ? { validationErrors: err.errors } : {}),
    ...(isBetterAuthError && err.code ? { authCode: err.code } : {}),
  });

  const message =
    status >= 500
      ? 'We are having a temporary issue. Please try again in a moment.'
      : err.message;

  const errorResponse = {
    success: false,
    statusCode: status,
    request: {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      params: req.params,
      body: req.body ? { ...req.body } : undefined,
    },
    message,
    data: null,
    details: {},
  };

  if (isBaseError && err.errors) {
    errorResponse.details.errors = err.errors;
  }
  if (isBetterAuthError) {
    errorResponse.details.code = err.code || null;
  }

  if (config.ENV !== ApplicationEnvironment.PRODUCTION) {
    errorResponse.details = {
      ...errorResponse.details,
      errorName: err.name,
      originalMessage: err.message,
      stack: err.stack,
      cause: err?.cause ? (err.cause.message ?? String(err.cause)) : undefined,
    };
  } else {
    delete errorResponse.request;
    delete errorResponse.details;
  }

  return res.status(status).json(errorResponse);
};

module.exports = errorHandler;
