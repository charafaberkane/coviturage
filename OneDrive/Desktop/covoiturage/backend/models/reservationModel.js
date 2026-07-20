// ===================================
// Modèle Réservation
// ===================================
// Toutes les requêtes SQL liées aux réservations

const { pool } = require('../config/db');

const ReservationModel = {
  // Créer une réservation
  create: async (trajetId, passagerId, nombrePlaces = 1) => {
    const [result] = await pool.query(
      'INSERT INTO reservations (trajet_id, passager_id, nombre_places) VALUES (?, ?, ?)',
      [trajetId, passagerId, nombrePlaces]
    );
    return result.insertId;
  },

  // Trouver une réservation par ID (avec infos trajet et passager)
  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT r.*, 
        t.depart, t.destination, t.date_heure, t.prix, t.statut AS trajet_statut,
        t.places_totales, t.places_disponibles, t.conducteur_id,
        u.nom AS passager_nom, u.avatar_url AS passager_avatar
       FROM reservations r
       JOIN trajets t ON r.trajet_id = t.id
       JOIN utilisateurs u ON r.passager_id = u.id
       WHERE r.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Vérifier si une réservation existe déjà (anti-doublon)
  findExisting: async (trajetId, passagerId) => {
    const [rows] = await pool.query(
      `SELECT * FROM reservations 
       WHERE trajet_id = ? AND passager_id = ? AND statut IN ('PENDING', 'ACCEPTED')`,
      [trajetId, passagerId]
    );
    return rows[0] || null;
  },

  // Réservations d'un passager (avec infos trajet)
  findByPassenger: async (passagerId) => {
    const [rows] = await pool.query(
      `SELECT r.*,
        t.depart, t.destination, t.date_heure, t.prix, t.statut AS trajet_statut,
        t.places_totales, t.places_disponibles, t.modele_voiture,
        t.conducteur_id,
        u.nom AS conducteur_nom, u.avatar_url AS conducteur_avatar, u.note_moyenne AS conducteur_note
       FROM reservations r
       JOIN trajets t ON r.trajet_id = t.id
       JOIN utilisateurs u ON t.conducteur_id = u.id
       WHERE r.passager_id = ?
       ORDER BY r.date_creation DESC`,
      [passagerId]
    );
    return rows;
  },

  // Réservations pour un trajet (pour le conducteur)
  findByTrip: async (trajetId) => {
    const [rows] = await pool.query(
      `SELECT r.*,
        u.nom AS passager_nom, u.avatar_url AS passager_avatar, u.telephone AS passager_telephone
       FROM reservations r
       JOIN utilisateurs u ON r.passager_id = u.id
       WHERE r.trajet_id = ?
       ORDER BY r.date_creation DESC`,
      [trajetId]
    );
    return rows;
  },

  // Toutes les réservations pour les trajets d'un conducteur
  findByDriver: async (conducteurId) => {
    const [rows] = await pool.query(
      `SELECT r.*,
        t.depart, t.destination, t.date_heure,
        u.nom AS passager_nom, u.avatar_url AS passager_avatar
       FROM reservations r
       JOIN trajets t ON r.trajet_id = t.id
       JOIN utilisateurs u ON r.passager_id = u.id
       WHERE t.conducteur_id = ?
       ORDER BY r.date_creation DESC`,
      [conducteurId]
    );
    return rows;
  },

  // Changer le statut d'une réservation
  updateStatus: async (id, statut) => {
    const [result] = await pool.query(
      'UPDATE reservations SET statut = ? WHERE id = ?',
      [statut, id]
    );
    return result.affectedRows > 0;
  },

  // Annuler toutes les réservations PENDING d'un trajet (quand le trajet est annulé)
  cancelAllByTrip: async (trajetId) => {
    const [result] = await pool.query(
      `UPDATE reservations SET statut = 'CANCELLED' WHERE trajet_id = ? AND statut IN ('PENDING', 'ACCEPTED')`,
      [trajetId]
    );
    return result.affectedRows;
  },

  // Récupérer les passagers affectés par l'annulation d'un trajet
  findAffectedPassengers: async (trajetId) => {
    const [rows] = await pool.query(
      `SELECT DISTINCT r.passager_id, u.nom AS passager_nom
       FROM reservations r
       JOIN utilisateurs u ON r.passager_id = u.id
       WHERE r.trajet_id = ? AND r.statut IN ('PENDING', 'ACCEPTED')`,
      [trajetId]
    );
    return rows;
  }
};

module.exports = ReservationModel;
