// ===================================
// Validateurs pour les utilisateurs
// ===================================
const { body } = require('express-validator');

const validateModificationProfil = [
  body('nom')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères.'),

  body('telephone')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('Le téléphone ne doit pas dépasser 20 caractères.'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La bio ne doit pas dépasser 500 caractères.')
];

module.exports = { validateModificationProfil };
