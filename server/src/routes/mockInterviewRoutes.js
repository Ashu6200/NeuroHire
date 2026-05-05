const express = require('express');
const { mockInterviewController } = require('../controllers');
const { checkUsageLimit, protect, requirePlan } = require('../middlewares');
const { USAGE_METRICS, PLAN_CODES } = require('../constants/plans');

const mockInterviewRouter = express.Router();

mockInterviewRouter.get(
  '/all',
  protect,
  mockInterviewController.getAllMockInterviews
);
mockInterviewRouter.post(
  '/jd-match',
  protect,
  requirePlan(PLAN_CODES.PRO),
  checkUsageLimit(USAGE_METRICS.AI_GENERATIONS),
  mockInterviewController.getJdMatch
);
mockInterviewRouter.post(
  '/create',
  protect,
  checkUsageLimit(USAGE_METRICS.MOCK_INTERVIEWS_CREATED),
  checkUsageLimit(USAGE_METRICS.AI_GENERATIONS),
  mockInterviewController.createMockInterview
);
mockInterviewRouter.post(
  '/:id/save-result',
  protect,
  checkUsageLimit(USAGE_METRICS.AI_GENERATIONS),
  mockInterviewController.saveInterviewResult
);
mockInterviewRouter.get(
  '/:id',
  protect,
  mockInterviewController.getMockInterviewById
);
mockInterviewRouter.get(
  '/:id/results',
  protect,
  mockInterviewController.getInterviewResults
);
mockInterviewRouter.get(
  '/:id/questions',
  protect,
  mockInterviewController.getMockInterviewQuestions
);
mockInterviewRouter.post(
  '/:id/enhanced-feedback',
  protect,
  requirePlan(PLAN_CODES.PRO),
  checkUsageLimit(USAGE_METRICS.AI_GENERATIONS),
  mockInterviewController.getEnhancedFeedback
);
mockInterviewRouter.get(
  '/:id/skill-gap',
  protect,
  requirePlan(PLAN_CODES.MAX),
  checkUsageLimit(USAGE_METRICS.AI_GENERATIONS),
  mockInterviewController.getSkillGap
);
mockInterviewRouter.put(
  '/update/:id',
  protect,
  mockInterviewController.updateMockInterview
);
mockInterviewRouter.patch(
  '/regenerate-questions/:id',
  protect,
  checkUsageLimit(USAGE_METRICS.QUESTION_REGENERATIONS),
  checkUsageLimit(USAGE_METRICS.AI_GENERATIONS),
  mockInterviewController.regenerateQuestionSet
);
mockInterviewRouter.delete(
  '/delete/:id',
  protect,
  mockInterviewController.deleteMockInterview
);

module.exports = mockInterviewRouter;
