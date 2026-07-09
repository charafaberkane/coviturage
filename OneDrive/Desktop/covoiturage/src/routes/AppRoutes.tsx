import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Route guards & layout
import { ProtectedRoute, PublicRoute } from './ProtectedRoutes';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Passenger Pages
import { PassengerDashboardPage } from '../pages/passenger/PassengerDashboardPage';
import { SearchTripsPage } from '../pages/passenger/SearchTripsPage';
import { TripDetailsPage } from '../pages/passenger/TripDetailsPage';
import { ReservationsPage } from '../pages/passenger/ReservationsPage';
import { NotificationsPage } from '../pages/passenger/NotificationsPage';
import { ProfilePage } from '../pages/passenger/ProfilePage';

// Driver Pages
import { DriverDashboardPage } from '../pages/driver/DriverDashboardPage';
import { MyTripsPage } from '../pages/driver/MyTripsPage';
import { CreateTripPage } from '../pages/driver/CreateTripPage';
import { EditTripPage } from '../pages/driver/EditTripPage';
import { DriverReservationsPage } from '../pages/driver/DriverReservationsPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ManageUsersPage } from '../pages/admin/ManageUsersPage';
import { SuperviseTripsPage } from '../pages/admin/SuperviseTripsPage';
import StatisticsPage from '../pages/admin/StatisticsPage';

// Error Pages
import { NotFoundPage } from '../pages/errors/NotFoundPage';
import { ForbiddenPage } from '../pages/errors/ForbiddenPage';
import { ServerErrorPage } from '../pages/errors/ServerErrorPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public auth routes (restricted if logged-in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/passenger" replace />} />

      {/* Protected routes wrapped in common dashboard navigation layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          
          {/* Passenger routes (also visible to drivers) */}
          <Route path="/passenger" element={<PassengerDashboardPage />} />
          <Route path="/passenger/search" element={<SearchTripsPage />} />
          <Route path="/passenger/trips/:id" element={<TripDetailsPage />} />
          <Route path="/passenger/reservations" element={<ReservationsPage />} />
          <Route path="/passenger/notifications" element={<NotificationsPage />} />
          <Route path="/passenger/profile" element={<ProfilePage />} />

          {/* Driver specific routes (guarded by role) */}
          <Route element={<ProtectedRoute allowedRoles={['CONDUCTEUR', 'ADMIN']} />}>
            <Route path="/driver" element={<DriverDashboardPage />} />
            <Route path="/driver/trips" element={<MyTripsPage />} />
            <Route path="/driver/trips/new" element={<CreateTripPage />} />
            <Route path="/driver/trips/:id/edit" element={<EditTripPage />} />
            <Route path="/driver/reservations" element={<DriverReservationsPage />} />
            <Route path="/driver/notifications" element={<NotificationsPage />} /> {/* Shared notifications */}
            <Route path="/driver/profile" element={<ProfilePage />} /> {/* Shared profile */}
          </Route>

          {/* Admin specific routes (guarded by role) */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/trips" element={<SuperviseTripsPage />} />
            <Route path="/admin/statistics" element={<StatisticsPage />} />
          </Route>

        </Route>
      </Route>

      {/* Global Error Pages */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      
      {/* 404 fallback */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
export default AppRoutes;
