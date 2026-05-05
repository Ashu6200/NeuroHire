const express = require('express');
const { adminController } = require('../controllers');
const { PERMISSIONS } = require('../constants/permissions');
const { protect, requirePermission } = require('../middlewares');

const adminRouter = express.Router();

adminRouter.use(protect, requirePermission(PERMISSIONS.ADMIN_ACCESS));

adminRouter.get('/dashboard', adminController.getDashboard);
adminRouter.get('/users', requirePermission(PERMISSIONS.USERS_READ), adminController.listUsers);
adminRouter.post('/users/set-role', requirePermission(PERMISSIONS.USERS_UPDATE), adminController.setUserRole);
adminRouter.post('/users/grant-plan', requirePermission(PERMISSIONS.SUBSCRIPTIONS_UPDATE), adminController.grantPlan);
adminRouter.get('/subscriptions', requirePermission(PERMISSIONS.SUBSCRIPTIONS_READ), adminController.listSubscriptions);
adminRouter.get('/payments', requirePermission(PERMISSIONS.PAYMENTS_READ), adminController.listPayments);
adminRouter.get('/usage', requirePermission(PERMISSIONS.USAGE_READ), adminController.listUsage);
adminRouter.get('/audit-logs', requirePermission(PERMISSIONS.ADMIN_ACCESS), adminController.listAuditLogs);

module.exports = adminRouter;
