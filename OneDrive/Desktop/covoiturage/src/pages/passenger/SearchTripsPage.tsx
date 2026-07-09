import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import { tripService } from '../../services/tripService';
import { FormInput } from '../../components/forms/FormInput';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { TripCard } from '../../components/common/TripCard';
import { Spinner } from '../../components/ui/Spinner';

const searchSchema = z.object({
  departure: z.string().optional(),
  destination: z.string().optional(),
  date: z.string().optional(),
  seats: z.coerce.number().min(1).max(8).default(1),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export const SearchTripsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [onlyFree, setOnlyFree] = useState(false);

  // Sync state with URL params
  const depParam = searchParams.get('dep') || '';
  const destParam = searchParams.get('dest') || '';
  const dateParam = searchParams.get('date') || '';
  const seatsParam = Number(searchParams.get('seats')) || 1;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema) as Resolver<SearchFormValues>,
    defaultValues: {
      departure: depParam,
      destination: destParam,
      date: dateParam,
      seats: seatsParam,
    },
  });

  // Sync form inputs when URL params change
  useEffect(() => {
    setValue('departure', depParam);
    setValue('destination', destParam);
    setValue('date', dateParam);
    setValue('seats', seatsParam);
  }, [depParam, destParam, dateParam, seatsParam, setValue]);

  // TanStack Query for searching trips
  const {
    data: trips = [],
    isLoading,
  } = useQuery({
    queryKey: ['trips_search', depParam, destParam, dateParam, seatsParam],
    queryFn: () =>
      tripService.getTrips({
        departure: depParam || undefined,
        destination: destParam || undefined,
        date: dateParam || undefined,
        seats: seatsParam || undefined,
      }),
  });

  const handleSearchSubmit = (values: SearchFormValues) => {
    const params: Record<string, string> = {};
    if (values.departure) params.dep = values.departure;
    if (values.destination) params.dest = values.destination;
    if (values.date) params.date = values.date;
    if (values.seats) params.seats = String(values.seats);
    setSearchParams(params);
  };

  const handleReset = () => {
    setValue('departure', '');
    setValue('destination', '');
    setValue('date', '');
    setValue('seats', 1);
    setSearchParams({});
  };

  // Filter and sort results
  let processedTrips = [...trips];

  if (onlyFree) {
    processedTrips = processedTrips.filter((t) => t.price === 0);
  }

  if (sortBy === 'date') {
    processedTrips.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  } else if (sortBy === 'price') {
    processedTrips.sort((a, b) => a.price - b.price);
  }

  return (
    <div className="flex flex-col gap-6 text-left pb-10">
      {/* Search Header */}
      <div>
        <h1 className="text-2xl font-black text-text">Rechercher un trajet</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Configurez vos points de départ, d'arrivée et filtres pour trouver le trajet idéal.
        </p>
      </div>

      {/* Search Filter Card */}
      <Card className="p-6">
        <form onSubmit={handleSubmit(handleSearchSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormInput
              label="Point de Départ"
              placeholder="Ex: Paris"
              error={errors.departure?.message}
              {...register('departure')}
            />

            <FormInput
              label="Point d'Arrivée"
              placeholder="Ex: Lille"
              error={errors.destination?.message}
              {...register('destination')}
            />

            <FormInput
              label="Date du Trajet"
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />

            <FormInput
              label="Nombre de places"
              type="number"
              min={1}
              max={8}
              error={errors.seats?.message}
              {...register('seats')}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-50">
            {/* Advanced UI filter toggles */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                Filtrer par :
              </div>
              
              <button
                type="button"
                onClick={() => setSortBy('date')}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  sortBy === 'date'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Heure de départ
              </button>

              <button
                type="button"
                onClick={() => setSortBy('price')}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  sortBy === 'price'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Prix croissant
              </button>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer select-none ml-2">
                <input
                  type="checkbox"
                  checked={onlyFree}
                  onChange={(e) => setOnlyFree(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary/20 w-4 h-4"
                />
                <span>Trajets Gratuits uniquement</span>
              </label>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                onClick={handleReset}
                variant="outline"
                leftIcon={<RefreshCcw className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Réinitialiser
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Search className="w-4 h-4" />}
                className="w-full sm:w-auto px-6"
              >
                Rechercher
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Results grid */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-text">
          {processedTrips.length} trajet(s) trouvé(s)
        </h2>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : processedTrips.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {processedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </motion.div>
        ) : (
          <Card className="py-16 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-text">Aucun résultat trouvé</h3>
              <p className="text-sm text-slate-500 font-medium max-w-sm">
                Essayez d'élargir votre recherche en retirant les filtres de date ou de destination.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
export default SearchTripsPage;
