// ===================================
// Routes Authentification
// ===================================
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { validateInscription, validateConnexion } = require('../validators/authValidator');

router.post('/inscription', validateInscription, authController.inscription);
router.post('/connexion', validateConnexion, authController.connexion);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
