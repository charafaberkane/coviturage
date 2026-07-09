import { api, IS_MOCK_MODE, delay } from './api';
import { getFromDb, saveToDb, TRIPS_KEY, RESERVATIONS_KEY, NOTIFICATIONS_KEY } from './mockData';
import type { Trip, Reservation, Notification } from '../types';

export const tripService = {
  getTrips: async (filters: { departure?: string; destination?: string; date?: string; seats?: number }): Promise<Trip[]> => {
    await delay(600);

    if (IS_MOCK_MODE) {
      let trips = getFromDb<Trip>(TRIPS_KEY).filter(t => t.status === 'ACTIVE');

      if (filters.departure) {
        const dep = filters.departure.toLowerCase().trim();
        trips = trips.filter((t) => t.departure.toLowerCase().includes(dep));
      }

      if (filters.destination) {
        const dest = filters.destination.toLowerCase().trim();
        trips = trips.filter((t) => t.destination.toLowerCase().includes(dest));
      }

      if (filters.date) {
        const filterDate = new Date(filters.date).toDateString();
        trips = trips.filter((t) => new Date(t.dateTime).toDateString() === filterDate);
      }

      if (filters.seats) {
        trips = trips.filter((t) => t.availableSeats >= (filters.seats || 1));
      }

      // Sort by soonest departure first
      return trips.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    } else {
      const response = await api.get('/trips', { params: filters });
      return response.data;
    }
  },

  getTripById: async (id: string): Promise<Trip> => {
    await delay(400);

    if (IS_MOCK_MODE) {
      const trips = getFromDb<Trip>(TRIPS_KEY);
      const trip = trips.find((t) => t.id === id);
      if (!trip) throw new Error('Trajet introuvable.');
      return trip;
    } else {
      const response = await api.get(`/trips/${id}`);
      return response.data;
    }
  },

  createTrip: async (driverId: string, tripData: Omit<Trip, 'id' | 'driverId' | 'driverName' | 'driverAvatarUrl' | 'driverRating' | 'status'>): Promise<Trip> => {
    await delay(800);

    if (IS_MOCK_MODE) {
      const trips = getFromDb<Trip>(TRIPS_KEY);
      
      // Fetch driver details from localStorage
      const users = JSON.parse(localStorage.getItem('covoitgo_users') || '[]');
      const driver = users.find((u: any) => u.id === driverId);

      const newTrip: Trip = {
        ...tripData,
        id: `trip-${Date.now()}`,
        driverId,
        driverName: driver ? driver.name : 'Conducteur',
        driverAvatarUrl: driver ? driver.avatarUrl : undefined,
        driverRating: driver ? driver.rating : 5.0,
        status: 'ACTIVE'
      };

      trips.push(newTrip);
      saveToDb(TRIPS_KEY, trips);

      // Increment driver's trip count
      if (driver) {
        driver.tripsCount = (driver.tripsCount || 0) + 1;
        const updatedUsers = users.map((u: any) => u.id === driver.id ? driver : u);
        saveToDb('covoitgo_users', updatedUsers);
      }

      return newTrip;
    } else {
      const response = await api.post('/trips', { driverId, ...tripData });
      return response.data;
    }
  },

  updateTrip: async (id: string, tripData: Partial<Trip>): Promise<Trip> => {
    await delay(600);

    if (IS_MOCK_MODE) {
      const trips = getFromDb<Trip>(TRIPS_KEY);
      const index = trips.findIndex((t) => t.id === id);

      if (index === -1) {
        throw new Error('Trajet introuvable.');
      }

      const updatedTrip = { ...trips[index], ...tripData };
      trips[index] = updatedTrip;
      saveToDb(TRIPS_KEY, trips);

      // Update reservations with updated trip details
      const reservations = getFromDb<Reservation>(RESERVATIONS_KEY);
      const updatedReservations = reservations.map(res => {
        if (res.tripId === id) {
          return { ...res, trip: updatedTrip };
        }
        return res;
      });
      saveToDb(RESERVATIONS_KEY, updatedReservations);

      return updatedTrip;
    } else {
      const response = await api.put(`/trips/${id}`, tripData);
      return response.data;
    }
  },

  cancelTrip: async (id: string): Promise<void> => {
    await delay(600);

    if (IS_MOCK_MODE) {
      const trips = getFromDb<Trip>(TRIPS_KEY);
      const index = trips.findIndex((t) => t.id === id);

      if (index === -1) {
        throw new Error('Trajet introuvable.');
      }

      trips[index].status = 'CANCELLED';
      saveToDb(TRIPS_KEY, trips);

      // Cancel all pending or accepted reservations for this trip
      const reservations = getFromDb<Reservation>(RESERVATIONS_KEY);
      const notifications = getFromDb<Notification>(NOTIFICATIONS_KEY);

      const updatedReservations = reservations.map((res) => {
        if (res.tripId === id && (res.status === 'PENDING' || res.status === 'ACCEPTED')) {
          // Notify passenger
          const notif: Notification = {
            id: `notif-${Date.now()}-${res.passengerId}`,
            userId: res.passengerId,
            title: 'Trajet Annulé',
            message: `Le conducteur a annulé le trajet ${res.trip.departure} -> ${res.trip.destination} du ${new Date(res.trip.dateTime).toLocaleDateString()}.`,
            type: 'TRIP_CANCELLED',
            read: false,
            createdAt: new Date().toISOString()
          };
          notifications.push(notif);
          
          return { ...res, status: 'CANCELLED' as const };
        }
        return res;
      });

      saveToDb(RESERVATIONS_KEY, updatedReservations);
      saveToDb(NOTIFICATIONS_KEY, notifications);
    } else {
      await api.delete(`/trips/${id}`);
    }
  },

  getMyTrips: async (driverId: string): Promise<Trip[]> => {
    await delay(500);

    if (IS_MOCK_MODE) {
      const trips = getFromDb<Trip>(TRIPS_KEY);
      return trips.filter((t) => t.driverId === driverId)
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    } else {
      const response = await api.get(`/drivers/${driverId}/trips`);
      return response.data;
    }
  }
};
