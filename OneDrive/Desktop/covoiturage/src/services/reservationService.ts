import { api, IS_MOCK_MODE, delay } from './api';
import { getFromDb, saveToDb, RESERVATIONS_KEY, TRIPS_KEY, NOTIFICATIONS_KEY } from './mockData';
import type { Reservation, Trip, Notification } from '../types';

export const reservationService = {
  getReservationsForPassenger: async (passengerId: string): Promise<Reservation[]> => {
    await delay(500);

    if (IS_MOCK_MODE) {
      const reservations = getFromDb<Reservation>(RESERVATIONS_KEY);
      return reservations.filter((r) => r.passengerId === passengerId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      const response = await api.get(`/passengers/${passengerId}/reservations`);
      return response.data;
    }
  },

  getReservationsForDriver: async (driverId: string): Promise<Reservation[]> => {
    await delay(500);

    if (IS_MOCK_MODE) {
      const reservations = getFromDb<Reservation>(RESERVATIONS_KEY);
      return reservations.filter((r) => r.trip.driverId === driverId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      const response = await api.get(`/drivers/${driverId}/reservations`);
      return response.data;
    }
  },

  createReservation: async (tripId: string, passengerId: string, seats: number): Promise<Reservation> => {
    await delay(800);

    if (IS_MOCK_MODE) {
      const trips = getFromDb<Trip>(TRIPS_KEY);
      const tripIndex = trips.findIndex((t) => t.id === tripId);

      if (tripIndex === -1) {
        throw new Error('Trajet introuvable.');
      }

      const trip = trips[tripIndex];

      if (trip.status !== 'ACTIVE') {
        throw new Error('Ce trajet n\'est plus actif.');
      }

      if (trip.availableSeats < seats) {
        throw new Error('Pas assez de places disponibles.');
      }

      const users = JSON.parse(localStorage.getItem('covoitgo_users') || '[]');
      const passenger = users.find((u: any) => u.id === passengerId);

      const reservations = getFromDb<Reservation>(RESERVATIONS_KEY);
      
      const newReservation: Reservation = {
        id: `res-${Date.now()}`,
        tripId,
        trip,
        passengerId,
        passengerName: passenger ? passenger.name : 'Passager',
        passengerAvatarUrl: passenger ? passenger.avatarUrl : undefined,
        seats,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };

      reservations.push(newReservation);
      saveToDb(RESERVATIONS_KEY, reservations);

      // Create notification for driver
      const notifications = getFromDb<Notification>(NOTIFICATIONS_KEY);
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        userId: trip.driverId,
        title: 'Nouvelle demande de réservation',
        message: `${newReservation.passengerName} souhaite réserver ${seats} place(s) pour votre trajet ${trip.departure} -> ${trip.destination}.`,
        type: 'RESERVATION_REQUEST',
        read: false,
        createdAt: new Date().toISOString()
      };
      notifications.push(newNotif);
      saveToDb(NOTIFICATIONS_KEY, notifications);

      return newReservation;
    } else {
      const response = await api.post('/reservations', { tripId, passengerId, seats });
      return response.data;
    }
  },

  acceptReservation: async (id: string): Promise<Reservation> => {
    await delay(600);

    if (IS_MOCK_MODE) {
      const reservations = getFromDb<Reservation>(RESERVATIONS_KEY);
      const index = reservations.findIndex((r) => r.id === id);

      if (index === -1) {
        throw new Error('Réservation introuvable.');
      }

      const res = reservations[index];
      res.status = 'ACCEPTED';

      // Deduct seats from Trip
      const trips = getFromDb<Trip>(TRIPS_KEY);
      const tripIndex = trips.findIndex((t) => t.id === res.tripId);
      
      if (tripIndex !== -1) {
        const trip = trips[tripIndex];
        if (trip.availableSeats < res.seats) {
          throw new Error('Pas assez de places libres sur le trajet pour valider cette réservation.');
        }
        trip.availableSeats -= res.seats;
        trips[tripIndex] = trip;
        saveToDb(TRIPS_KEY, trips);
        
        // Propagate updated trip info back to current reservation
        res.trip = trip;
      }

      reservations[index] = res;
      saveToDb(RESERVATIONS_KEY, reservations);

      // Notify passenger
      const notifications = getFromDb<Notification>(NOTIFICATIONS_KEY);
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: res.passengerId,
        title: 'Réservation Acceptée',
        message: `Votre réservation pour le trajet ${res.trip.departure} -> ${res.trip.destination} a été acceptée.`,
        type: 'RESERVATION_ACCEPTED',
        read: false,
        createdAt: new Date().toISOString()
      };
      notifications.push(notif);
      saveToDb(NOTIFICATIONS_KEY, notifications);

      return res;
    } else {
      const response = await api.post(`/reservations/${id}/accept`);
      return response.data;
    }
  },

  rejectReservation: async (id: string): Promise<Reservation> => {
    await delay(600);

    if (IS_MOCK_MODE) {
      const reservations = getFromDb<Reservation>(RESERVATIONS_KEY);
      const index = reservations.findIndex((r) => r.id === id);

      if (index === -1) {
        throw new Error('Réservation introuvable.');
      }

      const res = reservations[index];
      res.status = 'REJECTED';
      reservations[index] = res;
      saveToDb(RESERVATIONS_KEY, reservations);

      // Notify passenger
      const notifications = getFromDb<Notification>(NOTIFICATIONS_KEY);
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: res.passengerId,
        title: 'Réservation Refusée',
        message: `Votre demande de réservation pour le trajet ${res.trip.departure} -> ${res.trip.destination} a été refusée.`,
        type: 'RESERVATION_REJECTED',
        read: false,
        createdAt: new Date().toISOString()
      };
      notifications.push(notif);
      saveToDb(NOTIFICATIONS_KEY, notifications);

      return res;
    } else {
      const response = await api.post(`/reservations/${id}/reject`);
      return response.data;
    }
  },

  cancelReservation: async (id: string, userId: string): Promise<Reservation> => {
    await delay(600);

    if (IS_MOCK_MODE) {
      const reservations = getFromDb<Reservation>(RESERVATIONS_KEY);
      const index = reservations.findIndex((r) => r.id === id);

      if (index === -1) {
        throw new Error('Réservation introuvable.');
      }

      const res = reservations[index];
      const previousStatus = res.status;
      res.status = 'CANCELLED';

      // Restore seats if it was previously ACCEPTED
      if (previousStatus === 'ACCEPTED') {
        const trips = getFromDb<Trip>(TRIPS_KEY);
        const tripIndex = trips.findIndex((t) => t.id === res.tripId);
        if (tripIndex !== -1) {
          trips[tripIndex].availableSeats += res.seats;
          saveToDb(TRIPS_KEY, trips);
          res.trip = trips[tripIndex];
        }
      }

      reservations[index] = res;
      saveToDb(RESERVATIONS_KEY, reservations);

      // Notify driver if cancelled by passenger
      if (res.passengerId === userId) {
        const notifications = getFromDb<Notification>(NOTIFICATIONS_KEY);
        const notif: Notification = {
          id: `notif-${Date.now()}`,
          userId: res.trip.driverId,
          title: 'Réservation Annulée',
          message: `${res.passengerName} a annulé sa réservation pour votre trajet ${res.trip.departure} -> ${res.trip.destination}.`,
          type: 'SYSTEM',
          read: false,
          createdAt: new Date().toISOString()
        };
        notifications.push(notif);
        saveToDb(NOTIFICATIONS_KEY, notifications);
      }

      return res;
    } else {
      const response = await api.post(`/reservations/${id}/cancel`);
      return response.data;
    }
  }
};
