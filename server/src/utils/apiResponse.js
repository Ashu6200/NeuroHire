const { config } = require("../config/config");
const { ApplicationEnvironment } = require("../constants");

const apiResponse = (req, res, responseStatusCode, responseMessage, data = null) => {
  const response = {
    success: true,
    statusCode: responseStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.originalUrl
    },
    message: responseMessage,
    data: data
  };
  if (config.ENV === ApplicationEnvironment.PRODUCTION) {
    delete response.request.ip;
  }
  res.status(responseStatusCode).json(response);
};
module.exports = apiResponse;
