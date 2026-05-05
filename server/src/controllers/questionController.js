const { QuestionModel: Question, UserProgressModel: UserProgress } = require('../models');
const { asyncHandler } = require('../middlewares');
const { apiResponse } = require('../utils');
const { responseMessage } = require('../constants');

/**
 * @desc    Get all questions (with optional filters)
 * @route   GET /api/v1/questions
 * @access  Private
 */
const getAllQuestions = asyncHandler(async (req, res) => {
  const { category, difficulty, search } = req.query;

  // Build filter object
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const questions = await Question.find(filter).sort({ createdAt: -1 });

  // Get user progress for these questions
  const userId = req.user._id;
  const progressRecords = await UserProgress.find({ userId });
  
  // Map progress by questionId
  const progressMap = {};
  progressRecords.forEach((record) => {
    progressMap[record.questionId.toString()] = record;
  });

  // Combine questions with user progress
  const questionsWithProgress = questions.map((q) => {
    const qObj = q.toObject();
    const progress = progressMap[q._id.toString()];
    qObj.userProgress = progress ? progress.status : 'Unsolved';
    return qObj;
  });

  apiResponse(req, res, 200, 'Questions fetched successfully', questionsWithProgress);
});

/**
 * @desc    Get question by ID
 * @route   GET /api/v1/questions/:id
 * @access  Private
 */
const getQuestionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const question = await Question.findById(id);

  if (!question || !question.isActive) {
    return apiResponse(req, res, 404, 'Question not found');
  }

  // Get user progress
  const progress = await UserProgress.findOne({
    userId: req.user._id,
    questionId: id,
  });

  const questionData = question.toObject();
  questionData.progress = progress || { status: 'Unsolved', notes: '' };

  apiResponse(req, res, 200, 'Question fetched successfully', questionData);
});

/**
 * @desc    Update user progress for a question
 * @route   PUT /api/v1/questions/:id/progress
 * @access  Private
 */
const updateProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const userId = req.user._id;

  const question = await Question.findById(id);
  if (!question) {
    return apiResponse(req, res, 404, 'Question not found');
  }

  // Find and update, or create
  const progress = await UserProgress.findOneAndUpdate(
    { userId, questionId: id },
    { 
      status, 
      notes,
      lastAttemptedAt: Date.now() 
    },
    { new: true, upsert: true }
  );

  apiResponse(req, res, 200, 'Progress updated successfully', progress);
});

// Admin Controllers

/**
 * @desc    Create a new question
 * @route   POST /api/v1/questions
 * @access  Private (Admin)
 */
const createQuestion = asyncHandler(async (req, res) => {
  const question = await Question.create(req.body);
  apiResponse(req, res, 201, 'Question created successfully', question);
});

/**
 * @desc    Update a question
 * @route   PUT /api/v1/questions/:id
 * @access  Private (Admin)
 */
const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!question) {
    return apiResponse(req, res, 404, 'Question not found');
  }

  apiResponse(req, res, 200, 'Question updated successfully', question);
});

/**
 * @desc    Delete a question (soft delete)
 * @route   DELETE /api/v1/questions/:id
 * @access  Private (Admin)
 */
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!question) {
    return apiResponse(req, res, 404, 'Question not found');
  }

  apiResponse(req, res, 200, 'Question deleted successfully', question);
});

module.exports = {
  getAllQuestions,
  getQuestionById,
  updateProgress,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
