const crypto = require('crypto');
const Razorpay = require('razorpay');
const { config } = require('../config/config');
const { PLAN_CATALOG, PLAN_CODES } = require('../constants/plans');
const {
  AuditLogModel,
  PaymentModel,
  SubscriptionModel,
  UserModel,
} = require('../models');
const { getNextMonth } = require('./subscriptionService');

let razorpayClient;

const getRazorpayClient = () => {
  if (!config.RAZORPAY_KEY_ID || !config.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are not configured');
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: config.RAZORPAY_KEY_ID,
      key_secret: config.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayClient;
};

const getPlanForBilling = (planCode) => {
  const plan = PLAN_CATALOG[planCode];

  if (!plan || plan.code === PLAN_CODES.FREE) {
    throw new Error('Select a paid plan to create a Razorpay subscription');
  }

  const razorpayPlanId = config.RAZORPAY_PLAN_IDS?.[planCode];
  if (!razorpayPlanId) {
    throw new Error(`Razorpay plan id missing for ${planCode}`);
  }

  return {
    ...plan,
    razorpayPlanId,
  };
};

const verifyRazorpaySignature = (payload, signature, secret) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  const receivedSignature = signature || '';

  if (expectedSignature.length !== receivedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(receivedSignature),
  );
};

const createRazorpaySubscription = async (user, planCode) => {
  const client = getRazorpayClient();
  const plan = getPlanForBilling(planCode);

  const razorpaySubscription = await client.subscriptions.create({
    plan_id: plan.razorpayPlanId,
    total_count: 120,
    quantity: 1,
    notes: {
      userId: user.id,
      planCode,
      app: 'neurohire',
    },
    customer_notify: 1,
  });

  const subscription = await SubscriptionModel.findOneAndUpdate(
    { userId: user.id },
    {
      $set: {
        planCode,
        status: 'pending',
        source: 'razorpay',
        razorpayPlanId: plan.razorpayPlanId,
        razorpaySubscriptionId: razorpaySubscription.id,
        currentPeriodStart: new Date(),
        currentPeriodEnd: getNextMonth(),
        metadata: {
          shortUrl: razorpaySubscription.short_url,
        },
      },
    },
    { new: true, upsert: true },
  );

  await UserModel.findOneAndUpdate(
    { betterAuthUserId: user.id },
    {
      $set: {
        name: user.name,
        email: user.email,
        plan: planCode,
        subscriptionId: subscription._id,
      },
    },
    { upsert: true },
  );

  await AuditLogModel.create({
    actorId: user.id,
    action: 'billing.subscription.created',
    targetType: 'Subscription',
    targetId: String(subscription._id),
    metadata: {
      planCode,
      razorpaySubscriptionId: razorpaySubscription.id,
    },
  });

  return {
    subscription,
    razorpaySubscription,
    plan,
  };
};

const activateSubscriptionFromWebhook = async (payload) => {
  const subscriptionEntity = payload?.payload?.subscription?.entity;
  const paymentEntity = payload?.payload?.payment?.entity;
  const invoiceEntity = payload?.payload?.invoice?.entity;

  const razorpaySubscriptionId =
    subscriptionEntity?.id ||
    paymentEntity?.subscription_id ||
    invoiceEntity?.subscription_id;

  if (!razorpaySubscriptionId) {
    return null;
  }

  const existing = await SubscriptionModel.findOne({
    razorpaySubscriptionId,
  });

  const planCode =
    existing?.planCode ||
    subscriptionEntity?.notes?.planCode ||
    paymentEntity?.notes?.planCode ||
    PLAN_CODES.PRO;
  const userId =
    existing?.userId ||
    subscriptionEntity?.notes?.userId ||
    paymentEntity?.notes?.userId;

  if (!userId) {
    return null;
  }

  const statusByEvent = {
    'subscription.activated': 'active',
    'subscription.charged': 'active',
    'invoice.paid': 'active',
    'payment.captured': 'active',
    'subscription.cancelled': 'cancelled',
    'subscription.completed': 'expired',
    'subscription.halted': 'failed',
    'payment.failed': 'failed',
  };

  const status = statusByEvent[payload.event] || existing?.status || 'pending';
  const periodStart = subscriptionEntity?.current_start
    ? new Date(subscriptionEntity.current_start * 1000)
    : existing?.currentPeriodStart || new Date();
  const periodEnd = subscriptionEntity?.current_end
    ? new Date(subscriptionEntity.current_end * 1000)
    : existing?.currentPeriodEnd || getNextMonth();

  const subscription = await SubscriptionModel.findOneAndUpdate(
    { razorpaySubscriptionId },
    {
      $set: {
        userId,
        planCode,
        status,
        source: 'razorpay',
        razorpayCustomerId:
          subscriptionEntity?.customer_id ||
          paymentEntity?.customer_id ||
          existing?.razorpayCustomerId ||
          null,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        cancelledAt: status === 'cancelled' ? new Date() : null,
      },
    },
    { new: true, upsert: true },
  );

  if (paymentEntity?.id) {
    await PaymentModel.findOneAndUpdate(
      { razorpayPaymentId: paymentEntity.id },
      {
        $set: {
          userId,
          subscriptionId: subscription._id,
          planCode,
          amount: paymentEntity.amount || PLAN_CATALOG[planCode]?.amount || 0,
          currency: paymentEntity.currency || 'INR',
          status: paymentEntity.status || 'captured',
          razorpayPaymentId: paymentEntity.id,
          razorpayOrderId: paymentEntity.order_id || null,
          razorpayInvoiceId: invoiceEntity?.id || paymentEntity.invoice_id,
          razorpaySubscriptionId,
          rawPayload: payload,
        },
      },
      { new: true, upsert: true },
    );
  }

  await UserModel.findOneAndUpdate(
    { betterAuthUserId: userId },
    {
      $set: {
        plan: subscription.planCode,
        subscriptionId: subscription._id,
        razorpayCustomerId: subscription.razorpayCustomerId || null,
      },
    },
  );

  await AuditLogModel.create({
    actorId: userId,
    action: `razorpay.${payload.event}`,
    targetType: 'Subscription',
    targetId: String(subscription._id),
    metadata: {
      razorpaySubscriptionId,
      status,
    },
  });

  return subscription;
};

module.exports = {
  activateSubscriptionFromWebhook,
  createRazorpaySubscription,
  getRazorpayClient,
  verifyRazorpaySignature,
};
