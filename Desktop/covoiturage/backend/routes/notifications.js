// ===================================
// Routes Notifications
// ===================================
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, notificationController.getAll);
router.get('/non-lues', authMiddleware, notificationController.getUnreadCount);
router.put('/tout-lire', authMiddleware, notificationController.markAllAsRead);
router.put('/:id/lire', authMiddleware, notificationController.markAsRead);

module.exports = router;
