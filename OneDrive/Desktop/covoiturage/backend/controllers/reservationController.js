// ===================================
// Contrôleur Réservations
// ===================================
const ReservationModel = require('../models/reservationModel');
const TripModel = require('../models/tripModel');
const NotificationModel = require('../models/notificationModel');
const { handleValidationErrors } = require('../utils/helpers');

// Formater une réservation pour le frontend
const formatReservation = (r) => ({
  id: String(r.id),
  tripId: String(r.trajet_id),
  trip: {
    id: String(r.trajet_id),
    departure: r.depart,
    destination: r.destination,
    dateTime: r.date_heure,
    price: parseFloat(r.prix) || 0,
    status: r.trajet_statut,
    availableSeats: r.places_disponibles,
    totalSeats: r.places_totales,
    carModel: r.modele_voiture,
    driverId: String(r.conducteur_id),
    driverName: r.conducteur_nom || '',
    driverAvatarUrl: r.conducteur_avatar || null,
    driverRating: parseFloat(r.conducteur_note) || 0
  },
  passengerId: String(r.passager_id),
  passengerName: r.passager_nom || '',
  passengerAvatarUrl: r.passager_avatar || null,
  seats: r.nombre_places,
  status: r.statut,
  createdAt: r.date_creation
});

const reservationController = {
  // ---- POST /api/reservations ----
  create: async (req, res) => {
    try {
      if (handleValidationErrors(req, res)) return;

      const { trajet_id, nombre_places } = req.body;
      const passagerId = req.user.id;
      const seats = nombre_places || 1;

      // 1. Vérifier que le trajet existe et est actif
      const trajet = await TripModel.findById(trajet_id);
      if (!trajet) {
        return res.status(404).json({ success: false, message: 'Trajet introuvable.' });
      }
      if (trajet.statut !== 'ACTIVE') {
        return res.status(400).json({ success: false, message: 'Ce trajet n\'est plus disponible.' });
      }

      // 2. Empêcher le conducteur de réserver son propre trajet
      if (trajet.conducteur_id === passagerId) {
        return res.status(400).json({ success: false, message: 'Vous ne pouvez pas réserver votre propre trajet.' });
      }

      // 3. Vérifier les doublons
      const existing = await ReservationModel.findExisting(trajet_id, passagerId);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Vous avez déjà une réservation pour ce trajet.' });
      }

      // 4. Vérifier les places disponibles
      if (trajet.places_disponibles < seats) {
        return res.status(400).json({
          success: false,
          message: `Il ne reste que ${trajet.places_disponibles} place(s) disponible(s).`
        });
      }

      // 5. Créer la réservation
      const reservationId = await ReservationModel.create(trajet_id, passagerId, seats);

      // 6. Notifier le conducteur
      await NotificationModel.create(
        trajet.conducteur_id,
        'Nouvelle demande de réservation',
        `${req.user.nom} souhaite réserver ${seats} place(s) pour ${trajet.depart} → ${trajet.destination}.`,
        'RESERVATION_REQUEST'
      );

      res.status(201).json({
        success: true,
        message: 'Réservation créée avec succès.',
        data: { id: String(reservationId) }
      });
    } catch (error) {
      console.error('Erreur create reservation:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- GET /api/reservations/mes-reservations ----
  getMyReservations: async (req, res) => {
    try {
      const reservations = await ReservationModel.findByPassenger(req.user.id);
      const data = reservations.map(formatReservation);

      res.json({ success: true, data });
    } catch (error) {
      console.error('Erreur getMyReservations:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- GET /api/reservations/conducteur ----
  getDriverReservations: async (req, res) => {
    try {
      const reservations = await ReservationModel.findByDriver(req.user.id);

      const data = reservations.map(r => ({
        id: String(r.id),
        tripId: String(r.trajet_id),
        trip: {
          departure: r.depart,
          destination: r.destination,
          dateTime: r.date_heure
        },
        passengerId: String(r.passager_id),
        passengerName: r.passager_nom,
        passengerAvatarUrl: r.passager_avatar,
        seats: r.nombre_places,
        status: r.statut,
        createdAt: r.date_creation
      }));

      res.json({ success: true, data });
    } catch (error) {
      console.error('Erreur getDriverReservations:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- PUT /api/reservations/:id/accepter ----
  accept: async (req, res) => {
    try {
      const reservation = await ReservationModel.findById(req.params.id);
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Réservation introuvable.' });
      }

      // Vérifier que c'est le conducteur du trajet
      if (reservation.conducteur_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Accès interdit.' });
      }

      if (reservation.statut !== 'PENDING') {
        return res.status(400).json({ success: false, message: 'Cette réservation ne peut plus être acceptée.' });
      }

      // Vérifier les places disponibles
      const trajet = await TripModel.findById(reservation.trajet_id);
      if (trajet.places_disponibles < reservation.nombre_places) {
        return res.status(400).json({ success: false, message: 'Plus assez de places disponibles.' });
      }

      // Accepter la réservation
      await ReservationModel.updateStatus(req.params.id, 'ACCEPTED');

      // Décrémenter les places disponibles
      await TripModel.updatePlacesDisponibles(reservation.trajet_id, -reservation.nombre_places);

      // Notifier le passager
      await NotificationModel.create(
        reservation.passager_id,
        'Réservation acceptée',
        `Votre réservation pour ${trajet.depart} → ${trajet.destination} a été acceptée !`,
        'RESERVATION_ACCEPTED'
      );

      res.json({ success: true, message: 'Réservation acceptée.' });
    } catch (error) {
      console.error('Erreur accept reservation:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- PUT /api/reservations/:id/refuser ----
  reject: async (req, res) => {
    try {
      const reservation = await ReservationModel.findById(req.params.id);
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Réservation introuvable.' });
      }

      if (reservation.conducteur_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Accès interdit.' });
      }

      if (reservation.statut !== 'PENDING') {
        return res.status(400).json({ success: false, message: 'Cette réservation ne peut plus être refusée.' });
      }

      // Refuser la réservation
      await ReservationModel.updateStatus(req.params.id, 'REJECTED');

      // Notifier le passager
      const trajet = await TripModel.findById(reservation.trajet_id);
      await NotificationModel.create(
        reservation.passager_id,
        'Réservation refusée',
        `Votre réservation pour ${trajet.depart} → ${trajet.destination} a été refusée.`,
        'RESERVATION_REJECTED'
      );

      res.json({ success: true, message: 'Réservation refusée.' });
    } catch (error) {
      console.error('Erreur reject reservation:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },

  // ---- PUT /api/reservations/:id/annuler ----
  cancel: async (req, res) => {
    try {
      const reservation = await ReservationModel.findById(req.params.id);
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Réservation introuvable.' });
      }

      // Seul le passager peut annuler sa réservation
      if (reservation.passager_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Vous ne pouvez annuler que vos propres réservations.' });
      }

      if (reservation.statut === 'CANCELLED' || reservation.statut === 'REJECTED') {
        return res.status(400).json({ success: false, message: 'Cette réservation est déjà annulée ou refusée.' });
      }

      // Si la réservation était acceptée, remettre les places
      if (reservation.statut === 'ACCEPTED') {
        await TripModel.updatePlacesDisponibles(reservation.trajet_id, reservation.nombre_places);
      }

      // Annuler la réservation
      await ReservationModel.updateStatus(req.params.id, 'CANCELLED');

      // Notifier le conducteur
      const trajet = await TripModel.findById(reservation.trajet_id);
      await NotificationModel.create(
        trajet.conducteur_id,
        'Réservation annulée',
        `Un passager a annulé sa réservation pour ${trajet.depart} → ${trajet.destination}.`,
        'RESERVATION_REJECTED'
      );

      res.json({ success: true, message: 'Réservation annulée.' });
    } catch (error) {
      console.error('Erreur cancel reservation:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  }
};

module.exports = reservationController;
