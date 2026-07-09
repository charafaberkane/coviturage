import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { FormInput } from '../../components/forms/FormInput';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'L\'adresse email est obligatoire.').email('Adresse email invalide.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      await authService.forgotPassword(values.email);
      setIsSubmitted(true);
    } catch (err: any) {
      setGeneralError(err.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full flex flex-col gap-8">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-primary items-center justify-center text-white font-black text-2xl shadow-lg mb-4">
            CG
          </div>
          <h2 className="text-3xl font-black text-text tracking-tight">Mot de passe oublié</h2>
          <p className="mt-2 text-sm text-slate-500 font-semibold">
            Saisissez votre email pour réinitialiser votre accès
          </p>
        </div>

        {/* Card */}
        <Card className="p-8">
          {isSubmitted ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-accent flex items-center justify-center border border-emerald-100 mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text">Email envoyé !</h3>
              <p className="text-sm text-slate-500 font-medium">
                Un email contenant un lien de réinitialisation vous a été envoyé. Veuillez vérifier votre boîte de réception.
              </p>
              <Button
                onClick={() => navigate('/login')}
                variant="primary"
                className="w-full mt-4 py-2.5"
              >
                Retour à la connexion
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {generalError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-danger text-xs font-semibold text-center">
                  {generalError}
                </div>
              )}

              <FormInput
                label="Adresse Email"
                type="email"
                placeholder="jean.dupont@exemple.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" isLoading={isLoading} className="w-full mt-2 py-3">
                Envoyer le lien de réinitialisation
              </Button>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-text transition-colors mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
