import { api } from './api';
import { AppNotification } from '@/src/stores/notificationStore';

export const notificationService = {
  list: () => api<AppNotification[]>('/notifications'),
  markAllRead: () => api<{ read: true }>('/notifications/read', { method: 'PATCH' }),
};
