import type { User, Trip, Reservation, Notification } from '../types';

const USERS_KEY = 'covoitgo_users';
const TRIPS_KEY = 'covoitgo_trips';
const RESERVATIONS_KEY = 'covoitgo_reservations';
const NOTIFICATIONS_KEY = 'covoitgo_notifications';

// Seed data helper
export const initializeMockDb = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const users: User[] = [
      {
        id: 'user-admin',
        name: 'Alexandre Martin',
        email: 'admin@covoitgo.com',
        role: 'ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        phone: '+33 6 12 34 56 78',
        bio: 'Administrateur de la plateforme CovoitGo.',
        isActive: true,
      },
      {
        id: 'user-driver',
        name: 'Sophie Dubois',
        email: 'conducteur@covoitgo.com',
        role: 'CONDUCTEUR',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        phone: '+33 6 98 76 54 32',
        bio: 'Conductrice régulière entre Paris et Lille. Adore discuter de musique et de technologie.',
        rating: 4.8,
        tripsCount: 42,
        isActive: true,
      },
      {
        id: 'user-passenger',
        name: 'Thomas Bernard',
        email: 'passager@covoitgo.com',
        role: 'PASSAGER',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        phone: '+33 6 11 22 33 44',
        bio: 'Étudiant voyageant régulièrement le week-end pour voir sa famille.',
        rating: 4.5,
        tripsCount: 15,
        isActive: true,
      },
      {
        id: 'user-other',
        name: 'Lucas Petit',
        email: 'lucas@covoitgo.com',
        role: 'PASSAGER',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        phone: '+33 6 55 66 77 88',
        bio: 'Passionné de voyages et de covoiturage écologique.',
        rating: 4.9,
        tripsCount: 8,
        isActive: true,
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  if (!localStorage.getItem(TRIPS_KEY)) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 4);
    nextWeek.setHours(17, 30, 0, 0);

    const trips: Trip[] = [
      {
        id: 'trip-1',
        driverId: 'user-driver',
        driverName: 'Sophie Dubois',
        driverAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        driverRating: 4.8,
        departure: 'Paris',
        destination: 'Lille',
        dateTime: tomorrow.toISOString(),
        availableSeats: 3,
        totalSeats: 4,
        price: 15,
        description: 'Départ du métro Porte de la Chapelle. Voiture propre, non-fumeur, grand coffre disponible.',
        carModel: 'Peugeot e-208',
        status: 'ACTIVE'
      },
      {
        id: 'trip-2',
        driverId: 'user-driver',
        driverName: 'Sophie Dubois',
        driverAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        driverRating: 4.8,
        departure: 'Lille',
        destination: 'Paris',
        dateTime: nextWeek.toISOString(),
        availableSeats: 4,
        totalSeats: 4,
        price: 18,
        description: 'Retour sur Paris. Point de rendez-vous à la Gare Lille Europe. Pause de 10 min prévue.',
        carModel: 'Peugeot e-208',
        status: 'ACTIVE'
      },
      {
        id: 'trip-3',
        driverId: 'user-admin', // Admin acting as driver too
        driverName: 'Alexandre Martin',
        driverAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        driverRating: 5.0,
        departure: 'Lyon',
        destination: 'Marseille',
        dateTime: tomorrow.toISOString(),
        availableSeats: 2,
        totalSeats: 3,
        price: 22,
        description: 'Voyage professionnel. Coffre encombré par des cartons, donc petits bagages uniquement.',
        carModel: 'Tesla Model 3',
        status: 'ACTIVE'
      }
    ];
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  }

  if (!localStorage.getItem(RESERVATIONS_KEY)) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const trips = JSON.parse(localStorage.getItem(TRIPS_KEY) || '[]');
    const trip1 = trips.find((t: any) => t.id === 'trip-1') || trips[0];

    const reservations: Reservation[] = [
      {
        id: 'res-1',
        tripId: 'trip-1',
        trip: trip1,
        passengerId: 'user-passenger',
        passengerName: 'Thomas Bernard',
        passengerAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        seats: 1,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
  }

  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    const notifications: Notification[] = [
      {
        id: 'notif-1',
        userId: 'user-driver',
        title: 'Nouvelle demande de réservation',
        message: 'Thomas Bernard souhaite réserver 1 place pour votre trajet Paris -> Lille.',
        type: 'RESERVATION_REQUEST',
        read: false,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }
};

// Generic DB getters & setters
export const getFromDb = <T>(key: string): T[] => {
  initializeMockDb();
  return JSON.parse(localStorage.getItem(key) || '[]');
};

export const saveToDb = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export { USERS_KEY, TRIPS_KEY, RESERVATIONS_KEY, NOTIFICATIONS_KEY };
