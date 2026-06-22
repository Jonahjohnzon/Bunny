import ForumApi from '../ApiCore';
import type { ForumUser, UserStatus } from '../admin/lib/types';
import type { UserProfile, RecentThread } from '../u/[username]/types/index';

const api = new ForumApi();

export const UserService = {
  getMyProfile: () =>
    api.get<{ data: { profile: UserProfile } }>(`/users/me`),

  getProfile: (username: string) =>
    api.get<{ data: { profile: UserProfile } }>(`/users/${username}`),

  getThreads: (username: string, page = 1) =>
    api.get<{ data: { items: RecentThread[]; total: number; page: number; pages: number } }>(
      `/users/${username}/threads`,
      { page }
    ),

  updateProfile: (body: {
    bio?: string; location?: string; website?: string;
    signature?: string; customTitle?: string; avatar?:string; banner?:string; socials?: Record<string, string>;
  }) => api.patch('/users/me', body),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api.patch('/users/me/password', body),

  updateAvatarUrl: (avatar: string) => {
    return api.patch('/users/me/avatar', avatar);
  },

  updateTheme: (themeId: string) =>
    api.patch('/users/me/theme', { themeId }),

  list: (params?: { query?: string; status?: UserStatus | 'all'; page?: number }) =>
    api.get<{ data: { users: ForumUser[]; total?: number } }>('/admin/users', params),

  update: (userId: string, body: { role?: string }) =>
    api.patch<{ user: ForumUser }>(`/admin/users/${userId}`, body),

  warn: (userId: string, reason: string) =>
    api.post<{ user: ForumUser }>(`/admin/users/${userId}/warn`, { reason }),

  suspend: (userId: string, reason: string) =>
    api.post<{ user: ForumUser }>(`/admin/users/${userId}/suspend`, { reason }),

  ban: (userId: string, reason: string) =>
    api.post<{ user: ForumUser }>(`/admin/users/${userId}/ban`, { reason }),

  restore: (userId: string) =>
    api.post<{ user: ForumUser }>(`/admin/users/${userId}/restore`),
};