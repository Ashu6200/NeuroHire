const { asyncHandler } = require('../middlewares');
const mongoose = require('mongoose');
const { apiResponse, apiError } = require('../utils');
const { MockInterviewModel } = require('../models');
const { generateQuestions } = require('../helpers');

const createMockInterview = asyncHandler(async (req, res, next) => {
  try {
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
      role,
      domain,
      experienceLevel,
      preferredCandidateProfile,
      companyName,
      jobProfileDescription,
      technicalDifficulty,
      behavioralDifficulty,
      situationalDifficulty,
      generalDifficulty
    );
    if (!questionSet || questionSet.length === 0) {
      return apiError(
        next,
        new Error('Failed to generate questions. Please try again.'),
        req,
        500
      );
    }
    const mockInterview = await MockInterviewModel.create({
      userId: req.user.id,
      title,
      companyName,
      role,
      domain,
      questionSet: questionSet,
      experienceLevel,
      technicalDifficulty,
      behavioralDifficulty,
      situationalDifficulty,
      generalDifficulty,
      preferredCandidateProfile,
      jobProfileDescription,
    });
    return apiResponse(req, res, 201, 'Mock interview created successfully', {
      mockInterview,
    });
  } catch (error) {
    console.error('Error in createMockInterview:', error);
    return apiError(next, error, req, 500);
  }
});
const updateMockInterview = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(
        next,
        new Error('Invalid mock interview ID format'),
        req,
        400
      );
    }
    const mockInterview = await MockInterviewModel.findById(id);
    if (!mockInterview) {
      return apiError(next, new Error('Mock interview not found'), req, 404);
    }

    if (mockInterview.userId.toString() !== req.user.id) {
      return apiError(
        next,
        new Error('Not authorized to edit this mock interview'),
        req,
        403
      );
    }

    const updateData = { ...req.body };

    const updatedMockInterview = await MockInterviewModel.findOneAndUpdate(
      { _id: id, __v: mockInterview.__v },
      { $set: updateData, $inc: { __v: 1 } },
      { new: true, runValidators: true }
    );

    if (!updatedMockInterview) {
      return apiError(
        next,
        new Error(
          'Mock interview was modified by another request. Please refresh and try again.'
        ),
        req,
        409
      );
    }

    return apiResponse(req, res, 200, 'Mock interview updated successfully', {
      mockInterview: updatedMockInterview,
    });
  } catch (error) {
    console.error('Error in updateMockInterview:', error);
    return apiError(next, error, req, 500);
  }
});
const regenerateQuestionSet = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(
        next,
        new Error('Invalid mock interview ID format'),
        req,
        400
      );
    }

    const mockInterview = await MockInterviewModel.findById(id);

    if (!mockInterview) {
      return apiError(next, new Error('Mock interview not found'), req, 404);
    }

    if (mockInterview.userId.toString() !== req.user.id) {
      return apiError(
        next,
        new Error('Not authorized to regenerate questions'),
        req,
        403
      );
    }

    const questionSet = await generateQuestions(
      mockInterview.role,
      mockInterview.domain,
      mockInterview.experienceLevel,
      mockInterview.preferredCandidateProfile,
      mockInterview.companyName,
      mockInterview.jobProfileDescription,
      mockInterview.technicalDifficulty,
      mockInterview.behavioralDifficulty,
      mockInterview.situationalDifficulty,
      mockInterview.generalDifficulty
    );

    mockInterview.questionSet = questionSet;
    await mockInterview.save();

    return apiResponse(req, res, 200, 'Question set regenerated successfully', {
      questionSet: mockInterview.questionSet,
    });
  } catch (error) {
    console.error('Error in regenerateQuestionSet:', error);
    return apiError(next, error, req, 500);
  }
});

const getAllMockInterviews = asyncHandler(async (req, res, next) => {
  try {
    console.log('User ID:', req.user.id);
    const mockInterviews = await MockInterviewModel.find({
      userId: req.user.id,
    });
    if (!mockInterviews || mockInterviews.length === 0) {
      return apiError(next, new Error('No mock interviews found'), req, 404);
    }
    return apiResponse(req, res, 200, 'Mock interviews fetched successfully', {
      mockInterviews,
    });
  } catch (error) {
    console.error('Error in getAllMockInterview:', error);
    return apiError(next, error, req, 500);
  }
});
const getMockInterviewById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(
        next,
        new Error('Invalid mock interview ID format'),
        req,
        400
      );
    }
    const mockInterview = await MockInterviewModel.findOne({
      _id: id,
      userId: req.user.id,
    });
    if (!mockInterview) {
      return apiError(next, new Error('Mock interview not found'), req, 404);
    }
    return apiResponse(req, res, 200, 'Mock interview fetched successfully', {
      mockInterview,
    });
  } catch (error) {
    console.error('Error in getMockInterviewById:', error);
    return apiError(next, error, req, 500);
  }
});
const getMockInterviewQuestions = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(
        next,
        new Error('Invalid mock interview ID format'),
        req,
        400
      );
    }
    const mockInterview = await MockInterviewModel.findById(id);
    if (!mockInterview) {
      return apiError(next, new Error('Mock interview not found'), req, 404);
    }
    return apiResponse(
      req,
      res,
      200,
      'Mock interview questions fetched successfully',
      {
        title: mockInterview.title,
        companyName: mockInterview.companyName,
        role: mockInterview.role,
        domain: mockInterview.domain,
        experienceLevel: mockInterview.experienceLevel,
        questionSet: mockInterview.questionSet,
      }
    );
  } catch (error) {
    console.error('Error in getMockInterviewQuestions:', error);
    return apiError(next, error, req, 500);
  }
});

const deleteMockInterview = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(
        next,
        new Error('Invalid mock interview ID format'),
        req,
        400
      );
    }
    const mockInterview = await MockInterviewModel.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!mockInterview) {
      return apiError(
        next,
        new Error(
          "Mock interview not found or you don't have permission to delete it"
        ),
        req,
        404
      );
    }
    const deletedInterview = await MockInterviewModel.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!deletedInterview) {
      return apiError(
        next,
        new Error('Failed to delete mock interview'),
        req,
        500
      );
    }
    return apiResponse(req, res, 200, 'Mock interview deleted successfully');
  } catch (error) {
    console.error('Error in deleteMockInterview:', error);
    return apiError(next, error, req, 500);
  }
});

const mockInterviewController = {
  createMockInterview,
  updateMockInterview,
  regenerateQuestionSet,
  getAllMockInterviews,
  getMockInterviewById,
  getMockInterviewQuestions,
  deleteMockInterview,
};

module.exports = mockInterviewController;
