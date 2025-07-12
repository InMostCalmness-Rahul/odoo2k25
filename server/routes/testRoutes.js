const express = require('express');
const router = express.Router();

// Simple test routes without any complex middleware
router.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

module.exports = router;
