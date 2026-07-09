import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { reservationService } from '../../services/reservationService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export const DriverReservationsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted'>('all');

  // Fetch driver received reservations
  const { data: reservations = [], isLoading, refetch } = useQuery({
    queryKey: ['driver_reservations', user?.id],
    queryFn: () => (user ? reservationService.getReservationsForDriver(user.id) : []),
    enabled: !!user,
  });

  // Accept reservation mutation
  const acceptMutation = useMutation({
    mutationFn: (resId: string) => reservationService.acceptReservation(resId),
    onSuccess: () => {
      toast('Réservation acceptée.', 'success');
      queryClient.invalidateQueries({ queryKey: ['driver_reservations', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['driver_trips', user?.id] });
    },
    onError: (err: any) => {
      toast(err.message || 'Erreur lors de la validation.', 'error');
    },
  });

  // Reject reservation mutation
  const rejectMutation = useMutation({
    mutationFn: (resId: string) => reservationService.rejectReservation(resId),
    onSuccess: () => {
      toast('Réservation refusée.', 'warning');
      queryClient.invalidateQueries({ queryKey: ['driver_reservations', user?.id] });
    },
    onError: (err: any) => {
      toast(err.message || 'Erreur lors de la validation.', 'error');
    },
  });

  const filteredReservations = reservations.filter((res) => {
    if (activeTab === 'pending') return res.status === 'PENDING';
    if (activeTab === 'accepted') return res.status === 'ACCEPTED';
    return true;
  });

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-text">Demandes de Réservation</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Gérez les demandes d'inscription reçues pour vos annonces de covoiturage.
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-2 font-bold text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'all' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Toutes ({reservations.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pending' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          En attente ({reservations.filter((r) => r.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'accepted' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Acceptées ({reservations.filter((r) => r.status === 'ACCEPTED').length})
        </button>
      </div>

      {/* List */}
      {filteredReservations.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredReservations.map((res) => {
            const dateStr = new Date(res.trip.dateTime).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            // Map status variants
            const statusMap: Record<string, 'accent' | 'warning' | 'danger' | 'slate'> = {
              ACCEPTED: 'accent',
              PENDING: 'warning',
              REJECTED: 'danger',
              CANCELLED: 'slate',
            };

            const statusLabels: Record<string, string> = {
              ACCEPTED: 'Acceptée',
              PENDING: 'En attente',
              REJECTED: 'Refusée',
              CANCELLED: 'Annulée',
            };

            return (
              <Card key={res.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={res.passengerAvatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'}
                    alt={res.passengerName}
                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-100"
                  />
                  
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-text">{res.passengerName}</span>
                      <Badge variant={statusMap[res.status] || 'slate'} className="text-[9px] px-2 py-0">
                        {statusLabels[res.status] || res.status}
                      </Badge>
                    </div>

                    <div className="text-slate-500 font-semibold mt-0.5">
                      Trajet : <span className="text-text font-bold">{res.trip.departure} → {res.trip.destination}</span> | {dateStr}
                    </div>

                    <div className="text-slate-400 font-semibold flex items-center gap-4 flex-wrap mt-0.5">
                      <span>Places réservées : <span className="text-slate-600 font-bold">{res.seats}</span></span>
                      <span>Total : <span className="text-slate-600 font-bold">{res.trip.price === 0 ? 'Gratuit' : `${(res.trip.price * res.seats).toFixed(2)} $`}</span></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0 w-full md:w-auto justify-end">
                  {res.status === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => rejectMutation.mutate(res.id)}
                        disabled={rejectMutation.isPending || acceptMutation.isPending}
                        variant="outline"
                        size="sm"
                        leftIcon={<X className="w-3.5 h-3.5" />}
                        className="text-danger border-red-100 hover:bg-red-50"
                      >
                        Refuser
                      </Button>
                      <Button
                        onClick={() => acceptMutation.mutate(res.id)}
                        disabled={rejectMutation.isPending || acceptMutation.isPending}
                        variant="accent"
                        size="sm"
                        leftIcon={<Check className="w-3.5 h-3.5" />}
                      >
                        Accepter
                      </Button>
                    </>
                  )}

                  {res.status === 'ACCEPTED' && (
                    <Button
                      onClick={() => rejectMutation.mutate(res.id)}
                      disabled={rejectMutation.isPending}
                      variant="outline"
                      size="sm"
                      leftIcon={<X className="w-3.5 h-3.5" />}
                      className="text-danger border-red-100 hover:bg-red-50"
                    >
                      Annuler la place
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="py-20 text-center text-slate-400 font-medium">
          Aucune demande ne correspond à ces critères.
        </Card>
      )}
    </div>
  );
};
export default DriverReservationsPage;
