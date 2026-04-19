const { sendMail, genrateOTP } = require('../helpers');
const { asyncHandler } = require('../middlewares');
const { UserModel } = require('../models');
const { apiError, apiResponse } = require('../utils');

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const isUserExists = await UserModel.findOne({ email: email });
  if (isUserExists) {
    const error = new Error('User already exists');
    return apiError(next, error, req, 400);
  }
  const { otp, otpExpiry } = genrateOTP();
  try {
    const emailSent = await sendMail(email, name, otp, otpExpiry, next, req);
    if (!emailSent) {
      return apiError(
        next,
        new Error('Failed to send verification email'),
        req,
        500
      );
    }
    const user = await UserModel.create({
      name,
      email,
      password,
      verificationCode: otp,
      verificationCodeExpiry: otpExpiry,
    });
    return apiResponse(req, res, 201, 'User registered successfully', { user });
  } catch (error) {
    console.error('Register Error:', error.message);
    return apiError(next, new Error('Registration failed'), req, 500);
  }
});
const verifyOtp = asyncHandler(async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return apiError(next, new Error('Email and OTP are required'), req, 400);
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) return apiError(next, new Error('User not found'), req, 404);

    if (user.isVerified) {
      return apiError(next, new Error('User already verified'), req, 400);
    }

    const isOtpExpired = new Date() > user.verificationCodeExpiry;
    const isOtpInvalid = user.verificationCode !== otp;

    if (isOtpExpired) {
      return apiError(next, new Error('OTP expired'), req, 400);
    }

    if (isOtpInvalid) {
      return apiError(next, new Error('Invalid OTP'), req, 400);
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    const token = user.getSignedJwtToken();

    return apiResponse(req, res, 200, 'User verified successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    return apiError(next, error, req, 500);
  }
});

const resendOtp = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return apiError(next, new Error('Email is required'), req, 400);
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return apiError(next, new Error('User not found'), req, 404);
    }
    if (user.isVerified)
      return apiError(next, new Error('User already verified'), req, 400);

    const { otp, otpExpiry } = genrateOTP();
    user.verificationCode = otp;
    user.verificationCodeExpiry = otpExpiry;
    await user.save();

    try {
      await sendMail(email, user.name, otp, otpExpiry);
    } catch (mailError) {
      console.error('Email sending failed:', mailError);
      return apiError(next, new Error('Failed to send OTP email'), req, 500);
    }

    return apiResponse(req, res, 200, 'OTP resent successfully', {
      email,
      otpSent: true,
    });
  } catch (error) {
    console.error('Error in resendOtp:', error);
    return apiError(next, error, req, 500);
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      const error = new Error('User not found');
      return apiError(next, error, req, 404);
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      return apiError(next, error, req, 401);
    }
    const token = user.getSignedJwtToken();
    return apiResponse(req, res, 200, 'User logged in successfully', {
      user,
      token,
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    return apiError(next, error, req, 500);
  }
});

const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ _id: req.user.id }).select(
      '-password'
    );
    if (!user) {
      const error = new Error('User not found');
      return apiError(next, error, req, 404);
    }
    return apiResponse(req, res, 200, 'User profile fetched successfully', {
      user,
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return apiError(next, error, req, 500);
  }
});
const updateUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      return apiError(next, error, req, 404);
    }
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    return apiResponse(req, res, 200, 'User profile updated successfully', {
      user,
    });
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return apiError(next, error, req, 500);
  }
});
const deleteUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      return apiError(next, error, req, 404);
    }
    await user.remove();
    return apiResponse(req, res, 200, 'User profile deleted successfully');
  } catch (error) {
    console.error('Error in deleteUserProfile:', error);
    return apiError(next, error, req, 500);
  }
});

const userController = {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};

module.exports = userController;
