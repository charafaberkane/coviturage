import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            let bgColor = 'bg-white';
            let borderColor = 'border-slate-100';
            let Icon = CheckCircle;
            let iconColor = 'text-accent';

            if (t.type === 'error') {
              bgColor = 'bg-red-50';
              borderColor = 'border-red-100';
              Icon = XCircle;
              iconColor = 'text-danger';
            } else if (t.type === 'warning') {
              bgColor = 'bg-amber-50';
              borderColor = 'border-amber-100';
              Icon = AlertTriangle;
              iconColor = 'text-warning';
            } else if (t.type === 'info') {
              bgColor = 'bg-blue-50';
              borderColor = 'border-blue-100';
              Icon = Info;
              iconColor = 'text-blue-500';
            }

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border ${borderColor} ${bgColor} shadow-premium glassmorphism w-full`}
              >
                <div className={`mt-0.5 ${iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-sm font-medium text-text">
                  {t.message}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-slate-400 hover:text-text transition-colors mt-0.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
