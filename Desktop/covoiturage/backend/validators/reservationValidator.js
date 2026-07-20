// ===================================
// Validateurs pour les réservations
// ===================================
const { body } = require('express-validator');

const validateReservation = [
  body('trajet_id')
    .notEmpty().withMessage('L\'identifiant du trajet est obligatoire.')
    .isInt({ min: 1 }).withMessage('L\'identifiant du trajet doit être un nombre valide.'),

  body('nombre_places')
    .optional()
    .isInt({ min: 1, max: 8 }).withMessage('Le nombre de places doit être entre 1 et 8.')
];

module.exports = { validateReservation };
