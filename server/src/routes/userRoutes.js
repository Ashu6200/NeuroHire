const express = require('express');
const { userController } = require('../controllers');
const { protect } = require('../middlewares');

const userRouter = express.Router();

userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
userRouter.post('/verify-otp', userController.verifyOtp);
userRouter.get('/me', protect, userController.getUserProfile);
userRouter.put('/update-profile', protect, userController.updateUserProfile);
userRouter.delete('/delete-profile', protect, userController.deleteUserProfile);

module.exports = userRouter;
