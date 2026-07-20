// ===================================
// Routes Utilisateurs
// ===================================
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const { validateModificationProfil } = require('../validators/userValidator');

// Routes protégées pour tous les utilisateurs connectés
router.get('/profil', authMiddleware, userController.getProfil);
router.put('/profil', authMiddleware, validateModificationProfil, userController.updateProfil);
router.put('/devenir-conducteur', authMiddleware, userController.devenirConducteur);

// Routes réservées aux administrateurs
router.get('/', authMiddleware, roleMiddleware('ADMIN'), userController.getAllUsers);
router.put('/:id/toggle-actif', authMiddleware, roleMiddleware('ADMIN'), userController.toggleActif);

module.exports = router;
