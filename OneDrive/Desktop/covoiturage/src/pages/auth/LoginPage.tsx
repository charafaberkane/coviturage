import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Shield, Car, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/forms/FormInput';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const loginSchema = z.object({
  email: z.string().min(1, 'L\'adresse email est obligatoire.').email('Adresse email invalide.'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      await login(values.email, values.password);
      // AuthContext handles redirect to home page in PublicRoute check,
      // but let's double redirect just in case
      navigate('/');
    } catch (err: any) {
      setGeneralError(err.message || 'Identifiants ou connexion incorrects.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to prefill and log in quickly for testing
  const handleQuickLogin = (email: string) => {
    setValue('email', email);
    setValue('password', 'password123'); // any placeholder password
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full flex flex-col gap-8">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-primary items-center justify-center text-white font-black text-2xl shadow-lg mb-4">
            CG
          </div>
          <h2 className="text-3xl font-black text-text tracking-tight">CovoitGo</h2>
          <p className="mt-2 text-sm text-slate-500 font-semibold">
            Connectez-vous pour commencer à partager vos trajets
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {generalError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-danger text-xs font-semibold text-center">
                {generalError}
              </div>
            )}

            <FormInput
              label="Adresse Email"
              type="email"
              placeholder="votre.nom@exemple.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <FormInput
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[37px] text-slate-400 hover:text-text cursor-pointer"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20 w-4 h-4" />
                <span>Se souvenir de moi</span>
              </label>
              
              <Link to="/forgot-password" className="text-primary hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2 py-3">
              Se connecter
            </Button>
          </form>

          {/* Quick Login Test Panel */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left mb-3">
              Comptes de test (cliquez pour remplir)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin('passager@covoitgo.com')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group"
              >
                <User className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-600">Passager</span>
              </button>
              
              <button
                onClick={() => handleQuickLogin('conducteur@covoitgo.com')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-accent/5 hover:border-accent/20 transition-all cursor-pointer group"
              >
                <Car className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-600">Conducteur</span>
              </button>

              <button
                onClick={() => handleQuickLogin('admin@covoitgo.com')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-warning/5 hover:border-warning/20 transition-all cursor-pointer group"
              >
                <Shield className="w-4 h-4 text-warning group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-600">Admin</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-sm font-medium text-slate-500">
          Nouveau sur CovoitGo ?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Créer un compte
          </Link>
        </p>

      </div>
    </div>
  );
};
export default LoginPage;
