// ===================================
// Utilitaires
// ===================================
const { validationResult } = require('express-validator');

// Vérifier les erreurs de validation et renvoyer une réponse 400 si nécessaire
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Erreurs de validation.',
      errors: errors.array().map(err => err.msg)
    });
    return true; // Il y a des erreurs
  }
  return false; // Pas d'erreurs
};

module.exports = { handleValidationErrors };
