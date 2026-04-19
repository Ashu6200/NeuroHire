const { apiError } = require("../utils");

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        apiError(next, err, req);
    });
};

module.exports = asyncHandler;