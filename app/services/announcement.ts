// services/announcements.ts
import ForumApi from '../ApiCore';

const api = new ForumApi();

export interface Announcement {
  _id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  createdBy: { _id: string; username: string } | string;
  startsAt: string;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementInput {
  message: string;
  type?: Announcement['type'];
  startsAt?: string;
  expiresAt?: string | null;
  durationHours?: number; // alternative to expiresAt — "expires N hours from now"
  isActive?: boolean;
}

export const AnnouncementService = {
  // Public — only currently-live announcements
  listActive: () =>
    api.get<{ announcements: Announcement[] }>('/announcements'),

  // Admin/mod — full history including expired/inactive
  listAll: () =>
    api.get<{ announcements: Announcement[] }>('/admin/announcements'),

  create: (data: AnnouncementInput) =>
    api.post<Announcement>('/announcements', data),

  update: (id: string, data: Partial<AnnouncementInput>) =>
    api.patch<Announcement>(`/announcements/${id}`, data),

  delete: (id: string) =>
    api.delete<{ deleted: boolean }>(`/announcements/${id}`),

  deactivate: (id: string) =>
    api.patch<Announcement>(`/announcements/${id}`, { isActive: false }),
};