const { PLAN_CATALOG, PLAN_CODES, PLAN_RANK } = require('../constants/plans');
const {
  PlanModel,
  SubscriptionModel,
  UsageModel,
  UserModel,
} = require('../models');

const getPeriodKey = (date = new Date()) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const getNextMonth = (date = new Date()) => {
  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + 1);
  return next;
};

const seedPlans = async () => {
  await Promise.all(
    Object.values(PLAN_CATALOG).map((plan) =>
      PlanModel.findOneAndUpdate(
        { code: plan.code },
        {
          $set: {
            name: plan.name,
            description: plan.description,
            amount: plan.amount,
            currency: plan.currency,
            interval: plan.interval,
            limits: plan.limits,
            features: plan.features,
            isActive: true,
          },
          $setOnInsert: {
            razorpayPlanId: null,
          },
        },
        { new: true, upsert: true },
      ),
    ),
  );
};

// Removed syncUserProfile as Better-Auth now handles the users collection directly.
// We only update application-specific fields like plan and subscriptionId in ensureSubscriptionForUser.

const ensureSubscriptionForUser = async (userId, user = null) => {
  const now = new Date();
  let subscription = await SubscriptionModel.findOne({
    userId,
    status: { $in: ['active', 'pending'] },
    currentPeriodEnd: { $gt: now },
  }).sort({ createdAt: -1 });

  if (!subscription) {
    subscription = await SubscriptionModel.create({
      userId,
      planCode: PLAN_CODES.FREE,
      status: 'active',
      source: 'internal',
      currentPeriodStart: now,
      currentPeriodEnd: getNextMonth(now),
    });
  }

  if (user) {
    await UserModel.updateOne(
      { id: userId },
      {
        $set: {
          plan: subscription.planCode,
          subscriptionId: subscription._id,
          status: user.banned ? 'suspended' : 'active',
        },
      },
    );
  }

  return subscription;
};

const getUsageForUser = async (userId, planCode, subscriptionId, periodStart) => {
  const period = getPeriodKey(periodStart || new Date());
  const subId = String(subscriptionId);

  return UsageModel.findOneAndUpdate(
    { userId, subscriptionId: subId },
    {
      $setOnInsert: {
        userId,
        subscriptionId: subId,
        period,
        planAtTime: planCode,
        metrics: {},
      },
    },
    { new: true, upsert: true },
  );
};

const getEntitlementsForUser = async (user) => {
  const subscription = await ensureSubscriptionForUser(user.id, user);
  const plan = PLAN_CATALOG[subscription.planCode] || PLAN_CATALOG.free;
  const usage = await getUsageForUser(user.id, subscription.planCode, subscription._id, subscription.currentPeriodStart);

  return {
    subscription,
    plan,
    usage,
    limits: plan.limits,
  };
};

const assertPlanAtLeast = (currentPlanCode, requiredPlanCode) => {
  const currentRank = PLAN_RANK[currentPlanCode] ?? 0;
  const requiredRank = PLAN_RANK[requiredPlanCode] ?? 0;
  return currentRank >= requiredRank;
};

const canConsumeUsage = async (user, metric, amount = 1) => {
  const entitlements = await getEntitlementsForUser(user);
  const used = entitlements.usage.metrics?.[metric] || 0;
  const limit = entitlements.limits?.[metric];

  if (typeof limit === 'number' && used + amount > limit) {
    return {
      allowed: false,
      used,
      limit,
      metric,
      plan: entitlements.plan,
      subscription: entitlements.subscription,
      usage: entitlements.usage,
    };
  }

  return {
    allowed: true,
    used,
    limit,
    metric,
    plan: entitlements.plan,
    subscription: entitlements.subscription,
    usage: entitlements.usage,
  };
};

const consumeUsage = async (user, metric, amount = 1) => {
  const entitlements = await getEntitlementsForUser(user);
  const subscriptionId = String(entitlements.subscription._id);

  return UsageModel.findOneAndUpdate(
    { userId: user.id, subscriptionId },
    {
      $inc: {
        [`metrics.${metric}`]: amount,
      },
      $set: {
        planAtTime: entitlements.subscription.planCode,
      },
    },
    { new: true, upsert: true },
  );
};

module.exports = {
  assertPlanAtLeast,
  canConsumeUsage,
  consumeUsage,
  ensureSubscriptionForUser,
  getEntitlementsForUser,
  getNextMonth,
  getPeriodKey,
  seedPlans,
};
