const { default: mongoose } = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      enum: ['free', 'pro', 'max'],
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
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
    interval: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    razorpayPlanId: {
      type: String,
      default: null,
    },
    limits: {
      type: Object,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const PlanModel = mongoose.model('Plan', planSchema);

module.exports = PlanModel;
