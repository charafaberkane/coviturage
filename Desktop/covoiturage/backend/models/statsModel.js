// ===================================
// Modèle Statistiques
// ===================================
// Requêtes SQL pour les statistiques admin

const { pool } = require('../config/db');

const StatsModel = {
  // Récupérer toutes les statistiques
  getStats: async () => {
    // Nombre total d'utilisateurs
    const [usersCount] = await pool.query('SELECT COUNT(*) AS total FROM utilisateurs');

    // Nombre total de trajets
    const [tripsCount] = await pool.query('SELECT COUNT(*) AS total FROM trajets');

    // Nombre total de réservations
    const [reservationsCount] = await pool.query('SELECT COUNT(*) AS total FROM reservations');

    // Utilisateurs actifs
    const [activeUsers] = await pool.query('SELECT COUNT(*) AS total FROM utilisateurs WHERE est_actif = TRUE');

    // Taux de complétion (trajets COMPLETED / total trajets)
    const [completedTrips] = await pool.query(
      "SELECT COUNT(*) AS total FROM trajets WHERE statut = 'COMPLETED'"
    );
    const totalTrips = tripsCount[0].total;
    const completionRate = totalTrips > 0
      ? Math.round((completedTrips[0].total / totalTrips) * 100)
      : 0;

    // Trajets par jour (7 derniers jours)
    const [tripsByDay] = await pool.query(
      `SELECT DATE(date_creation) AS date, COUNT(*) AS count
       FROM trajets
       WHERE date_creation >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(date_creation)
       ORDER BY date ASC`
    );

    // Réservations par statut
    const [reservationsByStatus] = await pool.query(
      `SELECT statut AS status, COUNT(*) AS count
       FROM reservations
       GROUP BY statut`
    );

    return {
      totalUsers: usersCount[0].total,
      totalTrips: totalTrips,
      totalReservations: reservationsCount[0].total,
      activeUsersCount: activeUsers[0].total,
      completionRate,
      tripsByDay,
      reservationsByStatus
    };
  }
};

module.exports = StatsModel;
