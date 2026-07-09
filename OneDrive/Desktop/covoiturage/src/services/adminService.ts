import { api, IS_MOCK_MODE, delay } from './api';
import { getFromDb, saveToDb, USERS_KEY, TRIPS_KEY, RESERVATIONS_KEY } from './mockData';
import type { User, Trip, Reservation, AdminStats, ReservationStatus } from '../types';

export const adminService = {
  getAdminStats: async (): Promise<AdminStats> => {
    await delay(700);

    if (IS_MOCK_MODE) {
      const users = getFromDb<User>(USERS_KEY);
      const trips = getFromDb<Trip>(TRIPS_KEY);
      const reservations = getFromDb<Reservation>(RESERVATIONS_KEY);

      const cancelledTrips = trips.filter((t) => t.status === 'CANCELLED').length;
      const totalTripsCount = trips.length;
      
      const completionRate = totalTripsCount > 0 
        ? Math.round(((totalTripsCount - cancelledTrips) / totalTripsCount) * 100) 
        : 100;

      // Group reservations by status
      const statuses: ReservationStatus[] = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'];
      const reservationsByStatus = statuses.map((status) => ({
        status,
        count: reservations.filter((r) => r.status === status).length
      }));

      // Dummy last 7 days of trip metrics
      const tripsByDay = Array.from({ length: 7 }).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        const dateStr = date.toLocaleDateString('fr-FR', { weekday: 'short' });
        
        // Random count or distribute based on trips created in DB
        return {
          date: dateStr,
          count: trips.filter(t => new Date(t.dateTime).toDateString() === date.toDateString()).length + (index % 2 === 0 ? 2 : 1)
        };
      });

      return {
        totalUsers: users.length,
        totalTrips: totalTripsCount,
        totalReservations: reservations.length,
        completionRate,
        activeUsersCount: users.filter((u) => u.isActive).length,
        tripsByDay,
        reservationsByStatus
      };
    } else {
      const response = await api.get('/admin/stats');
      return response.data;
    }
  },

  toggleUserStatus: async (userId: string, isActive: boolean): Promise<User> => {
    await delay(500);

    if (IS_MOCK_MODE) {
      const users = getFromDb<User>(USERS_KEY);
      const index = users.findIndex((u) => u.id === userId);

      if (index === -1) {
        throw new Error('Utilisateur introuvable.');
      }

      users[index].isActive = isActive;
      saveToDb(USERS_KEY, users);

      return users[index];
    } else {
      const response = await api.post(`/admin/users/${userId}/toggle`, { isActive });
      return response.data;
    }
  },

  getAllTrips: async (): Promise<Trip[]> => {
    await delay(500);

    if (IS_MOCK_MODE) {
      return getFromDb<Trip>(TRIPS_KEY);
    } else {
      const response = await api.get('/admin/trips');
      return response.data;
    }
  }
};
