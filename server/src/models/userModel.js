const { default: mongoose } = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['user', 'support', 'billing_admin', 'admin', 'super_admin'],
      default: 'user',
    },
    permissions: {
      type: [String],
      default: [],
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'max'],
      default: 'free',
    },
    razorpayCustomerId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active',
    },
    lastLoginAt: {
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
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
