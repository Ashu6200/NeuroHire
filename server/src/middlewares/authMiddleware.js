const { config } = require('../config/config');
const jwt = require('jsonwebtoken');
const { responseMessage } = require('../constants');
const { UserModel } = require('../models');
const { apiError } = require('../utils');
const asyncHandler = require('./asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    console.log('No token provided');
    return apiError(next, new Error(responseMessage.UNAUTHORIZED), req, 401);
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select('-password');
    if (!user) {
      return apiError(next, new Error('User not found'), req, 401);
    }
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      isVerified: user.isVerified,
      name: user.name,
    };
    next();
  } catch (error) {
    return apiError(next, error, req, 401);
  }
});

const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user || !req.user.role) {
      return apiError(next, new Error(responseMessage.UNAUTHORIZED), req, 401);
    }
    if (!roles.includes(req.user.role)) {
      return apiError(next, new Error(responseMessage.FORBIDDEN), req, 403);
    }
    next();
  };
};
module.exports = {
  protect,
  authorize,
};
