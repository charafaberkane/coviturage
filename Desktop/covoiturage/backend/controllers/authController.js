// ===================================
// Contrôleur Authentification
// ===================================
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { handleValidationErrors } = require('../utils/helpers');

const authController = {
  // ---- POST /api/auth/inscription ----
  inscription: async (req, res) => {
    try {
      // Vérifier les erreurs de validation
      if (handleValidationErrors(req, res)) return;

      const { nom, email, mot_de_passe, role } = req.body;

      // Vérifier si l'email existe déjà
      const utilisateurExistant = await UserModel.findByEmail(email);
      if (utilisateurExistant) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé.'
        });
      }

      // Hasher le mot de passe (10 rounds de sel)
      const motDePasseHash = await bcrypt.hash(mot_de_passe, 10);

      // Créer l'utilisateur
      const userId = await UserModel.create(nom, email, motDePasseHash, role || 'PASSAGER');

      // Récupérer l'utilisateur créé (sans le mot de passe)
      const utilisateur = await UserModel.findById(userId);

      // Générer le token JWT
      const token = jwt.sign(
        { id: utilisateur.id, role: utilisateur.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        success: true,
        message: 'Inscription réussie !',
        data: {
          user: {
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
          },
          token
        }
      });

    } catch (error) {
      console.error('Erreur inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription.'
      });
    }
  },

  // ---- POST /api/auth/connexion ----
  connexion: async (req, res) => {
    try {
      if (handleValidationErrors(req, res)) return;

      const { email, mot_de_passe } = req.body;

      // Chercher l'utilisateur par email
      const utilisateur = await UserModel.findByEmail(email);
      if (!utilisateur) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect.'
        });
      }

      // Vérifier que le compte est actif
      if (!utilisateur.est_actif) {
        return res.status(403).json({
          success: false,
          message: 'Votre compte a été désactivé.'
        });
      }

      // Comparer le mot de passe
      const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
      if (!motDePasseValide) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect.'
        });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { id: utilisateur.id, role: utilisateur.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        message: 'Connexion réussie !',
        data: {
          user: {
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
          },
          token
        }
      });

    } catch (error) {
      console.error('Erreur connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion.'
      });
    }
  },

  // ---- GET /api/auth/me ----
  // Récupérer l'utilisateur connecté via son token
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const utilisateur = await UserModel.findByEmail(email);
      if (!utilisateur) {
        return res.status(404).json({
          success: false,
          message: 'Aucun compte trouvé avec cette adresse email.'
        });
      }

      // TODO: Implémenter envoi d'email de réinitialisation.
      res.json({
        success: true,
        message: 'Un email de réinitialisation a été envoyé si l’adresse existe dans notre système.'
      });
    } catch (error) {
      console.error('Erreur forgotPassword:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la réinitialisation du mot de passe.'
      });
    }
  },

  getMe: async (req, res) => {
    try {
      const utilisateur = await UserModel.findById(req.user.id);
      if (!utilisateur) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur introuvable.'
        });
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
      console.error('Erreur getMe:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur.'
      });
    }
  }
};

module.exports = authController;
