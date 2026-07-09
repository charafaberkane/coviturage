import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, role: UserRole, phone?: string, bio?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Refresh user data (or fetch current user from storage)
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch (err: any) {
      setUser(null);
      toast(err.message || 'Votre session a expiré.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initial load
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Login handler
  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
      toast(`Ravi de vous revoir, ${loggedInUser.name} !`, 'success');
    } catch (err: any) {
      setUser(null);
      toast(err.message || 'Échec de la connexion.', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (name: string, email: string, role: UserRole, phone?: string, bio?: string) => {
    setIsLoading(true);
    try {
      const { user: registeredUser } = await authService.register(name, email, role, phone, bio);
      setUser(registeredUser);
      toast(`Compte créé avec succès ! Bienvenue, ${registeredUser.name}.`, 'success');
    } catch (err: any) {
      setUser(null);
      toast(err.message || "Échec de l'inscription.", 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      toast('Déconnexion réussie. À bientôt !', 'success');
    } catch (err: any) {
      toast('Erreur lors de la déconnexion.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Role utility
  const hasRole = (roles: UserRole[]) => {
    return user !== null && roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
