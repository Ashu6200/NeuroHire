const { default: mongoose } = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    planCode: {
      type: String,
      enum: ['free', 'pro', 'max'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'created',
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayInvoiceId: {
      type: String,
      default: null,
    },
    razorpaySubscriptionId: {
      type: String,
      default: null,
      index: true,
    },
    rawPayload: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model('Payment', paymentSchema);

module.exports = PaymentModel;
