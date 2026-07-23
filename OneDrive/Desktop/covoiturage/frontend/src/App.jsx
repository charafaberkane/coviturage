import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import TripList from './pages/TripList';
import CreateTrip from './pages/CreateTrip';
import EditTrip from './pages/EditTrip';
import PassengerReservations from './pages/PassengerReservations';
import DriverRequests from './pages/DriverRequests';
import AdminDashboard from './pages/AdminDashboard';
import AdminTripDetails from './pages/AdminTripDetails';
import AdminReservationDetails from './pages/AdminReservationDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirection automatique de la racine vers /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes protégées */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips" 
          element={
            <ProtectedRoute>
              <TripList />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips/create" 
          element={
            <ProtectedRoute>
              <CreateTrip />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips/edit/:id" 
          element={
            <ProtectedRoute>
              <EditTrip />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/reservations/passenger" 
          element={
            <ProtectedRoute>
              <PassengerReservations />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/reservations/driver" 
          element={
            <ProtectedRoute>
              <DriverRequests />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/admin/trips/:id"
          element={
            <ProtectedRoute>
              <AdminTripDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reservations/:id"
          element={
            <ProtectedRoute>
              <AdminReservationDetails />
            </ProtectedRoute>
          }
        />

        {/* Route de capture globale : redirige vers /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
