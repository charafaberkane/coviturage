import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full text-center flex flex-col items-center gap-6 p-8 bg-white border border-border rounded-2xl shadow-premium"
      >
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-warning border border-amber-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-text">403</h1>
          <h2 className="text-xl font-bold text-slate-700">Accès Refusé</h2>
          <p className="text-sm text-slate-500 font-medium">
            Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
          </p>
        </div>

        <Button
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          variant="outline"
          className="w-full mt-2"
        >
          Retourner en arrière
        </Button>
      </motion.div>
    </div>
  );
};
export default ForbiddenPage;
