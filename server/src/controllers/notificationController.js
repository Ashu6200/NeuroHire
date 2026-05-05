const { asyncHandler } = require('../middlewares');
const { NotificationModel } = require('../models');
const { apiResponse, apiError } = require('../utils');

const getMyNotifications = asyncHandler(async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip  = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    NotificationModel.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    NotificationModel.countDocuments({ userId: req.user.id }),
  ]);

  return apiResponse(req, res, 200, 'Notifications fetched', {
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + notifications.length < total,
    },
  });
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await NotificationModel.countDocuments({
    userId: req.user.id,
    isRead: false,
  });
  return apiResponse(req, res, 200, 'Unread count fetched', { count });
});

const markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await NotificationModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: { isRead: true, readAt: new Date() } },
    { new: true }
  );

  if (!notification) {
    return apiError(next, new Error('Notification not found'), req, 404);
  }

  return apiResponse(req, res, 200, 'Notification marked as read', { notification });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await NotificationModel.updateMany(
    { userId: req.user.id, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  return apiResponse(req, res, 200, 'All notifications marked as read', {
    modifiedCount: result.modifiedCount,
  });
});

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
