// ===================================
// Modèle Notification
// ===================================
// Toutes les requêtes SQL liées aux notifications

const { pool } = require('../config/db');

const NotificationModel = {
  // Créer une notification
  create: async (utilisateurId, titre, message, type = 'SYSTEM') => {
    const [result] = await pool.query(
      'INSERT INTO notifications (utilisateur_id, titre, message, type) VALUES (?, ?, ?, ?)',
      [utilisateurId, titre, message, type]
    );
    return result.insertId;
  },

  // Récupérer les notifications d'un utilisateur
  findByUser: async (utilisateurId) => {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE utilisateur_id = ? ORDER BY date_creation DESC',
      [utilisateurId]
    );
    return rows;
  },

  // Marquer une notification comme lue
  markAsRead: async (id) => {
    const [result] = await pool.query(
      'UPDATE notifications SET lu = TRUE WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async (utilisateurId) => {
    const [result] = await pool.query(
      'UPDATE notifications SET lu = TRUE WHERE utilisateur_id = ? AND lu = FALSE',
      [utilisateurId]
    );
    return result.affectedRows;
  },

  // Compter les notifications non lues
  countUnread: async (utilisateurId) => {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total FROM notifications WHERE utilisateur_id = ? AND lu = FALSE',
      [utilisateurId]
    );
    return rows[0].total;
  }
};

module.exports = NotificationModel;
