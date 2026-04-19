const { asyncHandler } = require('../middlewares');

const evaluateInterview = asyncHandler(async (req, res, next) => {
  const { mockInterviewId, attemptedDate, stateAt, endAt, transcript } =
    req.body;
});
