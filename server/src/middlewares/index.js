const asyncHandler = require("./asyncHandler");
const {
  authorize,
  checkUsageLimit,
  hasPermission,
  protect,
  requirePermission,
  requirePlan,
} = require("./authMiddleware");
const errorHandler = require("./errorHandler");

module.exports ={
    protect,
    authorize,
    checkUsageLimit,
    hasPermission,
    requirePermission,
    requirePlan,
    asyncHandler,
    errorHandler
}
