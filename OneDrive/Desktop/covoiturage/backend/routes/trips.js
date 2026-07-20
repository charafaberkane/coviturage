// ===================================
// Routes Trajets
// ===================================
const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const { validateTrajet } = require('../validators/tripValidator');

// Tout le monde (connecté) peut chercher ou voir un trajet
router.get('/', authMiddleware, tripController.getAll);
router.get('/:id', authMiddleware, tripController.getById);

// Routes spécifiques aux conducteurs
router.post('/', authMiddleware, roleMiddleware('CONDUCTEUR', 'ADMIN'), validateTrajet, tripController.create);
router.get('/mes/conducteur', authMiddleware, roleMiddleware('CONDUCTEUR'), tripController.getMyTrips);
router.put('/:id', authMiddleware, roleMiddleware('CONDUCTEUR', 'ADMIN'), validateTrajet, tripController.update);
router.put('/:id/annuler', authMiddleware, roleMiddleware('CONDUCTEUR', 'ADMIN'), tripController.cancel);
router.delete('/:id', authMiddleware, roleMiddleware('CONDUCTEUR', 'ADMIN'), tripController.delete);

module.exports = router;
