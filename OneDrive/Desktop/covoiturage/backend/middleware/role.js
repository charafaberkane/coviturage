// ===================================
// Middleware de vérification de rôle
// ===================================
// Vérifie que l'utilisateur a le bon rôle pour accéder à une route

const role = (...rolesAutorises) => {
  return (req, res, next) => {
    // req.user est ajouté par le middleware auth
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié.'
      });
    }

    // Vérifier si le rôle de l'utilisateur est dans la liste autorisée
    if (!rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit. Vous n\'avez pas les permissions nécessaires.'
      });
    }

    next();
  };
};

module.exports = role;
