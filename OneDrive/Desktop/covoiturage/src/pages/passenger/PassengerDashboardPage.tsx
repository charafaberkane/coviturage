import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Calendar, Compass, ArrowRight, Leaf, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tripService } from '../../services/tripService';
import { reservationService } from '../../services/reservationService';
import { TripCard } from '../../components/common/TripCard';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';

export const PassengerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch recommended/recent trips
  const { data: trips = [], isLoading: tripsLoading } = useQuery({
    queryKey: ['recent_trips'],
    queryFn: () => tripService.getTrips({}),
  });

  // Fetch passenger reservations to count them
  const { data: reservations = [] } = useQuery({
    queryKey: ['passenger_reservations', user?.id],
    queryFn: () => (user ? reservationService.getReservationsForPassenger(user.id) : []),
    enabled: !!user,
  });

  const activeReservationsCount = reservations.filter(
    (res) => res.status === 'PENDING' || res.status === 'ACCEPTED'
  ).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 text-left pb-10"
    >
      {/* Header Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-8 text-white shadow-md"
      >
        <div className="relative z-10 max-w-lg flex flex-col gap-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full w-max backdrop-blur-xs">
            Covoiturage Intelligent
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Bonjour, {user?.name} !
          </h1>
          <p className="text-sm font-semibold text-white/95 leading-relaxed">
            Où voyagez-vous aujourd'hui ? Recherchez des trajets partagés à petits prix et réduisez votre empreinte carbone.
          </p>
          <div className="mt-2.5">
            <Link
              to="/passenger/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              Trouver un trajet
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Ambient graphics behind */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/4">
          <Compass className="w-96 h-96" />
        </div>
      </motion.div>

      {/* KPI Stats Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-text">{activeReservationsCount}</span>
            <span className="text-xs font-semibold text-slate-400">Réservations actives</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <Leaf className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-text">14.8 kg</span>
            <span className="text-xs font-semibold text-slate-400">CO₂ Économisé</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-text">{user?.tripsCount || 0}</span>
            <span className="text-xs font-semibold text-slate-400">Covoiturages effectués</span>
          </div>
        </Card>
      </motion.div>

      {/* Quick Search Card */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h3 className="text-base font-bold text-text mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            Accès rapide à la recherche
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/passenger/search?dep=Paris&dest=Lille')}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-primary/5 hover:border-primary/20 transition-all text-left font-bold text-xs flex flex-col gap-1 cursor-pointer"
            >
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Trajet Populaire</span>
              <span className="text-text">Paris → Lille</span>
            </button>
            <button
              onClick={() => navigate('/passenger/search?dep=Lille&dest=Paris')}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-primary/5 hover:border-primary/20 transition-all text-left font-bold text-xs flex flex-col gap-1 cursor-pointer"
            >
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Trajet Populaire</span>
              <span className="text-text">Lille → Paris</span>
            </button>
            <button
              onClick={() => navigate('/passenger/search?dep=Lyon&dest=Marseille')}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-primary/5 hover:border-primary/20 transition-all text-left font-bold text-xs flex flex-col gap-1 cursor-pointer"
            >
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Trajet Populaire</span>
              <span className="text-text">Lyon → Marseille</span>
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Recommended Trips Section */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">Prochains trajets disponibles</h2>
          <Link
            to="/passenger/search"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            Tout afficher
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {tripsLoading ? (
          <div className="py-12">
            <Spinner size="lg" />
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.slice(0, 4).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <Card className="py-12 text-center text-slate-500 font-medium">
            Aucun trajet disponible pour le moment.
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
};
export default PassengerDashboardPage;
