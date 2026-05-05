const { default: mongoose } = require('mongoose');

const usageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    subscriptionId: {
      type: String,
      required: true,
      index: true,
    },
    period: {
      type: String,
      required: true,
      index: true,
    },
    planAtTime: {
      type: String,
      enum: ['free', 'pro', 'max'],
      default: 'free',
    },
    metrics: {
      mockInterviewsCreated: { type: Number, default: 0 },
      questionRegenerations: { type: Number, default: 0 },
      aiGenerations: { type: Number, default: 0 },
      resumeExports: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

usageSchema.index({ userId: 1, subscriptionId: 1 }, { unique: true });

const UsageModel = mongoose.model('Usage', usageSchema);

module.exports = UsageModel;
