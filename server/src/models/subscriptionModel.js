const { default: mongoose } = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    planCode: {
      type: String,
      enum: ['free', 'pro', 'max'],
      default: 'free',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'cancelled', 'expired', 'failed'],
      default: 'active',
      index: true,
    },
    source: {
      type: String,
      enum: ['internal', 'razorpay'],
      default: 'internal',
    },
    razorpayCustomerId: {
      type: String,
      default: null,
    },
    razorpayPlanId: {
      type: String,
      default: null,
    },
    razorpaySubscriptionId: {
      type: String,
      default: null,
      index: true,
    },
    currentPeriodStart: {
      type: Date,
      default: Date.now,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const SubscriptionModel = mongoose.model('Subscription', subscriptionSchema);

module.exports = SubscriptionModel;
