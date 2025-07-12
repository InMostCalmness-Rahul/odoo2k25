const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(auth);
router.use(requireAdmin);

// Admin routes
router.get('/users', adminController.getAllUsers);
router.patch('/user/:userId/ban', adminController.toggleUserBan);
router.delete('/user/:userId', adminController.deleteUser);
router.get('/swaps', adminController.getAllSwapRequests);
router.get('/stats', adminController.getPlatformStats);
router.get('/reports', adminController.generateActivityReport);

module.exports = router;
