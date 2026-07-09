import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, XCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { tripService } from '../../services/tripService';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export const SuperviseTripsPage: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all trips
  const { data: trips = [], isLoading, refetch } = useQuery({
    queryKey: ['admin_trips_list'],
    queryFn: adminService.getAllTrips,
  });

  // Admin cancel trip mutation
  const cancelMutation = useMutation({
    mutationFn: (tripId: string) => tripService.cancelTrip(tripId),
    onSuccess: () => {
      toast('Le covoiturage a été annulé par mesure administrative. Les passagers ont été avertis.', 'warning');
      queryClient.invalidateQueries({ queryKey: ['admin_trips_list'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
    },
    onError: (err: any) => {
      toast(err.message || "Erreur lors de l'annulation.", 'error');
    },
  });

  const handleCancelTrip = (tripId: string) => {
    if (window.confirm('Voulez-vous vraiment annuler ce trajet administrativement ?')) {
      cancelMutation.mutate(tripId);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-text">Supervision des Trajets</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Supervisez tous les trajets de covoiturage publiés sur la plateforme et intervenez si nécessaire.
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

      {/* Trips list */}
      <Card className="overflow-hidden p-0 border border-border rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-semibold text-slate-500">
            <thead>
              <tr className="bg-slate-50 text-text border-b border-border text-[10px] uppercase tracking-wider font-extrabold">
                <th className="py-4 px-5">Conducteur</th>
                <th className="py-4 px-5">Itinéraire</th>
                <th className="py-4 px-5">Date & Heure</th>
                <th className="py-4 px-5">Contribution</th>
                <th className="py-4 px-5">Statut</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {trips.map((item) => {
                const isActive = item.status === 'ACTIVE';
                const formattedDate = new Date(item.dateTime).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.driverAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                          alt={item.driverName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-100"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-text">{item.driverName}</span>
                          <span className="text-[10px] text-slate-400 font-bold">ID: {item.driverId}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 text-text font-bold">
                        <span>{item.departure}</span>
                        <span className="text-slate-300">→</span>
                        <span>{item.destination}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {item.availableSeats} / {item.totalSeats} places libres
                      </span>
                    </td>

                    <td className="py-4 px-5 font-bold text-text capitalize">
                      {formattedDate}
                    </td>

                    <td className="py-4 px-5 font-black text-sm text-primary">
                      {item.price === 0 ? 'Gratuit' : `${item.price.toFixed(2)} $`}
                    </td>

                    <td className="py-4 px-5">
                      <Badge variant={isActive ? 'accent' : 'slate'} className="text-[9px] uppercase font-bold px-2 py-0">
                        {isActive ? 'Actif' : 'Annulé'}
                      </Badge>
                    </td>

                    <td className="py-4 px-5 text-right">
                      {isActive ? (
                        <Button
                          onClick={() => handleCancelTrip(item.id)}
                          disabled={cancelMutation.isPending}
                          variant="outline"
                          size="sm"
                          leftIcon={<XCircle className="w-3.5 h-3.5 text-danger" />}
                          className="text-danger border-red-100 hover:bg-red-50 hover:border-red-300"
                        >
                          Annuler
                        </Button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic font-medium pr-4">
                          Aucune action
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
export default SuperviseTripsPage;
