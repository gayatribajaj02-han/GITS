const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  previewNotificationEmail,
  sendTestAlert,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Public Preview & Live Test Alert endpoints
router.get('/preview-email/:id', previewNotificationEmail);
router.post('/send-test-alert', sendTestAlert);

// Protected routes
router.use(protect);
router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);

module.exports = router;
