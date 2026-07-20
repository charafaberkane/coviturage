// ===================================
// Routes Réservations
// ===================================
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const { validateReservation } = require('../validators/reservationValidator');

// Routes passagers
router.post('/', authMiddleware, validateReservation, reservationController.create);
router.get('/mes-reservations', authMiddleware, reservationController.getMyReservations);
router.put('/:id/annuler', authMiddleware, reservationController.cancel);

// Routes conducteurs
router.get('/conducteur', authMiddleware, roleMiddleware('CONDUCTEUR'), reservationController.getDriverReservations);
router.put('/:id/accepter', authMiddleware, roleMiddleware('CONDUCTEUR'), reservationController.accept);
router.put('/:id/refuser', authMiddleware, roleMiddleware('CONDUCTEUR'), reservationController.reject);

module.exports = router;
