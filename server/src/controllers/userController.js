const { asyncHandler } = require('../middlewares');
const { apiResponse, BaseError } = require('../utils');
const { getAuth } = require('../lib/auth');

const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) throw new BaseError('User not found', 404);
  return apiResponse(req, res, 200, 'User profile fetched successfully', { user: req.user });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  const updateData = {};
  if (name) updateData.name = name;
  if (image) updateData.image = image;

  const auth = await getAuth();
  const user = await auth.api.updateUser({
    body: updateData,
    headers: new Headers(req.headers),
  });

  return apiResponse(req, res, 200, 'User profile updated successfully', { user });
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  const auth = await getAuth();
  await auth.api.deleteUser({
    body: { password: req.body?.password },
    headers: new Headers(req.headers),
  });

  return apiResponse(req, res, 200, 'User profile deleted successfully');
});

const userController = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};

module.exports = userController;
