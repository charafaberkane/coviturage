import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Star, Users, Check, X, RefreshCw, Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { tripService } from '../../services/tripService';
import { reservationService } from '../../services/reservationService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';


export const DriverDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch driver proposed trips
  const { data: trips = [], isLoading: tripsLoading } = useQuery({
    queryKey: ['driver_trips', user?.id],
    queryFn: () => (user ? tripService.getMyTrips(user.id) : []),
    enabled: !!user,
  });

  // Fetch driver received reservations
  const { data: reservations = [], isLoading: resLoading, refetch } = useQuery({
    queryKey: ['driver_reservations', user?.id],
    queryFn: () => (user ? reservationService.getReservationsForDriver(user.id) : []),
    enabled: !!user,
  });

  // Accept reservation mutation
  const acceptMutation = useMutation({
    mutationFn: (resId: string) => reservationService.acceptReservation(resId),
    onSuccess: () => {
      toast('Réservation acceptée avec succès.', 'success');
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

  const activeTripsCount = trips.filter((t) => t.status === 'ACTIVE').length;
  const pendingRequests = reservations.filter((r) => r.status === 'PENDING');

  const handleRefresh = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ['driver_trips', user?.id] });
  };

  return (
    <div className="flex flex-col gap-8 text-left pb-10 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-text">Espace Conducteur</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Gérez vos annonces de covoiturage, examinez les demandes et configurez vos trajets.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Actualiser
          </Button>
          <Button
            onClick={() => navigate('/driver/trips/new')}
            variant="primary"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Proposer un trajet
          </Button>
        </div>
      </div>

      {/* Driver Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Car className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-text">{activeTripsCount}</span>
            <span className="text-xs font-semibold text-slate-400">Annonces actives</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center text-warning animate-pulse">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-text">{pendingRequests.length}</span>
            <span className="text-xs font-semibold text-slate-400">Demandes en attente</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-text">{user?.rating ? user.rating.toFixed(1) : '5.0'}</span>
            <span className="text-xs font-semibold text-slate-400">Note moyenne conducteur</span>
          </div>
        </Card>
      </div>

      {/* Main sections layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Pending requests */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-text flex items-center justify-between">
            <span>Demandes de réservation en attente</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-600">
              {pendingRequests.length} nouvelle(s)
            </span>
          </h2>

          {resLoading ? (
            <div className="py-12"><Spinner /></div>
          ) : pendingRequests.length > 0 ? (
            <div className="flex flex-col gap-4">
              {pendingRequests.map((req) => {
                const dateStr = new Date(req.trip.dateTime).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <Card key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={req.passengerAvatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'}
                        alt={req.passengerName}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div className="flex flex-col gap-1 text-xs">
                        <div>
                          Passager : <span className="text-text font-bold">{req.passengerName}</span>
                        </div>
                        <div className="text-slate-500 font-semibold">
                          Trajet : <span className="text-text">{req.trip.departure} → {req.trip.destination}</span> | {dateStr}
                        </div>
                        <div className="text-slate-400">
                          Places demandées : <span className="font-bold text-slate-600">{req.seats} place(s)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0 justify-end">
                      <Button
                        onClick={() => rejectMutation.mutate(req.id)}
                        disabled={rejectMutation.isPending || acceptMutation.isPending}
                        variant="outline"
                        size="sm"
                        leftIcon={<X className="w-3.5 h-3.5" />}
                        className="text-danger hover:bg-red-50 border-red-100"
                      >
                        Refuser
                      </Button>
                      <Button
                        onClick={() => acceptMutation.mutate(req.id)}
                        disabled={rejectMutation.isPending || acceptMutation.isPending}
                        variant="accent"
                        size="sm"
                        leftIcon={<Check className="w-3.5 h-3.5" />}
                      >
                        Accepter
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="py-12 text-center text-slate-400 font-medium">
              Aucune demande de réservation en attente.
            </Card>
          )}
        </div>

        {/* Right Col: Propose/Quick list */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-text">Dernières annonces</h2>
          {tripsLoading ? (
            <div className="py-12"><Spinner /></div>
          ) : trips.length > 0 ? (
            <div className="flex flex-col gap-4">
              {trips.slice(0, 3).map((t) => (
                <Card key={t.id} className="p-4 text-xs font-semibold text-slate-500 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text">{t.departure} → {t.destination}</span>
                    <Badge variant={t.status === 'ACTIVE' ? 'accent' : 'slate'} className="text-[9px]">
                      {t.status === 'ACTIVE' ? 'Actif' : 'Annulé'}
                    </Badge>
                  </div>
                  <div>
                    Départ : {new Date(t.dateTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à{' '}
                    {new Date(t.dateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <span>{t.availableSeats} places libres</span>
                    <Link to="/driver/trips" className="text-primary hover:underline font-bold text-[10px]">
                      Gérer mes trajets
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="py-12 text-center text-slate-400 font-medium">
              Aucun trajet proposé.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
export default DriverDashboardPage;
