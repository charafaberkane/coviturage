import { api, IS_MOCK_MODE, delay } from './api';
import { getFromDb, saveToDb, USERS_KEY } from './mockData';
import type { User } from '../types';

export const userService = {
  getUserById: async (id: string): Promise<User> => {
    await delay(400);

    if (IS_MOCK_MODE) {
      const users = getFromDb<User>(USERS_KEY);
      const user = users.find((u) => u.id === id);
      if (!user) throw new Error('Utilisateur introuvable.');
      return user;
    } else {
      const response = await api.get(`/users/${id}`);
      return response.data;
    }
  },

  updateUserProfile: async (id: string, profileData: Partial<User>): Promise<User> => {
    await delay(800);

    if (IS_MOCK_MODE) {
      const users = getFromDb<User>(USERS_KEY);
      const index = users.findIndex((u) => u.id === id);

      if (index === -1) {
        throw new Error('Utilisateur introuvable.');
      }

      const updatedUser = { ...users[index], ...profileData };
      users[index] = updatedUser;
      saveToDb(USERS_KEY, users);

      // Update current user cache in localStorage if it's the logged-in user
      const currentUserJson = localStorage.getItem('covoitgo_user');
      if (currentUserJson) {
        const currentUser = JSON.parse(currentUserJson) as User;
        if (currentUser.id === id) {
          localStorage.setItem('covoitgo_user', JSON.stringify(updatedUser));
        }
      }

      return updatedUser;
    } else {
      const response = await api.put(`/users/${id}`, profileData);
      return response.data;
    }
  },

  getUsersList: async (): Promise<User[]> => {
    await delay(500);
    if (IS_MOCK_MODE) {
      return getFromDb<User>(USERS_KEY);
    } else {
      const response = await api.get('/users');
      return response.data;
    }
  }
};
