const express = require('express');
const { notificationController } = require('../controllers');
const { protect } = require('../middlewares');

const notificationRouter = express.Router();

notificationRouter.use(protect);

notificationRouter.get('/', notificationController.getMyNotifications);
notificationRouter.get('/unread-count', notificationController.getUnreadCount);
notificationRouter.patch('/read-all', notificationController.markAllAsRead);
notificationRouter.patch('/:id/read', notificationController.markAsRead);

module.exports = notificationRouter;
