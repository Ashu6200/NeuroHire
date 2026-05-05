const { responseMessage } = require('../constants');
const { ROLE_PERMISSIONS } = require('../constants/permissions');
const { PLAN_CODES } = require('../constants/plans');
const { getSessionFromRequest } = require('../lib/auth');
const {
  assertPlanAtLeast,
  canConsumeUsage,
  ensureSubscriptionForUser,
} = require('../services/subscriptionService');
const { apiError } = require('../utils');
const asyncHandler = require('./asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  try {
    const session = await getSessionFromRequest(req);

    if (!session?.user) {
      return apiError(next, new Error(responseMessage.UNAUTHORIZED), req, 401);
    }

    if (session.user.banned) {
      return apiError(
        next,
        new Error(session.user.banReason || responseMessage.FORBIDDEN),
        req,
        403
      );
    }

    req.authSession = session.session;
    req.user = {
      id: session.user.id,
      role: session.user.role || 'user',
      email: session.user.email,
      isVerified: session.user.emailVerified,
      name: session.user.name,
    };

    const subscription = await ensureSubscriptionForUser(
      req.user.id,
      req.user,
    );
    req.user.plan = subscription.planCode;
    req.user.subscription = {
      id: subscription._id,
      planCode: subscription.planCode,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
    };

    next();
  } catch (error) {
    return apiError(next, error, req, 401);
  }
});

const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user || !req.user.role) {
      return apiError(next, new Error(responseMessage.UNAUTHORIZED), req, 401);
    }
    const userRoles = String(req.user.role)
      .split(',')
      .map((role) => role.trim());
    if (!roles.some((role) => userRoles.includes(role))) {
      return apiError(next, new Error(responseMessage.FORBIDDEN), req, 403);
    }
    next();
  };
};

const getUserRoles = (user) =>
  String(user?.role || 'user')
    .split(',')
    .map((role) => role.trim())
    .filter(Boolean);

const ADMIN_ROLES = ['admin', 'super_admin', 'support', 'billing_admin'];
const isAdminUser = (user) =>
  getUserRoles(user).some((r) => ADMIN_ROLES.includes(r));

const getPermissionsForUser = (user) => {
  const roles = getUserRoles(user);
  const permissions = new Set(user?.permissions || []);

  roles.forEach((role) => {
    (ROLE_PERMISSIONS[role] || []).forEach((permission) => {
      permissions.add(permission);
    });
  });

  return permissions;
};

const hasPermission = (user, permission) => {
  const permissions = getPermissionsForUser(user);
  return permissions.has('*') || permissions.has(permission);
};

const requirePermission = (permission) => {
  return (req, _res, next) => {
    if (!req.user) {
      return apiError(next, new Error(responseMessage.UNAUTHORIZED), req, 401);
    }

    if (!hasPermission(req.user, permission)) {
      return apiError(next, new Error(responseMessage.FORBIDDEN), req, 403);
    }

    next();
  };
};

const requirePlan = (planCode = PLAN_CODES.PRO) => {
  return (req, _res, next) => {
    if (!req.user) {
      return apiError(next, new Error(responseMessage.UNAUTHORIZED), req, 401);
    }

    if (isAdminUser(req.user)) {
      return next();
    }

    if (!assertPlanAtLeast(req.user.plan, planCode)) {
      return apiError(
        next,
        new Error(`Upgrade to ${planCode} to use this feature`),
        req,
        402,
      );
    }

    next();
  };
};

const checkUsageLimit = (metric, amount = 1) =>
  asyncHandler(async (req, _res, next) => {
    if (isAdminUser(req.user)) {
      return next();
    }

    const result = await canConsumeUsage(req.user, metric, amount);

    if (!result.allowed) {
      return apiError(
        next,
        new Error(
          `Monthly ${metric} limit reached for ${result.plan.name}. Upgrade to continue.`,
        ),
        req,
        402,
      );
    }

    req.usageCheck = {
      ...(req.usageCheck || {}),
      [metric]: result,
    };
    next();
  });
module.exports = {
  protect,
  authorize,
  checkUsageLimit,
  hasPermission,
  requirePermission,
  requirePlan,
};
