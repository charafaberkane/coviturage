// ===================================
// Modèle Utilisateur
// ===================================
// Toutes les requêtes SQL liées aux utilisateurs

const { pool } = require('../config/db');

const UserModel = {
  // Trouver un utilisateur par email
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      'SELECT * FROM utilisateurs WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  // Trouver un utilisateur par ID
  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id, nom, email, role, telephone, bio, avatar_url, note_moyenne, nombre_trajets, est_actif, date_creation FROM utilisateurs WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Créer un nouvel utilisateur
  create: async (nom, email, motDePasse, role = 'PASSAGER') => {
    const [result] = await pool.query(
      'INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
      [nom, email, motDePasse, role]
    );
    return result.insertId;
  },

  // Modifier le profil
  updateProfile: async (id, data) => {
    const { nom, telephone, bio } = data;
    const [result] = await pool.query(
      'UPDATE utilisateurs SET nom = COALESCE(?, nom), telephone = COALESCE(?, telephone), bio = COALESCE(?, bio) WHERE id = ?',
      [nom, telephone, bio, id]
    );
    return result.affectedRows > 0;
  },

  // Activer le mode conducteur
  activerConducteur: async (id) => {
    const [result] = await pool.query(
      'UPDATE utilisateurs SET role = ? WHERE id = ?',
      ['CONDUCTEUR', id]
    );
    return result.affectedRows > 0;
  },

  // Admin : activer/désactiver un utilisateur
  toggleActif: async (id, estActif) => {
    const [result] = await pool.query(
      'UPDATE utilisateurs SET est_actif = ? WHERE id = ?',
      [estActif, id]
    );
    return result.affectedRows > 0;
  },

  // Admin : récupérer tous les utilisateurs
  findAll: async () => {
    const [rows] = await pool.query(
      'SELECT id, nom, email, role, telephone, note_moyenne, nombre_trajets, est_actif, date_creation FROM utilisateurs ORDER BY date_creation DESC'
    );
    return rows;
  }
};

module.exports = UserModel;
