const { PLAN_CATALOG } = require('../constants/plans');
const { asyncHandler } = require('../middlewares');
const { getAuth, getHeadersFromRequest } = require('../lib/auth');
const {
  AuditLogModel,
  PaymentModel,
  SubscriptionModel,
  UsageModel,
  UserModel,
} = require('../models');
const { getNextMonth } = require('../services/subscriptionService');
const { apiError, apiResponse } = require('../utils');

const getDashboard = asyncHandler(async (req, res) => {
  const [users, activeSubscriptions, payments, usageRows] = await Promise.all([
    UserModel.countDocuments({ status: { $ne: 'deleted' } }),
    SubscriptionModel.countDocuments({ status: 'active' }),
    PaymentModel.find({ status: 'captured' }).sort({ createdAt: -1 }).limit(5),
    UsageModel.find().sort({ updatedAt: -1 }).limit(5),
  ]);

  return apiResponse(req, res, 200, 'Admin dashboard fetched successfully', {
    users,
    activeSubscriptions,
    recentPayments: payments,
    recentUsage: usageRows,
  });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find()
    .sort({ createdAt: -1 })
    .limit(Number(req.query.limit) || 100);

  return apiResponse(req, res, 200, 'Users fetched successfully', { users });
});

const listSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await SubscriptionModel.find()
    .sort({ createdAt: -1 })
    .limit(Number(req.query.limit) || 100);

  return apiResponse(req, res, 200, 'Subscriptions fetched successfully', {
    subscriptions,
  });
});

const listPayments = asyncHandler(async (req, res) => {
  const payments = await PaymentModel.find()
    .sort({ createdAt: -1 })
    .limit(Number(req.query.limit) || 100);

  return apiResponse(req, res, 200, 'Payments fetched successfully', {
    payments,
  });
});

const listUsage = asyncHandler(async (req, res) => {
  const usage = await UsageModel.find()
    .sort({ updatedAt: -1 })
    .limit(Number(req.query.limit) || 100);

  return apiResponse(req, res, 200, 'Usage fetched successfully', { usage });
});

const listAuditLogs = asyncHandler(async (req, res) => {
  const auditLogs = await AuditLogModel.find()
    .sort({ createdAt: -1 })
    .limit(Number(req.query.limit) || 100);

  return apiResponse(req, res, 200, 'Audit logs fetched successfully', {
    auditLogs,
  });
});

const grantPlan = asyncHandler(async (req, res, next) => {
  const { userId, planCode } = req.body;

  if (!userId || !PLAN_CATALOG[planCode]) {
    return apiError(next, new Error('userId and valid planCode are required'), req, 400);
  }

  const subscription = await SubscriptionModel.findOneAndUpdate(
    { userId },
    {
      $set: {
        planCode,
        status: 'active',
        source: 'internal',
        currentPeriodStart: new Date(),
        currentPeriodEnd: getNextMonth(),
        cancelledAt: null,
      },
    },
    { new: true, upsert: true },
  );

  await UserModel.findOneAndUpdate(
    { betterAuthUserId: userId },
    {
      $set: {
        plan: planCode,
        subscriptionId: subscription._id,
      },
    },
  );

  await AuditLogModel.create({
    actorId: req.user.id,
    action: 'admin.plan.granted',
    targetType: 'User',
    targetId: userId,
    metadata: { planCode },
  });

  return apiResponse(req, res, 200, 'Plan granted successfully', {
    subscription,
  });
});

const setUserRole = asyncHandler(async (req, res, next) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return apiError(next, new Error('userId and role are required'), req, 400);
  }

  const auth = await getAuth();
  const headers = await getHeadersFromRequest(req);

  await auth.api.setRole({
    body: {
      userId,
      role,
    },
    headers,
  });

  const user = await UserModel.findOneAndUpdate(
    { betterAuthUserId: userId },
    { $set: { role } },
    { new: true },
  );

  await AuditLogModel.create({
    actorId: req.user.id,
    action: 'admin.user.role_set',
    targetType: 'User',
    targetId: userId,
    metadata: { role },
  });

  return apiResponse(req, res, 200, 'User role updated successfully', { user });
});

module.exports = {
  getDashboard,
  grantPlan,
  listAuditLogs,
  listPayments,
  listSubscriptions,
  listUsage,
  listUsers,
  setUserRole,
};
