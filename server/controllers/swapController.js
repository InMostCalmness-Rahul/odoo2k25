const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Create a new swap request
const createSwapRequest = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { toUser, offeredSkill, requestedSkill, message, scheduledDate, duration, meetingType, meetingDetails } = req.body;
    const fromUser = req.user._id;

    // Check if user is trying to send request to themselves
    if (fromUser.toString() === toUser) {
      return res.status(400).json({
        success: false,
        error: 'You cannot send a swap request to yourself'
      });
    }

    // Check if target user exists and is active
    const targetUser = await User.findOne({ _id: toUser, isActive: true });
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: 'Target user not found or inactive'
      });
    }

    // Check if target user is public or if current user has permission to contact them
    if (!targetUser.isPublic) {
      return res.status(403).json({
        success: false,
        error: 'Cannot send request to private profile'
      });
    }

    // Check if user offers the requested skill
    if (!req.user.skillsOffered.includes(offeredSkill)) {
      return res.status(400).json({
        success: false,
        error: 'You must offer this skill in your profile to include it in a swap request'
      });
    }

    // Check if target user offers the requested skill
    if (!targetUser.skillsOffered.includes(requestedSkill)) {
      return res.status(400).json({
        success: false,
        error: 'Target user does not offer the requested skill'
      });
    }

    // Check for existing pending request
    const existingRequest = await SwapRequest.findOne({
      fromUser,
      toUser,
      offeredSkill,
      requestedSkill,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        error: 'You already have a pending request for this skill exchange'
      });
    }

    // Create swap request
    const swapRequest = new SwapRequest({
      fromUser,
      toUser,
      offeredSkill,
      requestedSkill,
      message: message || '',
      scheduledDate,
      duration,
      meetingType: meetingType || 'online',
      meetingDetails
    });

    await swapRequest.save();

    // Populate user details for response
    await swapRequest.populate([
      { path: 'fromUser', select: 'name email profilePhoto' },
      { path: 'toUser', select: 'name email profilePhoto' }
    ]);

    logger.info(`Swap request created: ${fromUser} -> ${toUser}`);

    res.status(201).json({
      success: true,
      message: 'Swap request created successfully',
      swapRequest
    });

  } catch (error) {
    logger.error('Create swap request error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get user's swap requests (sent and received)
const getUserSwapRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type = 'all', status, page = 1, limit = 20 } = req.query;

    // Build filter
    let filter = {};
    
    if (type === 'sent') {
      filter.fromUser = userId;
    } else if (type === 'received') {
      filter.toUser = userId;
    } else {
      filter.$or = [{ fromUser: userId }, { toUser: userId }];
    }

    if (status) {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get requests
    const requests = await SwapRequest.find(filter)
      .populate([
        { path: 'fromUser', select: 'name email profilePhoto' },
        { path: 'toUser', select: 'name email profilePhoto' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await SwapRequest.countDocuments(filter);

    res.status(200).json({
      success: true,
      requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalRequests: total,
        hasNext: skip + requests.length < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    logger.error('Get user swap requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get swap request by ID
const getSwapRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await SwapRequest.findOne({
      _id: requestId,
      $or: [{ fromUser: userId }, { toUser: userId }]
    }).populate([
      { path: 'fromUser', select: 'name email profilePhoto location' },
      { path: 'toUser', select: 'name email profilePhoto location' }
    ]);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Swap request not found'
      });
    }

    res.status(200).json({
      success: true,
      request
    });

  } catch (error) {
    logger.error('Get swap request by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Update swap request status
const updateSwapRequestStatus = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { requestId } = req.params;
    const { status, rejectionReason, cancellationReason } = req.body;
    const userId = req.user._id;

    // Find the request
    const request = await SwapRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Swap request not found'
      });
    }

    // Check permissions based on status update
    if (status === 'accepted' || status === 'rejected') {
      // Only the recipient can accept or reject
      if (request.toUser.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Only the recipient can accept or reject a request'
        });
      }
    } else if (status === 'cancelled') {
      // Only the sender can cancel (and only if pending)
      if (request.fromUser.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Only the sender can cancel a request'
        });
      }
    } else if (status === 'completed') {
      // Either party can mark as completed (if accepted)
      if (request.fromUser.toString() !== userId.toString() && 
          request.toUser.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Only parties involved can mark request as completed'
        });
      }
      if (request.status !== 'accepted') {
        return res.status(400).json({
          success: false,
          error: 'Only accepted requests can be marked as completed'
        });
      }
    }

    // Check current status transitions
    if (request.status !== 'pending' && status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Can only update pending requests (except to mark as completed)'
      });
    }

    // Update the request
    const updates = { status };
    
    if (status === 'accepted') {
      updates.acceptedAt = new Date();
    } else if (status === 'rejected') {
      updates.rejectedAt = new Date();
      if (rejectionReason) {
        updates.rejectionReason = rejectionReason;
      }
    } else if (status === 'cancelled') {
      updates.cancelledAt = new Date();
      if (cancellationReason) {
        updates.cancellationReason = cancellationReason;
      }
    } else if (status === 'completed') {
      updates.completedAt = new Date();
    }

    const updatedRequest = await SwapRequest.findByIdAndUpdate(
      requestId,
      { $set: updates },
      { new: true }
    ).populate([
      { path: 'fromUser', select: 'name email profilePhoto' },
      { path: 'toUser', select: 'name email profilePhoto' }
    ]);

    logger.info(`Swap request ${requestId} status updated to ${status}`);

    res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      request: updatedRequest
    });

  } catch (error) {
    logger.error('Update swap request status error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Delete swap request
const deleteSwapRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await SwapRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Swap request not found'
      });
    }

    // Only sender can delete and only if pending or rejected
    if (request.fromUser.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Only the sender can delete a request'
      });
    }

    if (!['pending', 'rejected'].includes(request.status)) {
      return res.status(400).json({
        success: false,
        error: 'Can only delete pending or rejected requests'
      });
    }

    await SwapRequest.findByIdAndDelete(requestId);

    logger.info(`Swap request ${requestId} deleted by user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Request deleted successfully'
    });

  } catch (error) {
    logger.error('Delete swap request error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = {
  createSwapRequest,
  getUserSwapRequests,
  getSwapRequestById,
  updateSwapRequestStatus,
  deleteSwapRequest
};
