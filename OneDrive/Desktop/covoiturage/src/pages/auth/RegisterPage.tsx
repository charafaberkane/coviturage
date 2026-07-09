import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const roleOptions = ['PASSAGER', 'CONDUCTEUR'] as const;

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom complet doit contenir au moins 2 caractères.'),
  email: z.string().min(1, 'L\'adresse email est obligatoire.').email('Adresse email invalide.'),
  role: z.enum(roleOptions),
  phone: z.string().optional(),
  bio: z.string().optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
  confirmPassword: z.string().min(1, 'La confirmation du mot de passe est obligatoire.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas.',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'PASSAGER',
      phone: '',
      bio: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      await signup(values.name, values.email, values.role, values.phone, values.bio);
      navigate('/');
    } catch (err: any) {
      setGeneralError(err.message || "Une erreur s'est produite lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'PASSAGER', label: 'Je souhaite voyager (Passager)' },
    { value: 'CONDUCTEUR', label: 'Je souhaite proposer des trajets (Conducteur)' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full flex flex-col gap-8">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-primary items-center justify-center text-white font-black text-2xl shadow-lg mb-4">
            CG
          </div>
          <h2 className="text-3xl font-black text-text tracking-tight">Rejoignez CovoitGo</h2>
          <p className="mt-2 text-sm text-slate-500 font-semibold">
            Inscrivez-vous en quelques clics pour partager vos trajets
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {generalError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-danger text-xs font-semibold text-center animate-shake">
                {generalError}
              </div>
            )}

            <FormInput
              label="Nom Complet"
              placeholder="Jean Dupont"
              error={errors.name?.message}
              {...register('name')}
            />

            <FormInput
              label="Adresse Email"
              type="email"
              placeholder="jean.dupont@exemple.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <FormSelect
              label="Quel est votre profil principal ?"
              options={roleOptions}
              error={errors.role?.message}
              {...register('role')}
            />

            <FormInput
              label="Numéro de Téléphone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <FormInput
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <FormInput
              label="Confirmer le mot de passe"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" isLoading={isLoading} className="w-full mt-2 py-3">
              Créer mon compte
            </Button>
          </form>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-sm font-medium text-slate-500">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
};
export default RegisterPage;
