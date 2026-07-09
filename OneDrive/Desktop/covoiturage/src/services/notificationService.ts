import { api, IS_MOCK_MODE, delay } from './api';
import { getFromDb, saveToDb, NOTIFICATIONS_KEY } from './mockData';
import type { Notification } from '../types';

export const notificationService = {
  getNotifications: async (userId: string): Promise<Notification[]> => {
    await delay(300);

    if (IS_MOCK_MODE) {
      const notifications = getFromDb<Notification>(NOTIFICATIONS_KEY);
      return notifications.filter((n) => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      const response = await api.get(`/users/${userId}/notifications`);
      return response.data;
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    if (IS_MOCK_MODE) {
      const notifications = getFromDb<Notification>(NOTIFICATIONS_KEY);
      const index = notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        notifications[index].read = true;
        saveToDb(NOTIFICATIONS_KEY, notifications);
      }
    } else {
      await api.put(`/notifications/${id}/read`);
    }
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    if (IS_MOCK_MODE) {
      const notifications = getFromDb<Notification>(NOTIFICATIONS_KEY);
      const updated = notifications.map((n) => {
        if (n.userId === userId) {
          return { ...n, read: true };
        }
        return n;
      });
      saveToDb(NOTIFICATIONS_KEY, updated);
    } else {
      await api.put(`/users/${userId}/notifications/read-all`);
    }
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    if (IS_MOCK_MODE) {
      const notifications = getFromDb<Notification>(NOTIFICATIONS_KEY);
      return notifications.filter((n) => n.userId === userId && !n.read).length;
    } else {
      const response = await api.get(`/users/${userId}/notifications/unread-count`);
      return response.data.count;
    }
  }
};
