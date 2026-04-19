const express = require('express');
const { mockInterviewController } = require('../controllers');
const { protect } = require('../middlewares');

const mockInterviewRouter = express.Router();

mockInterviewRouter.get(
  '/all',
  protect,
  mockInterviewController.getAllMockInterviews
);
mockInterviewRouter.get(
  '/:id',
  protect,
  mockInterviewController.getMockInterviewById
);
mockInterviewRouter.get(
  '/:id/questions',
  mockInterviewController.getMockInterviewQuestions
);
mockInterviewRouter.post(
  '/create',
  protect,
  mockInterviewController.createMockInterview
);
mockInterviewRouter.put(
  '/update/:id',
  protect,
  mockInterviewController.updateMockInterview
);
mockInterviewRouter.patch(
  '/regenerate-questions/:id',
  protect,
  mockInterviewController.regenerateQuestionSet
);
mockInterviewRouter.delete(
  '/delete/:id',
  protect,
  mockInterviewController.deleteMockInterview
);

module.exports = mockInterviewRouter;
