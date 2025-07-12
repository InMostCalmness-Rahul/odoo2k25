const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('./logger');

class SocketManager {
  constructor() {
    this.io = null;
    this.userSockets = new Map(); // Map user IDs to socket IDs
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
      }
    });

    this.setupMiddleware();
    this.setupConnectionHandlers();
    
    logger.info('Socket.io server initialized');
  }

  setupMiddleware() {
    // Authentication middleware for socket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.userId).select('-password -refreshToken');
        
        if (!user || !user.isActive) {
          return next(new Error('User not found or inactive'));
        }

        socket.userId = user._id.toString();
        socket.user = user;
        next();
      } catch (error) {
        logger.error('Socket authentication error:', error);
        next(new Error('Authentication error'));
      }
    });
  }

  setupConnectionHandlers() {
    this.io.on('connection', (socket) => {
      const userId = socket.userId;
      
      // Store user's socket connection
      this.userSockets.set(userId, socket.id);
      
      logger.info(`User ${userId} connected via socket ${socket.id}`);

      // Join user to their personal room for notifications
      socket.join(`user_${userId}`);

      // Handle user status updates
      socket.on('user_online', () => {
        socket.broadcast.emit('user_status_update', {
          userId: userId,
          status: 'online'
        });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        this.userSockets.delete(userId);
        logger.info(`User ${userId} disconnected`);
        
        socket.broadcast.emit('user_status_update', {
          userId: userId,
          status: 'offline'
        });
      });

      // Handle typing indicators for chat (future feature)
      socket.on('typing_start', (data) => {
        socket.to(`user_${data.recipientId}`).emit('user_typing', {
          userId: userId,
          userName: socket.user.name
        });
      });

      socket.on('typing_stop', (data) => {
        socket.to(`user_${data.recipientId}`).emit('user_stopped_typing', {
          userId: userId
        });
      });
    });
  }

  // Send notification to specific user
  notifyUser(userId, notification) {
    const socketId = this.userSockets.get(userId.toString());
    
    if (socketId) {
      this.io.to(socketId).emit('notification', notification);
      logger.info(`Notification sent to user ${userId}:`, notification);
      return true;
    }
    
    logger.info(`User ${userId} not connected, notification queued`);
    return false;
  }

  // Send notification to multiple users
  notifyUsers(userIds, notification) {
    userIds.forEach(userId => {
      this.notifyUser(userId, notification);
    });
  }

  // Broadcast to all connected users
  broadcast(event, data) {
    this.io.emit(event, data);
    logger.info(`Broadcasting ${event}:`, data);
  }

  // Send real-time update about swap request status
  notifySwapUpdate(swapRequest) {
    const notification = {
      type: 'swap_update',
      title: 'Swap Request Update',
      message: `Your swap request has been ${swapRequest.status}`,
      data: {
        requestId: swapRequest._id,
        status: swapRequest.status,
        otherUser: swapRequest.status === 'accepted' ? swapRequest.toUser : swapRequest.fromUser
      },
      timestamp: new Date()
    };

    // Notify the requester
    this.notifyUser(swapRequest.fromUser._id, notification);

    // If accepted/rejected, also notify the receiver
    if (swapRequest.status !== 'pending') {
      const receiverNotification = {
        ...notification,
        message: `You have ${swapRequest.status} a swap request`,
      };
      this.notifyUser(swapRequest.toUser._id, receiverNotification);
    }
  }

  // Send notification about new swap request
  notifyNewSwapRequest(swapRequest) {
    const notification = {
      type: 'new_swap_request',
      title: 'New Swap Request',
      message: `${swapRequest.fromUser.name} wants to swap skills with you`,
      data: {
        requestId: swapRequest._id,
        fromUser: {
          id: swapRequest.fromUser._id,
          name: swapRequest.fromUser.name,
          profilePhoto: swapRequest.fromUser.profilePhoto
        },
        offeredSkill: swapRequest.offeredSkill,
        requestedSkill: swapRequest.requestedSkill
      },
      timestamp: new Date()
    };

    this.notifyUser(swapRequest.toUser._id, notification);
  }

  // Send notification about new feedback
  notifyNewFeedback(feedback, targetUser, fromUser) {
    const notification = {
      type: 'new_feedback',
      title: 'New Review',
      message: `${fromUser.name} left you a ${feedback.rating}-star review`,
      data: {
        feedbackId: feedback._id,
        rating: feedback.rating,
        fromUser: {
          id: fromUser._id,
          name: fromUser.name,
          profilePhoto: fromUser.profilePhoto
        }
      },
      timestamp: new Date()
    };

    this.notifyUser(targetUser._id, notification);
  }
}

// Export singleton instance
const socketManager = new SocketManager();
module.exports = socketManager;
