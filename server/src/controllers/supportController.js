const mongoose = require('mongoose');
const { asyncHandler } = require('../middlewares');
const { SupportTicketModel } = require('../models');
const { apiResponse, apiError, BaseError } = require('../utils');
const { hasPermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../constants/permissions');
const { sendNotification, notifySupportUpdate } = require('../services/notificationService');

const createTicket = asyncHandler(async (req, res, next) => {
  const { subject, description, category, priority } = req.body;

  if (!subject || !description || !category) {
    return apiError(next, new Error('subject, description, and category are required'), req, 400);
  }

  const ticket = await SupportTicketModel.create({
    userId: req.user.id,
    subject,
    description,
    category,
    priority: priority || 'low',
    messages: [{ authorId: req.user.id, body: description, isInternal: false }],
  });

  await sendNotification(
    req.user.id,
    'support_ticket_created',
    'Support ticket created',
    `Your ticket #${ticket.ticketNumber} has been received. We will respond shortly.`,
    { ticketId: String(ticket._id), ticketNumber: ticket.ticketNumber }
  );

  return apiResponse(req, res, 201, 'Support ticket created', { ticket });
});

const getMyTickets = asyncHandler(async (req, res) => {
  const isPrivileged = hasPermission(req.user, PERMISSIONS.SUPPORT_READ);

  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip  = (page - 1) * limit;

  const filter = {};
  if (isPrivileged) {
    if (req.query.userId)   filter.userId   = req.query.userId;
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.category) filter.category = req.query.category;
  } else {
    filter.userId = req.user.id;
  }

  const [tickets, total] = await Promise.all([
    SupportTicketModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-messages')
      .lean(),
    SupportTicketModel.countDocuments(filter),
  ]);

  return apiResponse(req, res, 200, 'Tickets fetched', {
    tickets,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

const getTicketById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid ticket ID', 400);
  }

  const ticket = await SupportTicketModel.findById(id).lean();
  if (!ticket) {
    return apiError(next, new Error('Ticket not found'), req, 404);
  }

  const isPrivileged = hasPermission(req.user, PERMISSIONS.SUPPORT_READ);
  if (!isPrivileged && ticket.userId !== req.user.id) {
    return apiError(next, new Error('Forbidden'), req, 403);
  }

  if (!isPrivileged) {
    ticket.messages = ticket.messages.filter((m) => !m.isInternal);
  }

  return apiResponse(req, res, 200, 'Ticket fetched', { ticket });
});

const addMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { body, isInternal } = req.body;

  if (!body) {
    return apiError(next, new Error('Message body is required'), req, 400);
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid ticket ID', 400);
  }

  const ticket = await SupportTicketModel.findById(id);
  if (!ticket) {
    return apiError(next, new Error('Ticket not found'), req, 404);
  }

  const isPrivileged = hasPermission(req.user, PERMISSIONS.SUPPORT_READ);
  if (!isPrivileged && ticket.userId !== req.user.id) {
    return apiError(next, new Error('Forbidden'), req, 403);
  }

  const internalFlag = isPrivileged ? Boolean(isInternal) : false;

  ticket.messages.push({ authorId: req.user.id, body, isInternal: internalFlag });

  if (isPrivileged && ticket.status === 'open') {
    ticket.status = 'in_progress';
  }

  await ticket.save();

  if (isPrivileged && !internalFlag) {
    await notifySupportUpdate(
      ticket.userId,
      String(ticket._id),
      'support_reply',
      `A support agent has replied to your ticket #${ticket.ticketNumber}.`
    );
  }

  return apiResponse(req, res, 200, 'Message added', { ticket });
});

const updateTicketStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const VALID_STATUSES = ['open', 'in_progress', 'resolved', 'closed'];
  if (!status || !VALID_STATUSES.includes(status)) {
    return apiError(next, new Error(`status must be one of: ${VALID_STATUSES.join(', ')}`), req, 400);
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid ticket ID', 400);
  }

  const update = { status };
  if (status === 'resolved') update.resolvedAt = new Date();

  const ticket = await SupportTicketModel.findByIdAndUpdate(id, { $set: update }, { new: true });
  if (!ticket) {
    return apiError(next, new Error('Ticket not found'), req, 404);
  }

  await notifySupportUpdate(
    ticket.userId,
    String(ticket._id),
    'support_status_changed',
    `Your ticket #${ticket.ticketNumber} has been updated to "${status}".`
  );

  return apiResponse(req, res, 200, 'Ticket status updated', { ticket });
});

const assignTicket = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { agentId } = req.body;

  if (!agentId) {
    return apiError(next, new Error('agentId is required'), req, 400);
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BaseError('Invalid ticket ID', 400);
  }

  const ticket = await SupportTicketModel.findByIdAndUpdate(
    id,
    { $set: { assignedTo: agentId } },
    { new: true }
  );
  if (!ticket) {
    return apiError(next, new Error('Ticket not found'), req, 404);
  }

  return apiResponse(req, res, 200, 'Ticket assigned', { ticket });
});

const listAllTickets = asyncHandler(async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const skip  = (page - 1) * limit;

  const filter = {};
  if (req.query.userId)   filter.userId   = req.query.userId;
  if (req.query.status)   filter.status   = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.category) filter.category = req.query.category;

  const [tickets, total] = await Promise.all([
    SupportTicketModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-messages')
      .lean(),
    SupportTicketModel.countDocuments(filter),
  ]);

  return apiResponse(req, res, 200, 'All tickets fetched', {
    tickets,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  addMessage,
  updateTicketStatus,
  assignTicket,
  listAllTickets,
};
