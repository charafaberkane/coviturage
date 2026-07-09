import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Car, Star, Users } from 'lucide-react';
import type { Trip } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface TripCardProps {
  trip: Trip;
  actionLabel?: string;
  onAction?: (tripId: string) => void;
  showActions?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  actionLabel = 'Réserver',
  onAction,
  showActions = true,
}) => {
  const navigate = useNavigate();

  const formattedDate = new Date(trip.dateTime).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const formattedTime = new Date(trip.dateTime).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCardClick = () => {
    navigate(`/passenger/trips/${trip.id}`);
  };

  const handleActionButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAction) {
      onAction(trip.id);
    } else {
      navigate(`/passenger/trips/${trip.id}`);
    }
  };

  const isFree = trip.price === 0;

  return (
    <Card hoverable onClick={handleCardClick} className="w-full flex flex-col gap-4 text-left">
      {/* Header: Driver Info and Price */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={trip.driverAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
              alt={trip.driverName}
              className="w-10 h-10 rounded-full object-cover border border-slate-100"
            />
            {trip.driverRating && (
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-white rounded-full px-1 text-[8px] font-black flex items-center gap-0.5 border border-white">
                <Star className="w-2.5 h-2.5 fill-current" />
                {trip.driverRating.toFixed(1)}
              </span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-text">{trip.driverName}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <Car className="w-3.5 h-3.5" />
              <span>{trip.carModel || 'Voiture'}</span>
            </div>
          </div>
        </div>
        
        {/* Price/Contribution Badge */}
        <div>
          {isFree ? (
            <Badge variant="accent" className="text-xs py-1 px-3">
              Gratuit
            </Badge>
          ) : (
            <span className="text-lg font-black text-primary">
              {trip.price.toFixed(2)} $
            </span>
          )}
        </div>
      </div>

      {/* Body: Journey details */}
      <div className="flex flex-col gap-3 py-1.5 border-y border-slate-50 relative">
        {/* Left vertical route line */}
        <div className="absolute left-3.5 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-slate-200" />

        {/* Departure */}
        <div className="flex items-center gap-3.5">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 z-10">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Départ</span>
            <span className="text-sm font-bold text-text">{trip.departure}</span>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-3.5">
          <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 z-10">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arrivée</span>
            <span className="text-sm font-bold text-text">{trip.destination}</span>
          </div>
        </div>
      </div>

      {/* Footer: Date/Seats and Action */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mt-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-slate-400">
            <Users className="w-3.5 h-3.5" />
            <span className="text-text font-bold">{trip.availableSeats}</span>
            <span>/</span>
            <span>{trip.totalSeats} places</span>
          </div>

          {showActions && (
            <Button
              onClick={handleActionButtonClick}
              variant={isFree ? 'accent' : 'primary'}
              size="sm"
              className="py-2 px-4"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
export default TripCard;
