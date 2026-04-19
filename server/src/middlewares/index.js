const asyncHandler = require("./asyncHandler");
const { protect, authorize } = require("./authMiddleware");
const errorHandler = require("./errorHandler");

module.exports ={
    protect,
    authorize,
    asyncHandler,
    errorHandler
}