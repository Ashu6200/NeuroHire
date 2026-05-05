const express = require('express');
const {
  getAllQuestions,
  getQuestionById,
  updateProgress,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.put('/:id/progress', updateProgress);

// Admin routes
router.post('/', authorize('admin', 'super_admin'), createQuestion);
router.put('/:id', authorize('admin', 'super_admin'), updateQuestion);
router.delete('/:id', authorize('admin', 'super_admin'), deleteQuestion);

module.exports = router;
