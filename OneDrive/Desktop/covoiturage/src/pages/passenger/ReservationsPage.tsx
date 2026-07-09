import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { reservationService } from '../../services/reservationService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';


export const ReservationsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedResId, setSelectedResId] = useState<string | null>(null);

  // Fetch passenger reservations
  const { data: reservations = [], isLoading, refetch } = useQuery({
    queryKey: ['passenger_reservations', user?.id],
    queryFn: () => (user ? reservationService.getReservationsForPassenger(user.id) : []),
    enabled: !!user,
  });

  // Cancel reservation mutation
  const cancelMutation = useMutation({
    mutationFn: (resId: string) => reservationService.cancelReservation(resId, user?.id || ''),
    onSuccess: () => {
      toast('Réservation annulée avec succès.', 'success');
      queryClient.invalidateQueries({ queryKey: ['passenger_reservations', user?.id] });
      setCancelModalOpen(false);
    },
    onError: (err: any) => {
      toast(err.message || "Échec de l'annulation.", 'error');
    },
  });

  const openCancelModal = (resId: string) => {
    setSelectedResId(resId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedResId) {
      cancelMutation.mutate(selectedResId);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text">Mes Réservations</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Suivez l'état de vos réservations de trajet et gérez vos réservations actives.
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

      {/* Grid List of reservations */}
      {reservations.length > 0 ? (
        <div className="flex flex-col gap-5">
          {reservations.map((res) => {
            const dateStr = new Date(res.trip.dateTime).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
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

            const statusVar = statusMap[res.status] || 'slate';
            const statusLab = statusLabels[res.status] || res.status;

            return (
              <Card key={res.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex flex-col gap-3 text-left">
                  {/* Status and date */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant={statusVar} className="text-[10px] uppercase font-bold py-0.5 px-2.5">
                      {statusLab}
                    </Badge>
                    <span className="text-[11px] font-semibold text-slate-400 capitalize">
                      Demande effectuée le {new Date(res.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  {/* Route details */}
                  <div className="flex items-center gap-2 flex-wrap text-text">
                    <span className="font-extrabold text-sm">{res.trip.departure}</span>
                    <span className="text-slate-300">→</span>
                    <span className="font-extrabold text-sm">{res.trip.destination}</span>
                  </div>

                  {/* Travel details */}
                  <div className="flex flex-col gap-1 text-slate-500 font-semibold text-xs">
                    <div className="flex items-center gap-1.5 capitalize">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dateStr}</span>
                    </div>
                    <div>
                      Conducteur : <span className="text-text font-bold">{res.trip.driverName}</span> | Place(s) réservée(s) :{' '}
                      <span className="text-text font-bold">{res.seats}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                  <div className="text-right sm:mr-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Contribution</span>
                    <span className="text-base font-black text-primary">
                      {res.trip.price === 0 ? 'Gratuit' : `${(res.trip.price * res.seats).toFixed(2)} $`}
                    </span>
                  </div>

                  {(res.status === 'PENDING' || res.status === 'ACCEPTED') && (
                    <Button
                      onClick={() => openCancelModal(res.id)}
                      variant="outline"
                      size="sm"
                      leftIcon={<Trash2 className="w-3.5 h-3.5 text-danger" />}
                      className="text-danger border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="py-20 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-text">Aucune réservation</h3>
            <p className="text-sm text-slate-500 font-medium max-w-sm">
              Vous n'avez pas encore réservé de place de covoiturage.
            </p>
          </div>
        </Card>
      )}

      {/* Confirmation Cancel Dialog */}
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
                <h3 className="text-base font-bold text-text">Annuler cette réservation ?</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Cette action informera le conducteur de votre désistement. Elle est irréversible.
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
                  Oui, annuler
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ReservationsPage;
