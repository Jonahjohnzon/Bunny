// services/notifications.ts
import ForumApi from '../ApiCore';

const api = new ForumApi();

export const NotificationService = {
  list: (page = 1) =>
    api.get('/notifications', { page }),

  markRead: (id: string) =>
    api.patch(`/notifications/${id}/read`),

  markAllRead: () =>
    api.patch('/notifications/read-all'),

  delete: (id: string) =>
    api.delete(`/notifications/${id}`),

  clearRead: () =>
    api.delete('/notifications'),
};