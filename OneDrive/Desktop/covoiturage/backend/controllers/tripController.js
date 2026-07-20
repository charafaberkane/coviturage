// ===================================
// Contrôleur Trajets
// ===================================
const TripModel = require('../models/tripModel');
const ReservationModel = require('../models/reservationModel');
const NotificationModel = require('../models/notificationModel');
const { handleValidationErrors } = require('../utils/helpers');

// Fonction utilitaire pour formater un trajet pour le frontend
const formatTrip = (t) => ({
  id: String(t.id),
  driverId: String(t.conducteur_id),
  driverName: t.conducteur_nom,
  driverAvatarUrl: t.conducteur_avatar,
  driverRating: parseFloat(t.conducteur_note) || 0,
  departure: t.depart,
  destination: t.destination,
  dateTime: t.date_heure,
  availableSeats: t.places_disponibles,
  totalSeats: t.places_totales,
  price: parseFloat(t.prix) || 0,
  description: t.description,
  carModel: t.modele_voiture,
  status: t.statut
});

const tripController = {
  // ---- POST /api/trips ----
  create: async (req, res) => {
    try {
      if (handleValidationErrors(req, res)) return;

      const data = {
        conducteur_id: req.user.id,
        ...req.body
      };

      const tripId = await TripModel.create(data);
      const trajet = await TripModel.findById(tripId);

      res.status(201).json({
        success: true,
        message: 'Trajet créé avec succès.',
        data: formatTrip(trajet)
      });
    } catch (error) {
      console.error('Erreur create trip:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- GET /api/trips ----
  getAll: async (req, res) => {
    try {
      // Les filtres viennent des query params : ?depart=Ottawa&destination=Montreal&date=2024-01-15&places=2
      const filters = {
        depart: req.query.depart || req.query.departure,
        destination: req.query.destination,
        date: req.query.date,
        places: req.query.places || req.query.seats
      };

      const trajets = await TripModel.findAll(filters);
      const data = trajets.map(formatTrip);

      res.json({ success: true, data });
    } catch (error) {
      console.error('Erreur getAll trips:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- GET /api/trips/:id ----
  getById: async (req, res) => {
    try {
      const trajet = await TripModel.findById(req.params.id);
      if (!trajet) {
        return res.status(404).json({ success: false, message: 'Trajet introuvable.' });
      }

      res.json({ success: true, data: formatTrip(trajet) });
    } catch (error) {
      console.error('Erreur getById trip:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- GET /api/trips/mes-trajets ----
  getMyTrips: async (req, res) => {
    try {
      const trajets = await TripModel.findByDriver(req.user.id);
      const data = trajets.map(formatTrip);

      res.json({ success: true, data });
    } catch (error) {
      console.error('Erreur getMyTrips:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- PUT /api/trips/:id ----
  update: async (req, res) => {
    try {
      if (handleValidationErrors(req, res)) return;

      // Vérifier que le trajet appartient au conducteur
      const trajet = await TripModel.findById(req.params.id);
      if (!trajet) {
        return res.status(404).json({ success: false, message: 'Trajet introuvable.' });
      }
      if (trajet.conducteur_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Vous ne pouvez modifier que vos propres trajets.' });
      }

      await TripModel.update(req.params.id, req.body);
      const trajetMisAJour = await TripModel.findById(req.params.id);

      res.json({
        success: true,
        message: 'Trajet modifié avec succès.',
        data: formatTrip(trajetMisAJour)
      });
    } catch (error) {
      console.error('Erreur update trip:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- PUT /api/trips/:id/annuler ----
  cancel: async (req, res) => {
    try {
      const trajet = await TripModel.findById(req.params.id);
      if (!trajet) {
        return res.status(404).json({ success: false, message: 'Trajet introuvable.' });
      }
      if (trajet.conducteur_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Vous ne pouvez annuler que vos propres trajets.' });
      }

      // Récupérer les passagers affectés AVANT l'annulation
      const passagersAffectes = await ReservationModel.findAffectedPassengers(req.params.id);

      // Annuler le trajet
      await TripModel.updateStatus(req.params.id, 'CANCELLED');

      // Annuler toutes les réservations liées
      await ReservationModel.cancelAllByTrip(req.params.id);

      // Notifier tous les passagers affectés
      for (const passager of passagersAffectes) {
        await NotificationModel.create(
          passager.passager_id,
          'Trajet annulé',
          `Le trajet ${trajet.depart} → ${trajet.destination} a été annulé par le conducteur.`,
          'TRIP_CANCELLED'
        );
      }

      res.json({
        success: true,
        message: 'Trajet annulé avec succès.'
      });
    } catch (error) {
      console.error('Erreur cancel trip:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- DELETE /api/trips/:id ----
  delete: async (req, res) => {
    try {
      const trajet = await TripModel.findById(req.params.id);
      if (!trajet) {
        return res.status(404).json({ success: false, message: 'Trajet introuvable.' });
      }
      if (trajet.conducteur_id !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Accès interdit.' });
      }

      await TripModel.delete(req.params.id);

      res.json({ success: true, message: 'Trajet supprimé.' });
    } catch (error) {
      console.error('Erreur delete trip:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  }
};

module.exports = tripController;
