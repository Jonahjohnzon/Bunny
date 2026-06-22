// services/roles.ts
import ForumApi from '../ApiCore';
import type { Role, Permissions } from '../admin/lib/types';

const api = new ForumApi();

export const RoleService = {
  list: () => api.get<{ roles: Role[] }>('/admin/roles'),

  create: (body: {
    name: string;
    color: string;
    priority: number;
    isDefault: boolean;
    permissions: Permissions;
  }) => api.post<{ role: Role }>('/admin/roles', body),

  update: (
    roleId: string,
    body: Partial<Pick<Role, 'name' | 'color' | 'priority' | 'isDefault' | 'permissions'>>
  ) => api.patch<{ role: Role }>(`/admin/roles/${roleId}`, body),

  delete: (roleId: string) => api.delete<{ success: boolean }>(`/admin/roles/${roleId}`),
};