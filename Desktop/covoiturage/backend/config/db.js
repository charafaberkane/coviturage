// ===================================
// Configuration de la connexion MySQL
// ===================================
const mysql = require('mysql2/promise');

// Créer un pool de connexions (plus performant qu'une seule connexion)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,       // Maximum 10 connexions simultanées
  queueLimit: 0              // Pas de limite sur la file d'attente
});

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion MySQL réussie !');
    connection.release(); // Libérer la connexion
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL :', error.message);
    process.exit(1); // Arrêter le serveur si pas de connexion
  }
};

module.exports = { pool, testConnection };
