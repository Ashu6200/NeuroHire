const { config } = require('../config/config');
const { ApplicationEnvironment } = require('../constants');

const apiResponse = (req, res, responseStatusCode, responseMessage, data = null) => {
  const response = {
    success: true,
    statusCode: responseStatusCode,
    request: {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      params: req.params,
      body: req.body ? { ...req.body } : undefined,
    },
    message: responseMessage,
    data,
  };
  if (config.ENV === ApplicationEnvironment.PRODUCTION) {
    delete response.request;
  }
  res.status(responseStatusCode).json(response);
};

module.exports = apiResponse;
