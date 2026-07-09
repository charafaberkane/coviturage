import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { tripService } from '../../services/tripService';
import { FormInput } from '../../components/forms/FormInput';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const tripSchema = z.object({
  departure: z.string().min(2, 'Le point de départ doit contenir au moins 2 caractères.'),
  destination: z.string().min(2, 'Le point d\'arrivée doit contenir au moins 2 caractères.'),
  dateTime: z.string().min(1, 'La date et l\'heure de départ sont obligatoires.')
    .refine((val) => new Date(val).getTime() > Date.now(), {
      message: 'La date de départ doit être dans le futur.',
    }),
  totalSeats: z.coerce.number().min(1, 'Il doit y avoir au moins 1 place disponible.').max(8, 'Le maximum est de 8 places.'),
  price: z.coerce.number().min(0, 'Le prix ne peut pas être négatif.'),
  carModel: z.string().min(1, 'Veuillez renseigner le modèle de votre véhicule.'),
  description: z.string().optional(),
});

type TripFormValues = z.infer<typeof tripSchema>;

export const CreateTripPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Create trip mutation
  const createMutation = useMutation({
    mutationFn: (data: TripFormValues) => {
      if (!user) throw new Error('Utilisateur non connecté.');
      // Prepare details
      const tripData = {
        departure: data.departure,
        destination: data.destination,
        dateTime: new Date(data.dateTime).toISOString(),
        availableSeats: data.totalSeats,
        totalSeats: data.totalSeats,
        price: data.price,
        carModel: data.carModel,
        description: data.description,
      };
      return tripService.createTrip(user.id, tripData);
    },
    onSuccess: () => {
      toast('Votre trajet a été publié avec succès !', 'success');
      queryClient.invalidateQueries({ queryKey: ['driver_trips', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['recent_trips'] });
      navigate('/driver/trips');
    },
    onError: (err: any) => {
      toast(err.message || 'Erreur lors de la création.', 'error');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema) as Resolver<TripFormValues>,
    defaultValues: {
      departure: '',
      destination: '',
      dateTime: '',
      totalSeats: 3,
      price: 0,
      carModel: '',
      description: '',
    },
  });

  const onSubmit = (values: TripFormValues) => {
    createMutation.mutate(values);
  };

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
        <h1 className="text-2xl font-black text-text">Proposer un trajet</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Renseignez les détails du trajet pour que les passagers puissent le réserver.
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Date et Heure de départ"
              type="datetime-local"
              error={errors.dateTime?.message}
              {...register('dateTime')}
            />

            <FormInput
              label="Nombre de places"
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
              helperText="Mettre 0 pour un trajet gratuit"
              error={errors.price?.message}
              {...register('price')}
            />
          </div>

          <h3 className="text-base font-bold text-text pb-2 border-b border-slate-50 pt-2">
            Véhicule et informations complémentaires
          </h3>

          <FormInput
            label="Véhicule (Marque et modèle)"
            placeholder="Ex: Peugeot e-208 Bleue"
            error={errors.carModel?.message}
            {...register('carModel')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text/80 tracking-wide uppercase">
              Détails complémentaires (bagages, musique, pauses...)
            </label>
            <textarea
              rows={4}
              placeholder="Ex: Bagages cabine uniquement. Trajet direct sans pauses."
              className="w-full px-4 py-3 rounded-2xl border border-border focus:ring-primary/20 bg-white text-text text-sm transition-all focus:outline-none focus:ring-4 placeholder-slate-400 font-medium"
              {...register('description')}
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-50 mt-2">
            <Button
              type="submit"
              isLoading={createMutation.isPending}
              leftIcon={<PlusCircle className="w-4 h-4" />}
              className="px-8 py-3 rounded-2xl"
            >
              Publier le trajet
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default CreateTripPage;
