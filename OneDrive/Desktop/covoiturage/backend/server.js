// ===================================
// Point d'entrée du serveur (server.js)
// ===================================

// Charger les variables d'environnement EN PREMIER
require('dotenv').config();

const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Démarrer le serveur
const startServer = async () => {
  // 1. Tester la connexion MySQL
  await testConnection();

  // 2. Lancer le serveur Express
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
  });
};

startServer();
