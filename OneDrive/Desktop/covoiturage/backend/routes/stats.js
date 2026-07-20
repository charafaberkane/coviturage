// ===================================
// Routes Statistiques (Admin)
// ===================================
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/', authMiddleware, roleMiddleware('ADMIN'), statsController.getStats);

module.exports = router;
