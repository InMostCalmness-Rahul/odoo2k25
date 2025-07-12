const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'From user is required']
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'To user is required']
  },
  offeredSkill: {
    type: String,
    required: [true, 'Offered skill is required'],
    trim: true,
    maxlength: [100, 'Offered skill cannot exceed 100 characters']
  },
  requestedSkill: {
    type: String,
    required: [true, 'Requested skill is required'],
    trim: true,
    maxlength: [100, 'Requested skill cannot exceed 100 characters']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  acceptedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },
  cancellationReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
  },
  // Additional metadata
  scheduledDate: {
    type: Date,
    default: null
  },
  duration: {
    type: String,
    trim: true,
    maxlength: [100, 'Duration cannot exceed 100 characters']
  },
  meetingType: {
    type: String,
    enum: ['online', 'in-person', 'hybrid'],
    default: 'online'
  },
  meetingDetails: {
    type: String,
    trim: true,
    maxlength: [500, 'Meeting details cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
swapRequestSchema.index({ fromUser: 1, status: 1 });
swapRequestSchema.index({ toUser: 1, status: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });
swapRequestSchema.index({ fromUser: 1, toUser: 1 });

// Compound index to prevent duplicate pending requests
swapRequestSchema.index(
  { fromUser: 1, toUser: 1, offeredSkill: 1, requestedSkill: 1, status: 1 },
  { 
    unique: true,
    partialFilterExpression: { status: 'pending' }
  }
);

// Validate that fromUser and toUser are different
swapRequestSchema.pre('save', function(next) {
  if (this.fromUser.toString() === this.toUser.toString()) {
    return next(new Error('Cannot create swap request with yourself'));
  }
  next();
});

// Update timestamp fields based on status changes
swapRequestSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'accepted':
        if (!this.acceptedAt) this.acceptedAt = now;
        break;
      case 'rejected':
        if (!this.rejectedAt) this.rejectedAt = now;
        break;
      case 'completed':
        if (!this.completedAt) this.completedAt = now;
        break;
      case 'cancelled':
        if (!this.cancelledAt) this.cancelledAt = now;
        break;
    }
  }
  next();
});

// Virtual for request age in days
swapRequestSchema.virtual('ageInDays').get(function() {
  return Math.ceil((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Static method to find requests by user
swapRequestSchema.statics.findByUser = function(userId, role = 'both') {
  let query = {};
  
  if (role === 'sender') {
    query.fromUser = userId;
  } else if (role === 'receiver') {
    query.toUser = userId;
  } else {
    query = { $or: [{ fromUser: userId }, { toUser: userId }] };
  }
  
  return this.find(query)
    .populate('fromUser', 'name email profilePhoto')
    .populate('toUser', 'name email profilePhoto')
    .sort({ createdAt: -1 });
};

// Static method to find pending requests for a user
swapRequestSchema.statics.findPendingForUser = function(userId) {
  return this.find({ 
    toUser: userId, 
    status: 'pending' 
  })
    .populate('fromUser', 'name email profilePhoto skillsOffered')
    .sort({ createdAt: -1 });
};

// Method to check if request can be modified
swapRequestSchema.methods.canBeModified = function() {
  return ['pending'].includes(this.status);
};

// Method to check if request can be cancelled
swapRequestSchema.methods.canBeCancelled = function() {
  return ['pending', 'accepted'].includes(this.status);
};

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
