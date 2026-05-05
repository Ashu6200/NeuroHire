const { PLAN_CATALOG, PLAN_CODES } = require('../constants/plans');
const { asyncHandler } = require('../middlewares');
const { PaymentModel, SubscriptionModel } = require('../models');
const {
  activateSubscriptionFromWebhook,
  createRazorpaySubscription,
  getRazorpayClient,
  verifyRazorpaySignature,
} = require('../services/razorpayService');
const {
  ensureSubscriptionForUser,
  getEntitlementsForUser,
  getNextMonth,
} = require('../services/subscriptionService');
const { apiError, apiResponse } = require('../utils');
const { config } = require('../config/config');

const getPlans = asyncHandler(async (req, res) => {
  return apiResponse(req, res, 200, 'Plans fetched successfully', {
    plans: Object.values(PLAN_CATALOG),
    razorpayKeyId: config.RAZORPAY_KEY_ID || null,
  });
});

const getMyBilling = asyncHandler(async (req, res) => {
  const entitlements = await getEntitlementsForUser(req.user);
  const payments = await PaymentModel.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(10);

  return apiResponse(req, res, 200, 'Billing details fetched successfully', {
    subscription: entitlements.subscription,
    plan: entitlements.plan,
    usage: entitlements.usage,
    limits: entitlements.limits,
    payments,
  });
});

const createSubscription = asyncHandler(async (req, res, next) => {
  const { planCode } = req.body;

  if (!planCode || !PLAN_CATALOG[planCode]) {
    return apiError(next, new Error('Invalid plan selected'), req, 400);
  }

  if (planCode === PLAN_CODES.FREE) {
    const subscription = await SubscriptionModel.findOneAndUpdate(
      { userId: req.user.id },
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

    return apiResponse(req, res, 200, 'Free plan activated', {
      subscription,
      plan: PLAN_CATALOG.free,
    });
  }

  try {
    const result = await createRazorpaySubscription(req.user, planCode);

    return apiResponse(req, res, 201, 'Razorpay subscription created', {
      subscription: result.subscription,
      razorpaySubscription: {
        id: result.razorpaySubscription.id,
        status: result.razorpaySubscription.status,
        shortUrl: result.razorpaySubscription.short_url,
      },
      plan: result.plan,
      razorpayKeyId: config.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return apiError(next, error, req, 400);
  }
});

const verifyPayment = asyncHandler(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
  } = req.body;

  if (
    !razorpay_payment_id ||
    !razorpay_subscription_id ||
    !razorpay_signature
  ) {
    return apiError(next, new Error('Missing Razorpay payment data'), req, 400);
  }

  const payload = `${razorpay_payment_id}|${razorpay_subscription_id}`;
  const isValid = verifyRazorpaySignature(
    payload,
    razorpay_signature,
    config.RAZORPAY_KEY_SECRET,
  );

  if (!isValid) {
    return apiError(next, new Error('Invalid Razorpay signature'), req, 400);
  }

  const subscription = await SubscriptionModel.findOneAndUpdate(
    {
      userId: req.user.id,
      razorpaySubscriptionId: razorpay_subscription_id,
    },
    {
      $set: {
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: getNextMonth(),
      },
    },
    { new: true },
  );

  if (!subscription) {
    return apiError(next, new Error('Subscription not found'), req, 404);
  }

  await PaymentModel.findOneAndUpdate(
    { razorpayPaymentId: razorpay_payment_id },
    {
      $set: {
        userId: req.user.id,
        subscriptionId: subscription._id,
        planCode: subscription.planCode,
        amount: PLAN_CATALOG[subscription.planCode]?.amount || 0,
        currency: 'INR',
        status: 'captured',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySubscriptionId: razorpay_subscription_id,
      },
    },
    { new: true, upsert: true },
  );

  return apiResponse(req, res, 200, 'Payment verified successfully', {
    subscription,
  });
});

const handleWebhook = asyncHandler(async (req, res, next) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = Buffer.isBuffer(req.body)
    ? req.body.toString('utf8')
    : JSON.stringify(req.body);

  if (!config.RAZORPAY_WEBHOOK_SECRET) {
    return apiError(next, new Error('Razorpay webhook secret missing'), req, 500);
  }

  const isValid = verifyRazorpaySignature(
    rawBody,
    signature,
    config.RAZORPAY_WEBHOOK_SECRET,
  );

  if (!isValid) {
    return apiError(next, new Error('Invalid Razorpay webhook signature'), req, 400);
  }

  const payload = JSON.parse(rawBody);
  const subscription = await activateSubscriptionFromWebhook(payload);

  return apiResponse(req, res, 200, 'Webhook processed', {
    subscription,
  });
});

const cancelSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await ensureSubscriptionForUser(req.user.id, req.user);

  try {
    if (subscription.razorpaySubscriptionId && subscription.status === 'active') {
      await getRazorpayClient().subscriptions.cancel(
        subscription.razorpaySubscriptionId,
        true,
      );
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();

    return apiResponse(req, res, 200, 'Subscription cancelled', {
      subscription,
    });
  } catch (error) {
    return apiError(next, error, req, 400);
  }
});

const changePlan = asyncHandler(async (req, res, next) => {
  return createSubscription(req, res, next);
});

module.exports = {
  cancelSubscription,
  changePlan,
  createSubscription,
  getMyBilling,
  getPlans,
  handleWebhook,
  verifyPayment,
};
