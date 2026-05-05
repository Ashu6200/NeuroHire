const express = require('express');
const { billingController } = require('../controllers');
const { protect } = require('../middlewares');

const billingRouter = express.Router();

billingRouter.get('/plans', billingController.getPlans);
billingRouter.post('/webhook', billingController.handleWebhook);
billingRouter.get('/me', protect, billingController.getMyBilling);
billingRouter.post(
  '/create-subscription',
  protect,
  billingController.createSubscription,
);
billingRouter.post('/verify-payment', protect, billingController.verifyPayment);
billingRouter.post('/cancel', protect, billingController.cancelSubscription);
billingRouter.post('/change-plan', protect, billingController.changePlan);

module.exports = billingRouter;
