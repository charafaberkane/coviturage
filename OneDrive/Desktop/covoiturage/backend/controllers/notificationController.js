// ===================================
// Contrôleur Notifications
// ===================================
const NotificationModel = require('../models/notificationModel');

const notificationController = {
  // ---- GET /api/notifications ----
  getAll: async (req, res) => {
    try {
      const notifications = await NotificationModel.findByUser(req.user.id);

      const data = notifications.map(n => ({
        id: String(n.id),
        userId: String(n.utilisateur_id),
        title: n.titre,
        message: n.message,
        type: n.type,
        read: Boolean(n.lu),
        createdAt: n.date_creation
      }));

      res.json({ success: true, data });
    } catch (error) {
      console.error('Erreur getAll notifications:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- PUT /api/notifications/:id/lire ----
  markAsRead: async (req, res) => {
    try {
      const updated = await NotificationModel.markAsRead(req.params.id);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Notification introuvable.' });
      }

      res.json({ success: true, message: 'Notification marquée comme lue.' });
    } catch (error) {
      console.error('Erreur markAsRead:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- PUT /api/notifications/tout-lire ----
  markAllAsRead: async (req, res) => {
    try {
      const count = await NotificationModel.markAllAsRead(req.user.id);

      res.json({
        success: true,
        message: `${count} notification(s) marquée(s) comme lue(s).`
      });
    } catch (error) {
      console.error('Erreur markAllAsRead:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- GET /api/notifications/non-lues ----
  getUnreadCount: async (req, res) => {
    try {
      const count = await NotificationModel.countUnread(req.user.id);

      res.json({ success: true, data: { count } });
    } catch (error) {
      console.error('Erreur getUnreadCount:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  }
};

module.exports = notificationController;
