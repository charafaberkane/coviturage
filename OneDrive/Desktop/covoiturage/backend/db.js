// Configuration simple pour se connecter à MySQL avec mysql2
const mysql = require('mysql2');
require('dotenv').config();

// Création d'un pool de connexions (plus efficace et évite de fermer la connexion manuellement)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'covoiturage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exporter la version du pool basée sur les Promesses pour utiliser async/await plus facilement
const promisePool = pool.promise();

module.exports = promisePool;
