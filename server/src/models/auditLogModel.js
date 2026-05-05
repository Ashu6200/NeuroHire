const { default: mongoose } = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: String,
      default: null,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      default: null,
      index: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const AuditLogModel = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLogModel;
