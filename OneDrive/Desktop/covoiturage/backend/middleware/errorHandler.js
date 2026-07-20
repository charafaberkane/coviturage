// ===================================
// Middleware de gestion d'erreurs
// ===================================

const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur:', err.message);
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur'
  });
};

module.exports = errorHandler;
