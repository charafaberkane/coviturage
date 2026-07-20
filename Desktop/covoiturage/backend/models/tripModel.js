// ===================================
// Modèle Trajet
// ===================================
// Toutes les requêtes SQL liées aux trajets

const { pool } = require('../config/db');

const TripModel = {
  // Créer un trajet
  create: async (data) => {
    const { conducteur_id, depart, destination, date_heure, places_totales, prix, description, modele_voiture } = data;
    const [result] = await pool.query(
      `INSERT INTO trajets (conducteur_id, depart, destination, date_heure, places_totales, places_disponibles, prix, description, modele_voiture)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [conducteur_id, depart, destination, date_heure, places_totales, places_totales, prix || 0, description, modele_voiture]
    );
    return result.insertId;
  },

  // Trouver un trajet par ID (avec infos conducteur)
  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT t.*, u.nom AS conducteur_nom, u.avatar_url AS conducteur_avatar, u.note_moyenne AS conducteur_note
       FROM trajets t
       JOIN utilisateurs u ON t.conducteur_id = u.id
       WHERE t.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Lister tous les trajets actifs avec filtres
  findAll: async (filters = {}) => {
    let query = `
      SELECT t.*, u.nom AS conducteur_nom, u.avatar_url AS conducteur_avatar, u.note_moyenne AS conducteur_note
      FROM trajets t
      JOIN utilisateurs u ON t.conducteur_id = u.id
      WHERE t.statut = 'ACTIVE'
    `;
    const params = [];

    // Filtrer par départ
    if (filters.depart) {
      query += ' AND t.depart LIKE ?';
      params.push(`%${filters.depart}%`);
    }

    // Filtrer par destination
    if (filters.destination) {
      query += ' AND t.destination LIKE ?';
      params.push(`%${filters.destination}%`);
    }

    // Filtrer par date
    if (filters.date) {
      query += ' AND DATE(t.date_heure) = ?';
      params.push(filters.date);
    }

    // Filtrer par places disponibles minimum
    if (filters.places) {
      query += ' AND t.places_disponibles >= ?';
      params.push(parseInt(filters.places));
    }

    query += ' ORDER BY t.date_heure ASC';

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Trajets d'un conducteur
  findByDriver: async (conducteurId) => {
    const [rows] = await pool.query(
      `SELECT t.*, u.nom AS conducteur_nom, u.avatar_url AS conducteur_avatar, u.note_moyenne AS conducteur_note
       FROM trajets t
       JOIN utilisateurs u ON t.conducteur_id = u.id
       WHERE t.conducteur_id = ?
       ORDER BY t.date_creation DESC`,
      [conducteurId]
    );
    return rows;
  },

  // Modifier un trajet
  update: async (id, data) => {
    const { depart, destination, date_heure, places_totales, prix, description, modele_voiture } = data;
    const [result] = await pool.query(
      `UPDATE trajets SET
        depart = COALESCE(?, depart),
        destination = COALESCE(?, destination),
        date_heure = COALESCE(?, date_heure),
        places_totales = COALESCE(?, places_totales),
        prix = COALESCE(?, prix),
        description = COALESCE(?, description),
        modele_voiture = COALESCE(?, modele_voiture)
       WHERE id = ?`,
      [depart, destination, date_heure, places_totales, prix, description, modele_voiture, id]
    );
    return result.affectedRows > 0;
  },

  // Changer le statut d'un trajet
  updateStatus: async (id, statut) => {
    const [result] = await pool.query(
      'UPDATE trajets SET statut = ? WHERE id = ?',
      [statut, id]
    );
    return result.affectedRows > 0;
  },

  // Supprimer un trajet
  delete: async (id) => {
    const [result] = await pool.query(
      'DELETE FROM trajets WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  // Mettre à jour les places disponibles
  updatePlacesDisponibles: async (id, changement) => {
    const [result] = await pool.query(
      'UPDATE trajets SET places_disponibles = places_disponibles + ? WHERE id = ? AND places_disponibles + ? >= 0',
      [changement, id, changement]
    );
    return result.affectedRows > 0;
  }
};

module.exports = TripModel;
