// ===================================
// Middleware d'authentification JWT
// ===================================
// Vérifie que l'utilisateur est connecté via son token JWT

const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const auth = async (req, res, next) => {
  try {
    // 1. Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Aucun token fourni.'
      });
    }

    // 2. Extraire le token (enlever "Bearer ")
    const token = authHeader.split(' ')[1];

    // 3. Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Vérifier que l'utilisateur existe encore en base
    const [rows] = await pool.query(
      'SELECT id, nom, email, role, est_actif FROM utilisateurs WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable.'
      });
    }

    // 5. Vérifier que le compte est actif
    if (!rows[0].est_actif) {
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été désactivé.'
      });
    }

    // 6. Ajouter l'utilisateur à la requête pour les prochains middlewares/controllers
    req.user = rows[0];
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré. Veuillez vous reconnecter.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token invalide.'
    });
  }
};

module.exports = auth;
