export type UserRole = 'PASSAGER' | 'CONDUCTEUR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  rating?: number;
  tripsCount?: number;
  isActive: boolean;
}

export type TripStatus = 'ACTIVE' | 'CANCELLED' | 'COMPLETED';

export interface Trip {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatarUrl?: string;
  driverRating?: number;
  departure: string;
  destination: string;
  dateTime: string;
  availableSeats: number;
  totalSeats: number;
  price: number; // 0 for free
  description?: string;
  carModel?: string;
  status: TripStatus;
}

export type ReservationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface Reservation {
  id: string;
  tripId: string;
  trip: Trip;
  passengerId: string;
  passengerName: string;
  passengerAvatarUrl?: string;
  seats: number;
  status: ReservationStatus;
  createdAt: string;
}

export type NotificationType = 
  | 'RESERVATION_REQUEST' 
  | 'RESERVATION_ACCEPTED' 
  | 'RESERVATION_REJECTED' 
  | 'TRIP_CANCELLED' 
  | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTrips: number;
  totalReservations: number;
  completionRate: number;
  activeUsersCount: number;
  tripsByDay: { date: string; count: number }[];
  reservationsByStatus: { status: ReservationStatus; count: number }[];
}
