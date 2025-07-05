import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },

  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },

  phoneNo: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  // ✅ Multiple device token support
  tokens: [{
    token: { type: String, required: true },
    device: { type: String, default: 'Unknown Device' },
    createdAt: { type: Date, default: Date.now },
  }],

  // Optional: single refresh token (can expand if needed)
  refreshToken: { type: String },

  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },

  xander: { type: String },

  color: {
    type: String,
    enum: ['red', 'green', 'pink', 'none'],
    default: 'none',
  },

  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  lastSeen: {
    type: Date,
    default: null,
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ✅ Virtual full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ✅ Clean user output (hide sensitive data)
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  delete user.refreshToken;
  return user;
};

// ✅ Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ✅ Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Indexes
// userSchema.index({ email: 1 });
// userSchema.index({ phoneNo: 1 });
// userSchema.index({ userName: 1 });

const User = mongoose.model('User', userSchema);
export default User;
