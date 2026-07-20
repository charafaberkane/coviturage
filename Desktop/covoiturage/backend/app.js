// ===================================
// Configuration Express (app.js)
// ===================================
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tripRoutes = require('./routes/trips');
const reservationRoutes = require('./routes/reservations');
const notificationRoutes = require('./routes/notifications');
const statsRoutes = require('./routes/stats');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enregistrement des routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);

// Route de test par défaut
app.get('/', (req, res) => {
  res.json({
    message: 'API Covoiturage - Bienvenue !',
    version: '1.0.0'
  });
});

// Middleware de gestion d'erreurs global (doit être après les routes)
app.use(errorHandler);

module.exports = app;
