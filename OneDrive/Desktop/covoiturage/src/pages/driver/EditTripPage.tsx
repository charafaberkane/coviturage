import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { tripService } from '../../services/tripService';
import { FormInput } from '../../components/forms/FormInput';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';

const tripSchema = z.object({
  departure: z.string().min(2, 'Le point de départ doit contenir au moins 2 caractères.'),
  destination: z.string().min(2, 'Le point d\'arrivée doit contenir au moins 2 caractères.'),
  dateTime: z.string().min(1, 'La date et l\'heure de départ sont obligatoires.'),
  totalSeats: z.coerce.number().min(1, 'Il doit y avoir au moins 1 place disponible.').max(8, 'Le maximum est de 8 places.'),
  price: z.coerce.number().min(0, 'Le prix ne peut pas être négatif.'),
  carModel: z.string().min(1, 'Veuillez renseigner le modèle de votre véhicule.'),
  description: z.string().optional(),
});

type TripFormValues = z.infer<typeof tripSchema>;

export const EditTripPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch current details
  const { data: trip, isLoading, error } = useQuery({
    queryKey: ['trip_details', id],
    queryFn: () => tripService.getTripById(id || ''),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema) as Resolver<TripFormValues>,
  });

  // Pre-fill form when trip details are loaded
  useEffect(() => {
    if (trip) {
      setValue('departure', trip.departure);
      setValue('destination', trip.destination);
      
      // format to fits input datetime-local: YYYY-MM-DDThh:mm
      const date = new Date(trip.dateTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      setValue('dateTime', `${year}-${month}-${day}T${hours}:${minutes}`);

      setValue('totalSeats', trip.totalSeats);
      setValue('price', trip.price);
      setValue('carModel', trip.carModel || '');
      setValue('description', trip.description || '');
    }
  }, [trip, setValue]);

  // Edit trip mutation
  const editMutation = useMutation({
    mutationFn: (data: TripFormValues) => {
      const updateData = {
        departure: data.departure,
        destination: data.destination,
        dateTime: new Date(data.dateTime).toISOString(),
        totalSeats: data.totalSeats,
        // Recalculate available seats based on change in total seats if any
        availableSeats: Math.max(0, data.totalSeats - ((trip?.totalSeats || 0) - (trip?.availableSeats || 0))),
        price: data.price,
        carModel: data.carModel,
        description: data.description,
      };
      return tripService.updateTrip(id || '', updateData);
    },
    onSuccess: () => {
      toast('Le trajet a été mis à jour avec succès.', 'success');
      queryClient.invalidateQueries({ queryKey: ['driver_trips', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['trip_details', id] });
      navigate('/driver/trips');
    },
    onError: (err: any) => {
      toast(err.message || 'Erreur lors de la mise à jour.', 'error');
    },
  });

  const onSubmit = (values: TripFormValues) => {
    editMutation.mutate(values);
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
          Désolé, ce trajet n'existe pas ou vous n'avez pas l'autorisation de le modifier.
        </p>
        <Button onClick={() => navigate('/driver/trips')} variant="outline" className="w-full">
          Retour à mes trajets
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left pb-10 max-w-3xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux trajets
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-text">Modifier mon trajet</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Modifiez les informations de votre trajet covoiturage. Les passagers seront informés des modifications.
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <h3 className="text-base font-bold text-text pb-2 border-b border-slate-50">
            Détails de l'itinéraire
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Point de Départ"
              error={errors.departure?.message}
              {...register('departure')}
            />

            <FormInput
              label="Point d'Arrivée"
              error={errors.destination?.message}
              {...register('destination')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Date et Heure de départ"
              type="datetime-local"
              error={errors.dateTime?.message}
              {...register('dateTime')}
            />

            <FormInput
              label="Places Totales"
              type="number"
              min={1}
              max={8}
              error={errors.totalSeats?.message}
              {...register('totalSeats')}
            />

            <FormInput
              label="Contribution financière ($)"
              type="number"
              step="0.01"
              min={0}
              error={errors.price?.message}
              {...register('price')}
            />
          </div>

          <h3 className="text-base font-bold text-text pb-2 border-b border-slate-50 pt-2">
            Véhicule et informations complémentaires
          </h3>

          <FormInput
            label="Véhicule (Marque et modèle)"
            error={errors.carModel?.message}
            {...register('carModel')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text/80 tracking-wide uppercase">
              Détails complémentaires
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border border-border focus:ring-primary/20 bg-white text-text text-sm transition-all focus:outline-none focus:ring-4 placeholder-slate-400 font-medium"
              {...register('description')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-50 mt-2">
            <Button
              type="button"
              onClick={() => navigate('/driver/trips')}
              variant="outline"
              className="px-6 py-2.5 rounded-2xl"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              isLoading={editMutation.isPending}
              leftIcon={<Save className="w-4 h-4" />}
              className="px-8 py-2.5 rounded-2xl"
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default EditTripPage;
