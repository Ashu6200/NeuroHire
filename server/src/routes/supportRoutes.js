const express = require('express');
const { supportController } = require('../controllers');
const { protect, requirePermission } = require('../middlewares');
const { PERMISSIONS } = require('../constants/permissions');

const supportRouter = express.Router();

supportRouter.use(protect);

supportRouter.post('/tickets', supportController.createTicket);
supportRouter.get('/tickets', supportController.getMyTickets);
supportRouter.get('/tickets/:id', supportController.getTicketById);
supportRouter.post('/tickets/:id/messages', supportController.addMessage);
supportRouter.patch(
  '/tickets/:id/status',
  requirePermission(PERMISSIONS.SUPPORT_UPDATE),
  supportController.updateTicketStatus
);
supportRouter.patch(
  '/tickets/:id/assign',
  requirePermission(PERMISSIONS.SUPPORT_UPDATE),
  supportController.assignTicket
);

module.exports = supportRouter;
