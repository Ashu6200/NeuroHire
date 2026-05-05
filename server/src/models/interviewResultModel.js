const { default: mongoose } = require('mongoose');

const QASchema = new mongoose.Schema({
  question: { type: String, required: true },
  userAnswer: { type: String, required: true },
  aiFeedback: {
    score: { type: Number },
    strengths: [{ type: String }],
    areasToImprove: [{ type: String }],
  },
});

const interviewResultSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    mockInterviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MockInterview',
      required: true,
    },
    attemptedDate: {
      type: Date,
      default: Date.now,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    skillAssignment: {
      communicationScore: { type: Number, default: 0 },
      technicalDepthScore: { type: Number, default: 0 },
      starMethodScore: { type: Number, default: 0 },
    },
    qa: [QASchema],
  },
  { timestamps: true }
);

const InterviewResult = mongoose.model(
  'InterviewResult',
  interviewResultSchema
);
module.exports = InterviewResult;
