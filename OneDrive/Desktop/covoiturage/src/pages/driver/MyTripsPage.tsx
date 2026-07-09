import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Edit, Trash2, AlertTriangle, PlusCircle, RefreshCw, Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { tripService } from '../../services/tripService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export const MyTripsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Fetch proposed trips
  const { data: trips = [], isLoading, refetch } = useQuery({
    queryKey: ['driver_trips', user?.id],
    queryFn: () => (user ? tripService.getMyTrips(user.id) : []),
    enabled: !!user,
  });

  // Cancel trip mutation
  const cancelMutation = useMutation({
    mutationFn: (tripId: string) => tripService.cancelTrip(tripId),
    onSuccess: () => {
      toast('Trajet annulé avec succès. Les passagers ont été informés.', 'success');
      queryClient.invalidateQueries({ queryKey: ['driver_trips', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['driver_reservations', user?.id] });
      setCancelModalOpen(false);
    },
    onError: (err: any) => {
      toast(err.message || "Impossible d'annuler ce trajet.", 'error');
    },
  });

  const openCancelModal = (tripId: string) => {
    setSelectedTripId(tripId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedTripId) {
      cancelMutation.mutate(selectedTripId);
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
    <div className="flex flex-col gap-6 text-left pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-text">Mes Trajets Proposés</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Visualisez et gérez les trajets que vous avez publiés pour les passagers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
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
            leftIcon={<PlusCircle className="w-4.5 h-4.5" />}
          >
            Proposer un trajet
          </Button>
        </div>
      </div>

      {/* Trips list */}
      {trips.length > 0 ? (
        <div className="flex flex-col gap-5">
          {trips.map((trip) => {
            const dateStr = new Date(trip.dateTime).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const isActive = trip.status === 'ACTIVE';

            return (
              <Card key={trip.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex flex-col gap-3">
                  {/* Status & car model */}
                  <div className="flex items-center gap-3">
                    <Badge variant={isActive ? 'accent' : 'slate'} className="text-[10px] uppercase font-bold py-0.5 px-2.5">
                      {isActive ? 'Actif' : 'Annulé'}
                    </Badge>
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <Car className="w-3.5 h-3.5" />
                      {trip.carModel || 'Véhicule'}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2 text-text">
                    <span className="font-extrabold text-sm">{trip.departure}</span>
                    <span className="text-slate-300">→</span>
                    <span className="font-extrabold text-sm">{trip.destination}</span>
                  </div>

                  {/* Date, seats */}
                  <div className="flex flex-col gap-1 text-slate-500 font-semibold text-xs">
                    <div className="flex items-center gap-1.5 capitalize">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dateStr}</span>
                    </div>
                    <div>
                      Places réservées :{' '}
                      <span className="text-text font-bold">
                        {trip.totalSeats - trip.availableSeats} / {trip.totalSeats}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
                  <div className="text-right md:mr-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Tarif</span>
                    <span className="text-base font-black text-primary">
                      {trip.price === 0 ? 'Gratuit' : `${trip.price.toFixed(2)} $`}
                    </span>
                  </div>

                  {isActive && (
                    <>
                      <Button
                        onClick={() => navigate(`/driver/trips/${trip.id}/edit`)}
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit className="w-3.5 h-3.5" />}
                      >
                        Modifier
                      </Button>
                      
                      <Button
                        onClick={() => openCancelModal(trip.id)}
                        variant="outline"
                        size="sm"
                        leftIcon={<Trash2 className="w-3.5 h-3.5 text-danger" />}
                        className="text-danger border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        Annuler
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="py-20 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Car className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-text">Aucun trajet proposé</h3>
            <p className="text-sm text-slate-500 font-medium max-w-sm">
              Vous n'avez pas encore proposé d'annonces de covoiturage.
            </p>
          </div>
        </Card>
      )}

      {/* Confirmation cancel trip dialog */}
      <AnimatePresence>
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white border border-border rounded-2xl p-6 shadow-premium max-w-sm w-full text-left flex flex-col gap-4 z-10"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 text-danger flex items-center justify-center border border-red-100">
                <AlertTriangle className="w-5.5 h-5.5" />
              </div>

              <div>
                <h3 className="text-base font-bold text-text">Annuler ce trajet ?</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Cette action annulera définitivement le trajet et enverra des notifications d'annulation à tous les passagers ayant réservé.
                </p>
              </div>

              <div className="flex gap-3 mt-2">
                <Button onClick={() => setCancelModalOpen(false)} variant="outline" className="flex-1">
                  Retour
                </Button>
                <Button
                  onClick={handleConfirmCancel}
                  isLoading={cancelMutation.isPending}
                  variant="danger"
                  className="flex-1"
                >
                  Oui, annuler le trajet
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default MyTripsPage;
