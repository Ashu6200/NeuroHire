const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled Resume',
      trim: true,
      maxlength: 100,
    },
    canvasState: {
      type: Object,
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    visibility: {
      type: String,
      enum: ['private', 'public'],
      default: 'private',
      index: true,
    },
    templateCategory: {
      type: String,
      enum: ['engineering', 'design', 'marketing', 'finance', 'management', 'healthcare', 'education', 'other'],
      default: 'other',
    },
    tags: [{ type: String, trim: true }],
    templateUsageCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

resumeSchema.index({ visibility: 1, isDeleted: 1, createdAt: -1 });

const ResumeModel = mongoose.model('Resume', resumeSchema);
module.exports = ResumeModel;
