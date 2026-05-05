const { Worker } = require('bullmq');
const { NotificationModel } = require('../models');
const { getRedisClient, createQueue } = require('./redisService');
const { emitToUser } = require('./socketService');
const logger = require('../utils/logger');

const QUEUE_NAME = 'notifications';

let notificationQueue = null;

const getQueue = () => {
  if (!notificationQueue) {
    notificationQueue = createQueue(QUEUE_NAME);
  }
  return notificationQueue;
};

const processNotificationJob = async (job) => {
  const { userId, type, title, body, data } = job.data;

  let notification;
  try {
    notification = await NotificationModel.create({
      userId,
      type,
      title,
      body,
      data: data || {},
    });
  } catch (err) {
    logger.error('notificationService: failed to persist notification', {
      jobId: job.id,
      userId,
      type,
      error: err.message,
    });
    throw err;
  }

  try {
    emitToUser(userId, 'notification:new', {
      _id: notification._id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    });
  } catch (err) {
    logger.warn('notificationService: socket emit failed (non-fatal)', {
      userId,
      notificationId: String(notification._id),
      error: err.message,
    });
  }

  logger.debug('notificationService: processed notification', {
    notificationId: String(notification._id),
    userId,
    type,
  });
};

const initNotificationWorker = () => {
  const worker = new Worker(QUEUE_NAME, processNotificationJob, {
    connection: getRedisClient(),
    concurrency: 5,
  });

  worker.on('completed', (job) => {
    logger.debug('notificationService: job completed', { jobId: job.id });
  });

  worker.on('failed', (job, err) => {
    logger.error('notificationService: job failed', {
      jobId: job?.id,
      error: err.message,
    });
  });

  logger.info('notificationService: worker started', { queue: QUEUE_NAME });
  return worker;
};

const sendNotification = async (userId, type, title, body, data = {}) => {
  const queue = getQueue();
  const job = await queue.add(type, { userId, type, title, body, data });
  logger.debug('notificationService: job enqueued', { jobId: job.id, userId, type });
  return job;
};

const notifyInterviewResult = (userId, interviewId, score) =>
  sendNotification(
    userId,
    'interview_result_ready',
    'Your interview result is ready',
    `You scored ${score} on your mock interview. Tap to view your detailed feedback.`,
    { interviewId }
  );

const notifySubscriptionActivated = (userId, planCode) =>
  sendNotification(
    userId,
    'subscription_activated',
    'Subscription activated',
    `Your ${planCode} plan is now active. Enjoy your new features!`,
    { planCode }
  );

const notifyPaymentFailed = (userId) =>
  sendNotification(
    userId,
    'payment_failed',
    'Payment failed',
    'We could not process your payment. Please update your payment method.',
    {}
  );

const notifyPlanExpiring = (userId, daysLeft) =>
  sendNotification(
    userId,
    'plan_expiring',
    'Your plan is expiring soon',
    `Your subscription expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Renew now to avoid losing access.`,
    { daysLeft }
  );

const notifySupportUpdate = (userId, ticketId, status, message) =>
  sendNotification(
    userId,
    status === 'support_reply' ? 'support_reply' : 'support_status_changed',
    status === 'support_reply' ? 'New reply on your ticket' : 'Support ticket updated',
    message,
    { ticketId, status }
  );

module.exports = {
  initNotificationWorker,
  sendNotification,
  notifyInterviewResult,
  notifySubscriptionActivated,
  notifyPaymentFailed,
  notifyPlanExpiring,
  notifySupportUpdate,
};
