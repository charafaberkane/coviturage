import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, BarChart3, TrendingUp, Award } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export const StatisticsPage: React.FC = () => {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['admin_stats'],
    queryFn: adminService.getAdminStats,
  });

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto my-12 text-slate-500 font-medium">
        Impossible de charger les statistiques détaillées.
      </Card>
    );
  }

  // Find max count to scale graph columns dynamically
  const maxTripCount = Math.max(...stats.tripsByDay.map(d => d.count), 1);

  return (
    <div className="flex flex-col gap-6 text-left pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-text flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Statistiques & Rapports
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Suivez la croissance de la communauté CovoitGo et l'adoption du covoiturage.
          </p>
        </div>

        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Actualiser
        </Button>
      </div>

      {/* Stats Breakdown cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col gap-1.5 p-5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Remplissage Moyen</span>
          <span className="text-2xl font-black text-text">84 %</span>
          <div className="mt-2 text-xs font-bold text-accent flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+4.2% ce mois-ci</span>
          </div>
        </Card>

        <Card className="flex flex-col gap-1.5 p-5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Utilisateurs Actifs</span>
          <span className="text-2xl font-black text-text">{stats.activeUsersCount} / {stats.totalUsers}</span>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block">
            {(stats.activeUsersCount / stats.totalUsers * 100).toFixed(0)}% des inscrits sont actifs
          </span>
        </Card>

        <Card className="flex flex-col gap-1.5 p-5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Taux de validation</span>
          <span className="text-2xl font-black text-text">92.4 %</span>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block flex items-center gap-1 text-accent">
            <Award className="w-3.5 h-3.5" />
            Excellent taux d'acceptation conducteur
          </span>
        </Card>
      </div>

      {/* Visual Graphs Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trips proposed per day graph */}
        <Card className="p-6 lg:col-span-2 flex flex-col gap-6">
          <div>
            <h3 className="text-base font-bold text-text">Activité de publication (7 derniers jours)</h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-1">
              Nombre de trajets proposés par jour sur CovoitGo.
            </p>
          </div>

          {/* Bar Chart Container */}
          <div className="h-60 flex items-end gap-3 justify-between pt-6 border-b border-slate-100 px-4">
            {stats.tripsByDay.map((day) => {
              const pct = (day.count / maxTripCount) * 80 + 10; // Scale from 10% to 90%
              
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip */}
                  <span className="opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-opacity pointer-events-none mb-1">
                    {day.count} trajets
                  </span>
                  
                  {/* Bar */}
                  <div
                    style={{ height: `${pct}%` }}
                    className="w-full rounded-t-lg bg-primary/20 group-hover:bg-primary transition-all duration-300 shadow-sm"
                  />
                  
                  {/* Label */}
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Global Distribution summary */}
        <Card className="p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-base font-bold text-text">Répartition des Réservations</h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-1">
              État général de toutes les transactions de réservation.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {stats.reservationsByStatus.map((item) => {
              const labelMap: Record<string, string> = {
                ACCEPTED: 'Acceptées',
                PENDING: 'En attente',
                REJECTED: 'Refusées',
                CANCELLED: 'Annulées',
              };

              const colorMap: Record<string, string> = {
                ACCEPTED: 'bg-accent',
                PENDING: 'bg-warning',
                REJECTED: 'bg-danger',
                CANCELLED: 'bg-slate-300',
              };

              const pct = stats.totalReservations > 0 
                ? (item.count / stats.totalReservations) * 100 
                : 0;

              return (
                <div key={item.status} className="flex flex-col gap-1.5 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-text">{labelMap[item.status] || item.status}</span>
                    <span>{pct.toFixed(1)}% ({item.count})</span>
                  </div>
                  {/* Progress Bar background */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full ${colorMap[item.status] || 'bg-slate-400'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </div>
  );
};
export default StatisticsPage;
