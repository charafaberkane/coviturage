import { api, IS_MOCK_MODE, delay } from './api';
import { getFromDb, saveToDb, USERS_KEY } from './mockData';
import type { User, UserRole } from '../types';

export const authService = {
  login: async (email: string, password?: string): Promise<{ user: User; token: string }> => {
    await delay(600); // Simulate API call latency

    if (IS_MOCK_MODE) {
      const users = getFromDb<User>(USERS_KEY);
      const user = users.find((u) => u.email === email.toLowerCase());

      if (!user) {
        throw new Error('Identifiants incorrects.');
      }
      if (!user.isActive) {
        throw new Error('Ce compte a été suspendu par un administrateur.');
      }

      // Generate a mock JWT
      const token = `mock-jwt-token-for-${user.id}`;
      localStorage.setItem('covoitgo_jwt', token);
      localStorage.setItem('covoitgo_user', JSON.stringify(user));

      return { user, token };
    } else {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    }
  },

  register: async (name: string, email: string, role: UserRole, phone?: string, bio?: string): Promise<{ user: User; token: string }> => {
    await delay(800);

    if (IS_MOCK_MODE) {
      const users = getFromDb<User>(USERS_KEY);
      const exists = users.some((u) => u.email === email.toLowerCase());

      if (exists) {
        throw new Error('Cet email est déjà utilisé.');
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role,
        avatarUrl: `https://images.unsplash.com/photo-${role === 'CONDUCTEUR' ? '1507003211169-0a1dd7228f2d' : '1534528741775-53994a69daeb'}?auto=format&fit=crop&q=80&w=200`,
        phone,
        bio,
        rating: role === 'CONDUCTEUR' ? 5.0 : undefined,
        tripsCount: 0,
        isActive: true
      };

      users.push(newUser);
      saveToDb(USERS_KEY, users);

      const token = `mock-jwt-token-for-${newUser.id}`;
      localStorage.setItem('covoitgo_jwt', token);
      localStorage.setItem('covoitgo_user', JSON.stringify(newUser));

      return { user: newUser, token };
    } else {
      const response = await api.post('/auth/register', { name, email, role, phone, bio });
      return response.data;
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('covoitgo_jwt');
    localStorage.removeItem('covoitgo_user');
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    await delay(500);

    if (IS_MOCK_MODE) {
      const users = getFromDb<User>(USERS_KEY);
      const user = users.find((u) => u.email === email.toLowerCase());

      if (!user) {
        throw new Error('Aucun compte associé à cette adresse email.');
      }

      return {
        success: true,
        message: 'Un email de réinitialisation a été envoyé à votre adresse.'
      };
    } else {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    }
  },

  getMe: async (): Promise<User | null> => {
    if (IS_MOCK_MODE) {
      const userJson = localStorage.getItem('covoitgo_user');
      if (!userJson) return null;
      
      // Fetch latest data from database to ensure status updates are reflected
      const currentUser = JSON.parse(userJson) as User;
      const users = getFromDb<User>(USERS_KEY);
      const freshUser = users.find((u) => u.id === currentUser.id);

      if (!freshUser) {
        authService.logout();
        return null;
      }
      
      if (!freshUser.isActive) {
        authService.logout();
        throw new Error('Votre session a expiré ou votre compte a été désactivé.');
      }

      return freshUser;
    } else {
      try {
        const response = await api.get('/auth/me');
        return response.data;
      } catch {
        return null;
      }
    }
  }
};
