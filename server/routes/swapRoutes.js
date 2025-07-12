const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');
const { auth } = require('../middleware/auth');
const { validateSwapRequest, validateSwapStatusUpdate } = require('../middleware/validation');

// All swap routes require authentication
router.use(auth);

// Swap request routes
router.post('/', validateSwapRequest, swapController.createSwapRequest);
router.get('/', swapController.getUserSwapRequests);
router.get('/:requestId', swapController.getSwapRequestById);
router.patch('/:requestId', validateSwapStatusUpdate, swapController.updateSwapRequestStatus);
router.delete('/:requestId', swapController.deleteSwapRequest);

module.exports = router;
