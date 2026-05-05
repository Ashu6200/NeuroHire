const { asyncHandler } = require('../middlewares');
const mongoose = require('mongoose');
const { apiResponse, BaseError } = require('../utils');
const { MockInterviewModel } = require('../models');
const { generateQuestions, generateEnhancedFeedback, generateSkillGap, generateJdMatch } = require('../helpers');
const { USAGE_METRICS } = require('../constants/plans');
const { consumeUsage } = require('../services/subscriptionService');
const InterviewResult = require('../models/interviewResultModel');

const createMockInterview = asyncHandler(async (req, res) => {
  const {
    title,
    companyName,
    role,
    domain,
    experienceLevel,
    technicalDifficulty,
    behavioralDifficulty,
    generalDifficulty,
    situationalDifficulty,
    jobProfileDescription,
    preferredCandidateProfile,
  } = req.body;

  const questionSet = await generateQuestions(
    role, domain, experienceLevel, preferredCandidateProfile,
    companyName, jobProfileDescription,
    technicalDifficulty, behavioralDifficulty, situationalDifficulty, generalDifficulty,
  );

  if (!questionSet || questionSet.length === 0) {
    throw new BaseError('Failed to generate questions. Please try again.', 500);
  }

  let mockInterview;
  try {
    mockInterview = await MockInterviewModel.create({
      userId: req.user.id,
      title, companyName, role, domain,
      questionSet,
      experienceLevel, technicalDifficulty, behavioralDifficulty,
      situationalDifficulty, generalDifficulty,
      preferredCandidateProfile, jobProfileDescription,
    });
    
    await consumeUsage(req.user, USAGE_METRICS.AI_GENERATIONS);
    await consumeUsage(req.user, USAGE_METRICS.MOCK_INTERVIEWS_CREATED);
  } catch (error) {
    if (mockInterview) {
      await MockInterviewModel.findByIdAndDelete(mockInterview._id);
    }
    throw error;
  }

  return apiResponse(req, res, 201, 'Mock interview created successfully', { mockInterview });
});

const updateMockInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid mock interview ID format', 400);
  }

  const mockInterview = await MockInterviewModel.findById(id);
  if (!mockInterview) throw new BaseError('Mock interview not found', 404);
  if (mockInterview.userId.toString() !== req.user.id) {
    throw new BaseError('Not authorized to edit this mock interview', 403);
  }

  const updatedMockInterview = await MockInterviewModel.findOneAndUpdate(
    { _id: id, __v: mockInterview.__v },
    { $set: { ...req.body }, $inc: { __v: 1 } },
    { new: true, runValidators: true },
  );

  if (!updatedMockInterview) {
    throw new BaseError('Mock interview was modified by another request. Please refresh and try again.', 409);
  }

  return apiResponse(req, res, 200, 'Mock interview updated successfully', { mockInterview: updatedMockInterview });
});

const regenerateQuestionSet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid mock interview ID format', 400);
  }

  const mockInterview = await MockInterviewModel.findById(id);
  if (!mockInterview) throw new BaseError('Mock interview not found', 404);
  if (mockInterview.userId.toString() !== req.user.id) {
    throw new BaseError('Not authorized to regenerate questions', 403);
  }

  const questionSet = await generateQuestions(
    mockInterview.role, mockInterview.domain, mockInterview.experienceLevel,
    mockInterview.preferredCandidateProfile, mockInterview.companyName,
    mockInterview.jobProfileDescription, mockInterview.technicalDifficulty,
    mockInterview.behavioralDifficulty, mockInterview.situationalDifficulty,
    mockInterview.generalDifficulty,
  );

  mockInterview.questionSet = questionSet;
  await mockInterview.save();
  await Promise.all([
    consumeUsage(req.user, USAGE_METRICS.AI_GENERATIONS),
    consumeUsage(req.user, USAGE_METRICS.QUESTION_REGENERATIONS),
  ]);

  return apiResponse(req, res, 200, 'Question set regenerated successfully', { questionSet: mockInterview.questionSet });
});

const getAllMockInterviews = asyncHandler(async (req, res) => {
  const mockInterviews = await MockInterviewModel.find({ userId: req.user.id });
  if (!mockInterviews || mockInterviews.length === 0) {
    throw new BaseError('No mock interviews found', 404);
  }
  return apiResponse(req, res, 200, 'Mock interviews fetched successfully', { mockInterviews });
});

const getMockInterviewById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid mock interview ID format', 400);
  }

  const mockInterview = await MockInterviewModel.findOne({ _id: id, userId: req.user.id });
  if (!mockInterview) throw new BaseError('Mock interview not found', 404);

  return apiResponse(req, res, 200, 'Mock interview fetched successfully', { mockInterview });
});

const getMockInterviewQuestions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid mock interview ID format', 400);
  }

  const mockInterview = await MockInterviewModel.findById(id);
  if (!mockInterview) throw new BaseError('Mock interview not found', 404);

  return apiResponse(req, res, 200, 'Mock interview questions fetched successfully', {
    title: mockInterview.title,
    companyName: mockInterview.companyName,
    role: mockInterview.role,
    domain: mockInterview.domain,
    experienceLevel: mockInterview.experienceLevel,
    questionSet: mockInterview.questionSet,
  });
});

const deleteMockInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid mock interview ID format', 400);
  }

  const mockInterview = await MockInterviewModel.findOne({ _id: id, userId: req.user.id });
  if (!mockInterview) {
    throw new BaseError("Mock interview not found or you don't have permission to delete it", 404);
  }

  const deleted = await MockInterviewModel.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!deleted) throw new BaseError('Failed to delete mock interview', 500);

  return apiResponse(req, res, 200, 'Mock interview deleted successfully');
});

const getEnhancedFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { resultId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid mock interview ID', 400);
  }

  const interview = await MockInterviewModel.findOne({ _id: id, userId: req.user.id });
  if (!interview) throw new BaseError('Mock interview not found', 404);

  const result = resultId && mongoose.Types.ObjectId.isValid(resultId)
    ? await InterviewResult.findOne({ _id: resultId, userId: req.user.id, mockInterviewId: id })
    : await InterviewResult.findOne({ userId: req.user.id, mockInterviewId: id }).sort({ createdAt: -1 });

  if (!result) throw new BaseError('No interview result found', 404);

  await consumeUsage(req.user, USAGE_METRICS.AI_GENERATIONS);
  const feedback = await generateEnhancedFeedback(interview, result.qa);

  return apiResponse(req, res, 200, 'Enhanced feedback generated', { feedback });
});

const getSkillGap = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { resultId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid mock interview ID', 400);
  }

  const interview = await MockInterviewModel.findOne({ _id: id, userId: req.user.id });
  if (!interview) throw new BaseError('Mock interview not found', 404);

  const result = resultId && mongoose.Types.ObjectId.isValid(resultId)
    ? await InterviewResult.findOne({ _id: resultId, userId: req.user.id, mockInterviewId: id })
    : await InterviewResult.findOne({ userId: req.user.id, mockInterviewId: id }).sort({ createdAt: -1 });

  if (!result) throw new BaseError('No interview result found', 404);

  await consumeUsage(req.user, USAGE_METRICS.AI_GENERATIONS);
  const skillGap = await generateSkillGap(interview, result.qa);

  return apiResponse(req, res, 200, 'Skill gap analysis generated', { skillGap });
});

const getJdMatch = asyncHandler(async (req, res) => {
  const { userProfile, jobDescription } = req.body;
  if (!userProfile || !jobDescription) {
    throw new BaseError('userProfile and jobDescription are required', 400);
  }

  await consumeUsage(req.user, USAGE_METRICS.AI_GENERATIONS);
  const matchResult = await generateJdMatch(userProfile, jobDescription);

  return apiResponse(req, res, 200, 'JD match analysis generated', { matchResult });
});

const saveInterviewResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { qa, startAt, endAt } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid mock interview ID format', 400);
  }

  const interview = await MockInterviewModel.findOne({ _id: id, userId: req.user.id });
  if (!interview) throw new BaseError('Mock interview not found', 404);

  if (!qa || !Array.isArray(qa) || qa.length === 0) {
    throw new BaseError('Q&A pairs are required', 400);
  }

  await consumeUsage(req.user, USAGE_METRICS.AI_GENERATIONS);
  const feedback = await generateEnhancedFeedback(interview, qa);

  const enhancedQA = qa.map((item, i) => {
    const perQ = (feedback.perQuestion || []).find((p) => p.index === i) || {};
    return {
      question: item.question,
      userAnswer: item.userAnswer || '(no answer provided)',
      aiFeedback: {
        score: perQ.score ?? 0,
        strengths: perQ.strengths || [],
        areasToImprove: perQ.areasToImprove || [],
      },
    };
  });

  const result = await InterviewResult.create({
    userId: req.user.id,
    mockInterviewId: id,
    startAt: new Date(startAt),
    endAt: new Date(endAt),
    totalScore: feedback.overallScore ?? 0,
    summary: feedback.overallSummary || '',
    skillAssignment: {
      communicationScore: feedback.communicationScore ?? 0,
      technicalDepthScore: feedback.technicalDepthScore ?? 0,
      starMethodScore: feedback.starMethodScore ?? 0,
    },
    qa: enhancedQA,
  });

  return apiResponse(req, res, 201, 'Interview result saved successfully', { result, feedback });
});

const getInterviewResults = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid mock interview ID format', 400);
  }

  const interview = await MockInterviewModel.findOne({ _id: id, userId: req.user.id });
  if (!interview) throw new BaseError('Mock interview not found', 404);

  const results = await InterviewResult.find({ mockInterviewId: id, userId: req.user.id })
    .sort({ createdAt: -1 });

  return apiResponse(req, res, 200, 'Results fetched successfully', { results, interview });
});

const mockInterviewController = {
  createMockInterview,
  updateMockInterview,
  regenerateQuestionSet,
  getAllMockInterviews,
  getMockInterviewById,
  getMockInterviewQuestions,
  deleteMockInterview,
  getEnhancedFeedback,
  getSkillGap,
  getJdMatch,
  saveInterviewResult,
  getInterviewResults,
};

module.exports = mockInterviewController;
