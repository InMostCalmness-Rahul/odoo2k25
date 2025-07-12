const User = require('../models/User');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user.toSafeObject()
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
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

    const userId = req.user._id;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.email;
    delete updates.role;
    delete updates.refreshToken;
    delete updates.isActive;

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    logger.info(`User profile updated: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toSafeObject()
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get public users (search functionality)
const getPublicUsers = async (req, res) => {
  try {
    const { 
      skill, 
      location, 
      availability, 
      page = 1, 
      limit = 20,
      sort = 'rating'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (skill) {
      filter.$or = [
        { skillsOffered: { $regex: skill, $options: 'i' } },
        { skillsWanted: { $regex: skill, $options: 'i' } }
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (availability) {
      filter.availability = { $in: [availability] };
    }

    // Exclude current user from results
    if (req.user) {
      filter._id = { $ne: req.user._id };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'rating':
        sortObj = { rating: -1, feedbackCount: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'name':
        sortObj = { name: 1 };
        break;
      default:
        sortObj = { rating: -1 };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users
    const users = await User.findPublicUsers(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('name location skillsOffered skillsWanted availability rating feedbackCount profilePhoto createdAt');

    // Get total count for pagination
    const total = await User.countDocuments({ 
      ...filter, 
      isPublic: true, 
      isActive: true 
    });

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    logger.error('Get public users error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get user by ID (public profile)
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ 
      _id: userId, 
      isPublic: true, 
      isActive: true 
    }).select('name location skillsOffered skillsWanted availability rating feedbackCount profilePhoto createdAt feedbacks');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found or profile is private'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    logger.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Add feedback to a user
const addFeedback = async (req, res) => {
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

    const { userId } = req.params;
    const { rating, comment } = req.body;
    const fromUserId = req.user._id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user is trying to rate themselves
    if (userId === fromUserId.toString()) {
      return res.status(400).json({
        success: false,
        error: 'You cannot rate yourself'
      });
    }

    // Check if user has already rated this user
    const existingFeedback = user.feedbacks.find(
      feedback => feedback.from.toString() === fromUserId.toString()
    );

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        error: 'You have already rated this user'
      });
    }

    // Add feedback
    user.feedbacks.push({
      from: fromUserId,
      rating,
      comment: comment || ''
    });

    // Update user rating
    user.updateRating();
    await user.save();

    logger.info(`Feedback added by ${req.user.email} for user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Feedback added successfully'
    });

  } catch (error) {
    logger.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Upload profile photo
const uploadProfilePhoto = async (req, res) => {
  res.status(501).json({
    success: false,
    error: 'Photo upload feature temporarily disabled'
  });
};

// Delete user account (soft delete)
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Soft delete by setting isActive to false
    await User.findByIdAndUpdate(userId, { isActive: false });

    logger.info(`User account deleted: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = {
  getCurrentUser,
  updateProfile,
  getPublicUsers,
  getUserById,
  addFeedback,
  uploadProfilePhoto,
  deleteAccount
};
