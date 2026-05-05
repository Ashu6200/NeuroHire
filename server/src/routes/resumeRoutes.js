const express = require('express');
const resumeController = require('../controllers/resumeController');
const { protect, requirePlan, checkUsageLimit } = require('../middlewares');
const { PLAN_CODES, USAGE_METRICS } = require('../constants/plans');

const resumeRouter = express.Router();

resumeRouter.get('/templates', resumeController.getPublicTemplates);

resumeRouter.get('/', protect, resumeController.getMyResumes);
resumeRouter.post('/', protect, resumeController.createResume);

resumeRouter.post(
  '/templates/:id/use',
  protect,
  resumeController.useTemplate
);

resumeRouter.get('/:id', protect, resumeController.getResumeById);
resumeRouter.put('/:id', protect, resumeController.updateResume);
resumeRouter.delete('/:id', protect, resumeController.deleteResume);
resumeRouter.patch('/:id/publish', protect, resumeController.publishResume);
resumeRouter.patch('/:id/unpublish', protect, resumeController.unpublishResume);

resumeRouter.get(
  '/:id/export-pdf',
  protect,
  requirePlan(PLAN_CODES.PRO),
  checkUsageLimit(USAGE_METRICS.RESUME_EXPORTS),
  resumeController.exportResumePdf
);

module.exports = resumeRouter;
