// services/notifications.ts
import ForumApi from '../ApiCore';
import { Notification } from '../n/component/types';

const api = new ForumApi();


export const NotificationService = {
  list: (page = 1) =>
    api.get<{ data: { notifications: Notification[]; total: number; page: number; hasMore:boolean; } }>('/notifications', { page }),

  markRead: (id: string) =>
    api.patch<{ success: boolean }>(`/notifications/${id}/read`),

  markAllRead: () =>
    api.patch<{ success: boolean }>('/notifications/read-all'),

  delete: (id: string) =>
    api.delete<{ success: boolean }>(`/notifications/${id}`),

  clearRead: () =>
    api.delete<{ success: boolean }>('/notifications'),
};