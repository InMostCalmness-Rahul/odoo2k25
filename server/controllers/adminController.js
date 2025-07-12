const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');
const logger = require('../utils/logger');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      status = 'all',
      role = 'all',
      search 
    } = req.query;

    // Build filter
    const filter = {};
    
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    if (role !== 'all') {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users
    const users = await User.find(filter)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await User.countDocuments(filter);

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
    logger.error('Admin get all users error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Ban/unban user
const toggleUserBan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent admin from banning themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot ban yourself'
      });
    }

    // Prevent banning other admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Cannot ban other administrators'
      });
    }

    // Toggle ban status
    const newStatus = !user.isActive;
    user.isActive = newStatus;
    await user.save();

    const action = newStatus ? 'unbanned' : 'banned';
    
    logger.info(`User ${action} by admin: ${userId}${reason ? ` (Reason: ${reason})` : ''}`);

    res.status(200).json({
      success: true,
      message: `User ${action} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });

  } catch (error) {
    logger.error('Admin toggle user ban error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get all swap requests (admin only)
const getAllSwapRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50,
      status = 'all',
      sort = 'newest'
    } = req.query;

    // Build filter
    const filter = {};
    if (status !== 'all') {
      filter.status = status;
    }

    // Build sort
    let sortObj = {};
    switch (sort) {
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'status':
        sortObj = { status: 1, createdAt: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get requests
    const requests = await SwapRequest.find(filter)
      .populate([
        { path: 'fromUser', select: 'name email' },
        { path: 'toUser', select: 'name email' }
      ])
      .sort(sortObj)
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
    logger.error('Admin get all swap requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get platform statistics
const getPlatformStats = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const publicProfiles = await User.countDocuments({ isPublic: true, isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    // Recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo },
      isActive: true
    });

    // Swap request statistics
    const totalRequests = await SwapRequest.countDocuments();
    const pendingRequests = await SwapRequest.countDocuments({ status: 'pending' });
    const acceptedRequests = await SwapRequest.countDocuments({ status: 'accepted' });
    const completedRequests = await SwapRequest.countDocuments({ status: 'completed' });
    
    // Recent requests (last 30 days)
    const recentRequests = await SwapRequest.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Popular skills (top 10 offered)
    const skillsAggregation = await User.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$skillsOffered' },
      { $group: { _id: '$skillsOffered', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          public: publicProfiles,
          admins: adminUsers,
          recent: recentUsers
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          accepted: acceptedRequests,
          completed: completedRequests,
          recent: recentRequests
        },
        popularSkills: skillsAggregation.map(skill => ({
          skill: skill._id,
          count: skill.count
        }))
      }
    });

  } catch (error) {
    logger.error('Admin get platform stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Generate and download activity report
const generateActivityReport = async (req, res) => {
  try {
    const { 
      startDate,
      endDate,
      format = 'json'
    } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    // Get data for the report
    const users = await User.find(
      dateFilter.createdAt ? { createdAt: dateFilter } : {}
    ).select('name email createdAt isActive role location').sort({ createdAt: -1 });

    const requests = await SwapRequest.find(
      Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}
    ).populate([
      { path: 'fromUser', select: 'name email' },
      { path: 'toUser', select: 'name email' }
    ]).sort({ createdAt: -1 });

    const reportData = {
      generatedAt: new Date().toISOString(),
      period: {
        startDate: startDate || 'Beginning',
        endDate: endDate || 'Now'
      },
      summary: {
        totalUsers: users.length,
        totalRequests: requests.length,
        activeUsers: users.filter(u => u.isActive).length,
        completedSwaps: requests.filter(r => r.status === 'completed').length
      },
      users,
      requests
    };

    if (format === 'json') {
      res.status(200).json({
        success: true,
        report: reportData
      });
    } else {
      // For CSV format, you could implement CSV generation here
      res.status(400).json({
        success: false,
        error: 'CSV format not yet implemented'
      });
    }

  } catch (error) {
    logger.error('Admin generate activity report error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Delete user account (hard delete - admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { confirm } = req.body;

    if (!confirm) {
      return res.status(400).json({
        success: false,
        error: 'Confirmation required for user deletion'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete yourself'
      });
    }

    // Prevent deleting other admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete other administrators'
      });
    }

    // Delete related swap requests
    await SwapRequest.deleteMany({
      $or: [{ fromUser: userId }, { toUser: userId }]
    });

    // Delete user
    await User.findByIdAndDelete(userId);

    logger.info(`User hard deleted by admin: ${userId} (${user.email})`);

    res.status(200).json({
      success: true,
      message: 'User and related data deleted successfully'
    });

  } catch (error) {
    logger.error('Admin delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = {
  getAllUsers,
  toggleUserBan,
  getAllSwapRequests,
  getPlatformStats,
  generateActivityReport,
  deleteUser
};
