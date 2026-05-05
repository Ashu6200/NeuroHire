const express = require('express');
const { userController } = require('../controllers');
const { protect } = require('../middlewares');

const userRouter = express.Router();

userRouter.get('/me', protect, userController.getUserProfile);
userRouter.put('/update-profile', protect, userController.updateUserProfile);
userRouter.delete('/delete-profile', protect, userController.deleteUserProfile);

module.exports = userRouter;
