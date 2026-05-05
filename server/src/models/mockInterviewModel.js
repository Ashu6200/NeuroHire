const { default: mongoose } = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    // required: true,
  },
  questionType: {
    type: String,
    enum: ['technical', 'behavioral', 'general', 'situational'],
    default: 'technical',
  },
});
const mockInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    questionSet: [questionSchema],
    experienceLevel: {
      type: String,
      enum: ['entry', 'junior', 'midlevel', 'senior', 'lead'],
      required: true,
    },
    technicalDifficulty: {
      type: String,
      enum: ['very easy', 'easy', 'medium', 'hard', 'very hard'],
      required: true,
    },
    behavioralDifficulty: {
      type: String,
      enum: ['very easy', 'easy', 'medium', 'hard', 'very hard'],
      required: true,
    },
    generalDifficulty: {
      type: String,
      enum: ['very easy', 'easy', 'medium', 'hard', 'very hard'],

      required: true,
    },
    situationalDifficulty: {
      type: String,
      enum: ['very easy', 'easy', 'medium', 'hard', 'very hard'],
      required: true,
    },
    jobProfileDescription: {
      type: String,
      required: true,
    },
    preferredCandidateProfile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const MockInterviewModel = mongoose.model('MockInterview', mockInterviewSchema);

module.exports = MockInterviewModel;
