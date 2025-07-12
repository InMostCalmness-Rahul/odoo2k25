const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { validateProfileUpdate, validateFeedback } = require('../middleware/validation');

// Authenticated user routes (for current user operations)
router.get('/me', auth, userController.getCurrentUser);
router.put('/me', auth, validateProfileUpdate, userController.updateProfile);
router.delete('/me', auth, userController.deleteAccount);

// Public user browsing routes 
router.get('/', userController.getPublicUsers);

// Parameterized routes
router.get('/:userId', userController.getUserById);
router.post('/:userId/feedback', auth, validateFeedback, userController.addFeedback);

module.exports = router;
