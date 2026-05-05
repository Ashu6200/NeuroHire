const mongoose = require('mongoose');

const NOTIFICATION_TYPES = [
  'interview_result_ready',
  'subscription_activated',
  'payment_failed',
  'plan_expiring',
  'support_ticket_created',
  'support_reply',
  'support_status_changed',
  'system',
];

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
