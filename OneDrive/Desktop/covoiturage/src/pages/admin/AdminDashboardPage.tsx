import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Shield, Users, Car, Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';

export const AdminDashboardPage: React.FC = () => {
  // Fetch admin stats
  const { data: stats, isLoading, error } = useQuery({
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
        Impossible de charger les statistiques d'administration.
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-text flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Administration CovoitGo
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Supervisez l'activité de la plateforme, les inscriptions, les trajets et les réservations.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="flex items-center gap-4 p-5">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Users className="w-5.5 h-5.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-text">{stats.totalUsers}</span>
            <span className="text-[11px] font-bold text-slate-400">Utilisateurs inscrits</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <Car className="w-5.5 h-5.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-text">{stats.totalTrips}</span>
            <span className="text-[11px] font-bold text-slate-400">Trajets proposés</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Calendar className="w-5.5 h-5.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-text">{stats.totalReservations}</span>
            <span className="text-[11px] font-bold text-slate-400">Réservations effectuées</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-text">{stats.completionRate} %</span>
            <span className="text-[11px] font-bold text-slate-400">Taux de complétion</span>
          </div>
        </Card>
      </div>

      {/* Main dashboard rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Quick Administration Actions */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-bold text-text">Actions rapides</h2>
          <div className="flex flex-col gap-2">
            <Link
              to="/admin/users"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-primary/5 hover:border-primary/20 transition-all font-bold text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-500" />
                <span>Gérer les comptes utilisateurs</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin/trips"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-primary/5 hover:border-primary/20 transition-all font-bold text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-slate-500" />
                <span>Superviser tous les trajets</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin/statistics"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-primary/5 hover:border-primary/20 transition-all font-bold text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-slate-500" />
                <span>Consulter les rapports statistiques</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Card>

        {/* Activity Summary / Statuses */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-bold text-text">Statut des réservations</h2>
          <div className="flex flex-col gap-3 font-semibold text-xs text-slate-500">
            {stats.reservationsByStatus.map((item) => {
              const labelMap: Record<string, string> = {
                ACCEPTED: 'Acceptées',
                PENDING: 'En attente',
                REJECTED: 'Refusées',
                CANCELLED: 'Annulées',
              };

              const badgeMap: Record<string, 'accent' | 'warning' | 'danger' | 'slate'> = {
                ACCEPTED: 'accent',
                PENDING: 'warning',
                REJECTED: 'danger',
                CANCELLED: 'slate',
              };

              return (
                <div key={item.status} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <Badge variant={badgeMap[item.status] || 'slate'}>
                    {labelMap[item.status] || item.status}
                  </Badge>
                  <span className="text-sm font-bold text-text">{item.count} réservations</span>
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </div>
  );
};
export default AdminDashboardPage;
