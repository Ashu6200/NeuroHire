const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const CounterModel = mongoose.model('Counter', CounterSchema);

const messageSchema = new mongoose.Schema(
  {
    authorId: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      maxlength: 200,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'low',
    },
    category: {
      type: String,
      enum: ['billing', 'technical', 'general', 'account'],
      required: true,
    },
    assignedTo: {
      type: String,
      default: null,
    },
    messages: [messageSchema],
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

supportTicketSchema.index({ status: 1, createdAt: -1 });
supportTicketSchema.index({ userId: 1, createdAt: -1 });

supportTicketSchema.pre('validate', async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await CounterModel.findOneAndUpdate(
      { _id: 'supportTicket' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.ticketNumber = `TKT-${String(counter.seq).padStart(6, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

const SupportTicketModel = mongoose.model('SupportTicket', supportTicketSchema);

module.exports = SupportTicketModel;
