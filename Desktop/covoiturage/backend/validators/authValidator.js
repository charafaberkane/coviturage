// ===================================
// Validateurs pour l'authentification
// ===================================
const { body } = require('express-validator');

const validateInscription = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire.')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères.'),

  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est obligatoire.')
    .isEmail().withMessage('L\'email n\'est pas valide.'),

  body('mot_de_passe')
    .notEmpty().withMessage('Le mot de passe est obligatoire.')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),

  body('role')
    .optional()
    .isIn(['PASSAGER', 'CONDUCTEUR']).withMessage('Le rôle doit être PASSAGER ou CONDUCTEUR.')
];

const validateConnexion = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est obligatoire.')
    .isEmail().withMessage('L\'email n\'est pas valide.'),

  body('mot_de_passe')
    .notEmpty().withMessage('Le mot de passe est obligatoire.')
];

module.exports = { validateInscription, validateConnexion };
