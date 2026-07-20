// ===================================
// Contrôleur Utilisateurs
// ===================================
const UserModel = require('../models/userModel');
const { handleValidationErrors } = require('../utils/helpers');

const userController = {
  // ---- GET /api/users/profil ----
  getProfil: async (req, res) => {
    try {
      const utilisateur = await UserModel.findById(req.user.id);
      if (!utilisateur) {
        return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
      }

      res.json({
        success: true,
        data: {
          id: String(utilisateur.id),
          name: utilisateur.nom,
          email: utilisateur.email,
          role: utilisateur.role,
          avatarUrl: utilisateur.avatar_url,
          phone: utilisateur.telephone,
          bio: utilisateur.bio,
          rating: parseFloat(utilisateur.note_moyenne) || 0,
          tripsCount: utilisateur.nombre_trajets,
          isActive: Boolean(utilisateur.est_actif)
        }
      });
    } catch (error) {
      console.error('Erreur getProfil:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- PUT /api/users/profil ----
  updateProfil: async (req, res) => {
    try {
      if (handleValidationErrors(req, res)) return;

      const updated = await UserModel.updateProfile(req.user.id, req.body);
      if (!updated) {
        return res.status(400).json({ success: false, message: 'Échec de la mise à jour.' });
      }

      // Retourner le profil mis à jour
      const utilisateur = await UserModel.findById(req.user.id);

      res.json({
        success: true,
        message: 'Profil mis à jour avec succès.',
        data: {
          id: String(utilisateur.id),
          name: utilisateur.nom,
          email: utilisateur.email,
          role: utilisateur.role,
          avatarUrl: utilisateur.avatar_url,
          phone: utilisateur.telephone,
          bio: utilisateur.bio,
          rating: parseFloat(utilisateur.note_moyenne) || 0,
          tripsCount: utilisateur.nombre_trajets,
          isActive: Boolean(utilisateur.est_actif)
        }
      });
    } catch (error) {
      console.error('Erreur updateProfil:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- PUT /api/users/devenir-conducteur ----
  devenirConducteur: async (req, res) => {
    try {
      const updated = await UserModel.activerConducteur(req.user.id);
      if (!updated) {
        return res.status(400).json({ success: false, message: 'Échec de l\'activation.' });
      }

      res.json({
        success: true,
        message: 'Vous êtes maintenant conducteur !'
      });
    } catch (error) {
      console.error('Erreur devenirConducteur:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- GET /api/users (Admin) ----
  getAllUsers: async (req, res) => {
    try {
      const utilisateurs = await UserModel.findAll();

      const data = utilisateurs.map(u => ({
        id: String(u.id),
        name: u.nom,
        email: u.email,
        role: u.role,
        phone: u.telephone,
        rating: parseFloat(u.note_moyenne) || 0,
        tripsCount: u.nombre_trajets,
        isActive: Boolean(u.est_actif)
      }));

      res.json({ success: true, data });
    } catch (error) {
      console.error('Erreur getAllUsers:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- PUT /api/users/:id/toggle-actif (Admin) ----
  toggleActif: async (req, res) => {
    try {
      const { id } = req.params;
      const { est_actif } = req.body;

      // Empêcher l'admin de se désactiver lui-même
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez pas vous désactiver vous-même.'
        });
      }

      const updated = await UserModel.toggleActif(id, est_actif);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
      }

      res.json({
        success: true,
        message: est_actif ? 'Utilisateur activé.' : 'Utilisateur désactivé.'
      });
    } catch (error) {
      console.error('Erreur toggleActif:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  }
};

module.exports = userController;
