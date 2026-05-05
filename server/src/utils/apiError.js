const BaseError = require('./baseError');

const apiError = (nextFun, err, req, errorStatusCode = 500) => {
  const message = err instanceof Error ? err.message : 'Unexpected error occurred';
  const baseErr = new BaseError(message, errorStatusCode);
  if (err instanceof Error) baseErr.stack = err.stack;
  return nextFun(baseErr);
};

module.exports = apiError;
