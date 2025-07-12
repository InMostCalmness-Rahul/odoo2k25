const express = require('express');
const router = express.Router();

// Placeholder for admin routes
// TODO: Implement actual admin controller methods and auth middleware

router.get('/users', (req, res) => {
  res.status(501).json({ 
    message: 'Get all users (admin) endpoint - To be implemented',
    endpoint: 'GET /api/admin/users'
  });
});

router.patch('/user/:id/ban', (req, res) => {
  res.status(501).json({ 
    message: 'Ban/unban user endpoint - To be implemented',
    endpoint: 'PATCH /api/admin/user/:id/ban'
  });
});

router.get('/swaps', (req, res) => {
  res.status(501).json({ 
    message: 'Get all swap requests (admin) endpoint - To be implemented',
    endpoint: 'GET /api/admin/swaps'
  });
});

router.get('/reports', (req, res) => {
  res.status(501).json({ 
    message: 'Download activity reports endpoint - To be implemented',
    endpoint: 'GET /api/admin/reports'
  });
});

router.post('/broadcast', (req, res) => {
  res.status(501).json({ 
    message: 'Send broadcast message endpoint - To be implemented',
    endpoint: 'POST /api/admin/broadcast'
  });
});

module.exports = router;
