const { statusCode } = require('../constants');

const errorHandler = (err, req, res, _next) => {
  if (err.success === false) {
    return res.status(err.statusCode).json(err);
  }
  const status = err.statusCode || statusCode.INTERNAL_SERVER_ERROR;
  res.status(status).json({
    success: false,
    statusCode: status,
    request: {
      method: req.method,
      url: req.originalUrl,
    },
    message: err.message || 'Internal Server Error',
    data: null,
  });
};

module.exports = errorHandler;
