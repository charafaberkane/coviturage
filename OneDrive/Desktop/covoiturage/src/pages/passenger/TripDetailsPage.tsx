import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, Clock, Car, Star, 
  Users, ShieldCheck, X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { tripService } from '../../services/tripService';
import { reservationService } from '../../services/reservationService';
import { Card } from '../../components/ui/Card';

import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [seatsToBook, setSeatsToBook] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch trip details
  const { data: trip, isLoading, error } = useQuery({
    queryKey: ['trip_details', id],
    queryFn: () => tripService.getTripById(id || ''),
    enabled: !!id,
  });

  // Create reservation mutation
  const bookMutation = useMutation({
    mutationFn: ({ tripId, seats }: { tripId: string; seats: number }) =>
      reservationService.createReservation(tripId, user?.id || '', seats),
    onSuccess: () => {
      toast('Demande de réservation envoyée avec succès !', 'success');
      queryClient.invalidateQueries({ queryKey: ['passenger_reservations', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['trip_details', id] });
      setModalOpen(false);
      navigate('/passenger/reservations');
    },
    onError: (err: any) => {
      toast(err.message || 'Échec de la réservation.', 'error');
    },
  });

  const handleBooking = () => {
    if (!trip || !id) return;
    bookMutation.mutate({ tripId: id, seats: seatsToBook });
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto my-12 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-danger flex items-center justify-center border border-red-100">
          <X className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-text">Trajet Introuvable</h3>
        <p className="text-sm text-slate-500 font-medium">
          Désolé, ce trajet n'existe plus ou est inaccessible.
        </p>
        <Button onClick={() => navigate(-1)} variant="outline" className="w-full">
          Retourner en arrière
        </Button>
      </Card>
    );
  }

  const formattedDate = new Date(trip.dateTime).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = new Date(trip.dateTime).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isFree = trip.price === 0;

  return (
    <div className="flex flex-col gap-6 text-left pb-10 max-w-3xl mx-auto">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux trajets
        </button>
      </div>

      {/* Main Details Panel */}
      <Card className="overflow-hidden">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={trip.driverAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
              alt={trip.driverName}
              className="w-12 h-12 rounded-full object-cover border border-slate-100"
            />
            <div>
              <h1 className="text-lg font-extrabold text-text">{trip.driverName}</h1>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-0.5">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{trip.driverRating ? trip.driverRating.toFixed(1) : '5.0'} / 5.0 Rating</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Contribution</span>
            <span className="text-2xl font-black text-primary">
              {isFree ? 'Gratuit' : `${trip.price.toFixed(2)} $`}
            </span>
          </div>
        </div>

        {/* Route visualization */}
        <div className="flex flex-col gap-5 py-4 border-b border-slate-50 relative pl-4">
          {/* vertical route dashed line */}
          <div className="absolute left-7.5 top-8 bottom-8 w-0.5 border-l-2 border-dashed border-slate-200" />

          {/* Departure details */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 z-10">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Point de Départ</span>
              <span className="text-base font-bold text-text">{trip.departure}</span>
            </div>
          </div>

          {/* Destination details */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 z-10">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Point de Destination</span>
              <span className="text-base font-bold text-text">{trip.destination}</span>
            </div>
          </div>
        </div>

        {/* Meta detail grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 py-6 border-b border-slate-50 text-slate-500 font-semibold text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Date</span>
              <span className="text-text font-bold capitalize">{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Heure</span>
              <span className="text-text font-bold">{formattedTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Places Libres</span>
              <span className="text-text font-bold">
                {trip.availableSeats} / {trip.totalSeats} disponibles
              </span>
            </div>
          </div>
        </div>

        {/* Car Model & Driver Notes */}
        <div className="py-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <Car className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Véhicule</span>
              <span className="text-text font-bold">{trip.carModel || 'Modèle non spécifié'}</span>
            </div>
          </div>

          {trip.description && (
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Note du conducteur
              </span>
              <p className="text-xs text-text/80 leading-relaxed font-medium">
                {trip.description}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Reservation trigger */}
        <div className="mt-4 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-accent" />
            Vérifié par la communauté CovoitGo
          </div>
          
          <Button
            onClick={() => setModalOpen(true)}
            variant={isFree ? 'accent' : 'primary'}
            disabled={trip.availableSeats === 0 || trip.status !== 'ACTIVE'}
            className="px-8 py-3 rounded-2xl"
          >
            {trip.status !== 'ACTIVE'
              ? 'Trajet annulé'
              : trip.availableSeats === 0
                ? 'Complet'
                : 'Demander à réserver'}
          </Button>
        </div>
      </Card>

      {/* Reservation Dialog / Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white border border-border rounded-2xl p-6 shadow-premium max-w-md w-full text-left flex flex-col gap-5 z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-text cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-lg font-extrabold text-text">Confirmer votre réservation</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  Une demande sera envoyée au conducteur pour approbation.
                </p>
              </div>

              {/* Selector for Seats */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="text-xs font-bold text-slate-600">Nombre de places</span>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSeatsToBook(Math.max(1, seatsToBook - 1))}
                    disabled={seatsToBook <= 1}
                    className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-text w-4 text-center">{seatsToBook}</span>
                  <button
                    onClick={() => setSeatsToBook(Math.min(trip.availableSeats, seatsToBook + 1))}
                    disabled={seatsToBook >= trip.availableSeats}
                    className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Pricing breakdown summary */}
              <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-500 py-1.5 border-y border-slate-100">
                <div className="flex justify-between">
                  <span>Tarif unitaire</span>
                  <span>{isFree ? '0.00 $' : `${trip.price.toFixed(2)} $`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nombre de places</span>
                  <span>x {seatsToBook}</span>
                </div>
                <div className="flex justify-between text-text font-bold text-sm pt-1.5">
                  <span>Total contribution</span>
                  <span className="text-primary font-black">
                    {isFree ? 'Gratuit' : `${(trip.price * seatsToBook).toFixed(2)} $`}
                  </span>
                </div>
              </div>

              {/* Action buttons inside Modal */}
              <div className="flex gap-3">
                <Button onClick={() => setModalOpen(false)} variant="outline" className="flex-1 py-2.5">
                  Annuler
                </Button>
                <Button
                  onClick={handleBooking}
                  isLoading={bookMutation.isPending}
                  variant={isFree ? 'accent' : 'primary'}
                  className="flex-1 py-2.5"
                >
                  Envoyer la demande
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default TripDetailsPage;
