import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';
import { Card } from '../../components/ui/Card';
import { FormInput } from '../../components/forms/FormInput';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

const profileSchema = z.object({
  name: z.string().min(2, 'Le nom complet doit contenir au moins 2 caractères.'),
  email: z.string().min(1, 'L\'adresse email est obligatoire.').email('Adresse email invalide.'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url('L\'URL de l\'avatar doit être valide.').or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: (data: ProfileFormValues) => userService.updateUserProfile(user?.id || '', data),
    onSuccess: () => {
      toast('Votre profil a été mis à jour avec succès.', 'success');
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['recent_trips'] });
    },
    onError: (err: any) => {
      toast(err.message || 'Erreur lors de la mise à jour.', 'error');
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    profileMutation.mutate(values);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 text-left pb-10 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-text">Mon Profil</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Gérez vos informations personnelles, coordonnées et préférences de covoiturage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Card: Summary & Rating */}
        <Card className="flex flex-col items-center text-center p-6 gap-4">
          <Avatar src={user.avatarUrl} name={user.name} size="xl" />
          
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-bold text-text">{user.name}</h3>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Rôle : {user.role === 'ADMIN' ? 'Administrateur' : user.role === 'CONDUCTEUR' ? 'Conducteur' : 'Passager'}
            </span>
          </div>

          <div className="flex justify-around w-full py-4 border-y border-slate-50 mt-2 text-xs font-semibold text-slate-500">
            {user.rating && (
              <div className="flex flex-col items-center gap-0.5">
                <span className="flex items-center gap-1 font-black text-slate-800 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {user.rating.toFixed(1)}
                </span>
                <span>Note globale</span>
              </div>
            )}

            <div className="flex flex-col items-center gap-0.5">
              <span className="flex items-center gap-1 font-black text-slate-800 text-sm">
                <Car className="w-4 h-4 text-primary" />
                {user.tripsCount || 0}
              </span>
              <span>Trajets</span>
            </div>
          </div>

          {user.bio && (
            <p className="text-xs text-slate-500 leading-relaxed font-medium italic mt-2">
              "{user.bio}"
            </p>
          )}
        </Card>

        {/* Right Card: Profile Form */}
        <Card className="p-6 md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-text pb-2 border-b border-slate-50">
              Informations du compte
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Nom Complet"
                error={errors.name?.message}
                {...register('name')}
              />

              <FormInput
                label="Adresse Email"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Numéro de Téléphone"
                type="tel"
                error={errors.phone?.message}
                {...register('phone')}
              />

              <FormInput
                label="Lien Photo de Profil (URL)"
                placeholder="https://images.unsplash.com/..."
                error={errors.avatarUrl?.message}
                {...register('avatarUrl')}
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-semibold text-text/80 tracking-wide uppercase">
                Présentation / Biographie
              </label>
              <textarea
                rows={3}
                placeholder="Racontez-nous quelque chose sur vous..."
                className="w-full px-4 py-3 rounded-2xl border border-border focus:ring-primary/20 bg-white text-text text-sm transition-all focus:outline-none focus:ring-4 placeholder-slate-400 font-medium"
                {...register('bio')}
              />
              {errors.bio?.message && (
                <span className="text-xs text-danger font-medium">{errors.bio.message}</span>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-50 mt-2">
              <Button
                type="submit"
                isLoading={profileMutation.isPending}
                className="px-8 py-2.5 rounded-2xl"
              >
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
export default ProfilePage;
