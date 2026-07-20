// ===================================
// Contrôleur Statistiques (Admin)
// ===================================
const StatsModel = require('../models/statsModel');

const statsController = {
  // ---- GET /api/stats (Admin) ----
  getStats: async (req, res) => {
    try {
      const stats = await StatsModel.getStats();
      
      // Formater pour correspondre à AdminStats dans le frontend
      const formattedStats = {
        totalUsers: stats.totalUsers,
        totalTrips: stats.totalTrips,
        totalReservations: stats.totalReservations,
        completionRate: stats.completionRate,
        activeUsersCount: stats.activeUsersCount,
        tripsByDay: stats.tripsByDay.map(d => ({
          date: d.date.toISOString().split('T')[0], // YYYY-MM-DD
          count: d.count
        })),
        reservationsByStatus: stats.reservationsByStatus.map(r => ({
          status: r.status,
          count: r.count
        }))
      };

      res.json({
        success: true,
        data: formattedStats
      });
    } catch (error) {
      console.error('Erreur getStats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques.'
      });
    }
  }
};

module.exports = statsController;
