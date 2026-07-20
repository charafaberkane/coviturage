// ===================================
// Validateurs pour les trajets
// ===================================
const { body } = require('express-validator');

const validateTrajet = [
  body('depart')
    .trim()
    .notEmpty().withMessage('Le lieu de départ est obligatoire.')
    .isLength({ max: 255 }).withMessage('Le départ ne doit pas dépasser 255 caractères.'),

  body('destination')
    .trim()
    .notEmpty().withMessage('La destination est obligatoire.')
    .isLength({ max: 255 }).withMessage('La destination ne doit pas dépasser 255 caractères.'),

  body('date_heure')
    .notEmpty().withMessage('La date et l\'heure sont obligatoires.')
    .isISO8601().withMessage('La date doit être au format valide (ISO 8601).'),

  body('places_totales')
    .notEmpty().withMessage('Le nombre de places est obligatoire.')
    .isInt({ min: 1, max: 8 }).withMessage('Le nombre de places doit être entre 1 et 8.'),

  body('prix')
    .optional()
    .isFloat({ min: 0 }).withMessage('Le prix doit être positif.'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La description ne doit pas dépasser 500 caractères.'),

  body('modele_voiture')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Le modèle de voiture ne doit pas dépasser 100 caractères.')
];

module.exports = { validateTrajet };
