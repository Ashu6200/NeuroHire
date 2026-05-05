const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Question description is required'],
    },
    category: {
      type: String,
      enum: ['Technical', 'Behavioral', 'System Design', 'Other'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    companyTags: [
      {
        type: String,
        trim: true,
      },
    ],
    solution: {
      type: String, // Optional solution or hints in markdown
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
