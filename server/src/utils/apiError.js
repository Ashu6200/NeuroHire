const { config } = require("../config/config");
const { responseMessage, ApplicationEnvironment } = require("../constants");

const apiError = (nextFun, err, req, errorStatusCode = 500) => {
  const errorObj = {
    success: false,
    statusCode: errorStatusCode,
    request: {
      ip: req?.ip || null,
      method: req?.method,
      url: req?.originalUrl
    },
    message: err instanceof Error
      ? err.message || responseMessage.SOMETHING_WENT_WRONG
      : responseMessage.SOMETHING_WENT_WRONG,
    data: null,
    trace: err instanceof Error ? { error: err.stack } : null
  };

  if (config.ENV === ApplicationEnvironment.PRODUCTION) {
    delete errorObj.request.ip;
    delete errorObj.trace;
  }

  return nextFun(errorObj);
};

module.exports = apiError;
