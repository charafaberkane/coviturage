import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ServerCrash, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full text-center flex flex-col items-center gap-6 p-8 bg-white border border-border rounded-2xl shadow-premium"
      >
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-danger border border-red-100 animate-pulse">
          <ServerCrash className="w-8 h-8" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-text">500</h1>
          <h2 className="text-xl font-bold text-slate-700">Erreur Interne</h2>
          <p className="text-sm text-slate-500 font-medium">
            Quelque chose s'est mal passé sur nos serveurs. Nos techniciens ont été alertés.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full mt-2">
          <Button
            onClick={handleRefresh}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            variant="primary"
            className="w-full"
          >
            Actualiser la page
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full"
          >
            Retour à la page d'accueil
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
export default ServerErrorPage;
