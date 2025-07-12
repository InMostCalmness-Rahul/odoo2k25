const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // prevent password in query results by default
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  skillsOffered: [{
    type: String,
    trim: true,
    maxlength: [100, 'Skill name cannot exceed 100 characters']
  }],
  skillsWanted: [{
    type: String,
    trim: true,
    maxlength: [100, 'Skill name cannot exceed 100 characters']
  }],
  availability: [{
    type: String,
    enum: ['weekdays', 'weekends', 'evenings', 'mornings', 'afternoons', 'flexible'],
    trim: true
  }],
  profilePhoto: {
    type: String,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  feedbacks: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  refreshToken: {
    type: String,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ skillsOffered: 1 });
userSchema.index({ skillsWanted: 1 });
userSchema.index({ location: 1 });
userSchema.index({ isPublic: 1, isActive: 1 });

// Virtual for feedback count
userSchema.virtual('feedbackCount').get(function() {
  return this.feedbacks ? this.feedbacks.length : 0;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate and update rating
userSchema.methods.updateRating = function() {
  if (this.feedbacks && this.feedbacks.length > 0) {
    const totalRating = this.feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    this.rating = Math.round((totalRating / this.feedbacks.length) * 10) / 10; // Round to 1 decimal
  } else {
    this.rating = 0;
  }
};

// Static method to find public users
userSchema.statics.findPublicUsers = function(filter = {}) {
  return this.find({ 
    ...filter, 
    isPublic: true, 
    isActive: true 
  }).select('-refreshToken');
};

// Instance method to get safe user data (exclude sensitive fields)
userSchema.methods.toSafeObject = function() {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.refreshToken;
  return userObj;
};

module.exports = mongoose.model('User', userSchema);
