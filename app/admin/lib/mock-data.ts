import type { Role, ForumUser } from './types';
import { DEFAULT_PERMISSIONS, PRESET_PERMISSIONS } from './permissions';

// ── Roles ─────────────────────────────────────────────────────────────────
export const INITIAL_ROLES: Role[] = [
  {
    _id: '1', name: 'Member', color: '#8a8d91', priority: 1, isDefault: true,
    permissions: { ...DEFAULT_PERMISSIONS, ...PRESET_PERMISSIONS.member },
  },
  {
    _id: '2', name: 'Senior Member', color: '#10b981', priority: 2, isDefault: false,
    permissions: { ...DEFAULT_PERMISSIONS, ...PRESET_PERMISSIONS.seniorMember },
  },
  {
    _id: '3', name: 'Moderator', color: '#4b8ef1', priority: 3, isDefault: false,
    permissions: { ...DEFAULT_PERMISSIONS, ...PRESET_PERMISSIONS.moderator },
  },
  {
    _id: '4', name: 'Admin', color: '#ef4444', priority: 4, isDefault: false,
    permissions: Object.fromEntries(Object.keys(DEFAULT_PERMISSIONS).map(k => [k, true])) as unknown as Role['permissions'],
  },
];

// ── Users ─────────────────────────────────────────────────────────────────
export const INITIAL_USERS: ForumUser[] = [
  {
    _id: 'u1', username: 'arin_k', displayName: 'Arin K.', email: 'arin.k@example.com',
    avatarUrl: '', bio: 'Long-time lurker, finally posting.', roleId: '1', status: 'active',
    postCount: 142, threadCount: 12, reputation: 38,
    joinedAt: '2023-02-11T10:00:00Z', lastSeenAt: '2026-06-16T18:22:00Z',
    signature: '— Arin', warnings: [], banInfo: null, ipAddress: '102.89.23.14',
  },
  {
    _id: 'u2', username: 'mod_eze', displayName: 'Eze (Mod)', email: 'eze@example.com',
    avatarUrl: '', bio: 'Keeping the peace since 2022.', roleId: '3', status: 'active',
    postCount: 2310, threadCount: 88, reputation: 540,
    joinedAt: '2022-05-03T08:00:00Z', lastSeenAt: '2026-06-17T07:01:00Z',
    signature: 'Be excellent to each other.', warnings: [], banInfo: null, ipAddress: '197.211.55.2',
  },
  {
    _id: 'u3', username: 'troll_99', displayName: 'troll_99', email: 'troll99@example.com',
    avatarUrl: '', bio: '', roleId: '1', status: 'warned',
    postCount: 19, threadCount: 4, reputation: -6,
    joinedAt: '2026-04-20T14:00:00Z', lastSeenAt: '2026-06-15T22:40:00Z',
    signature: '', warnings: [
      { _id: 'w1', reason: 'Personal attack in "Off Topic" thread', issuedBy: 'mod_eze', issuedAt: '2026-06-10T12:00:00Z' },
    ], banInfo: null, ipAddress: '154.113.9.201',
  },
  {
    _id: 'u4', username: 'spammer_bot', displayName: 'spammer_bot', email: 'spam@example.com',
    avatarUrl: '', bio: '', roleId: '1', status: 'banned',
    postCount: 3, threadCount: 3, reputation: -20,
    joinedAt: '2026-06-01T09:00:00Z', lastSeenAt: '2026-06-01T09:15:00Z',
    signature: '', warnings: [], banInfo: {
      reason: 'Posting promotional spam links', bannedBy: 'mod_eze',
      bannedAt: '2026-06-01T09:20:00Z', expiresAt: null,
    }, ipAddress: '88.45.190.3',
  },
  {
    _id: 'u5', username: 'sade_writes', displayName: 'Sade', email: 'sade@example.com',
    avatarUrl: '', bio: 'Writer, reader, occasional chaos agent.', roleId: '2', status: 'active',
    postCount: 875, threadCount: 41, reputation: 212,
    joinedAt: '2023-11-19T16:00:00Z', lastSeenAt: '2026-06-17T01:10:00Z',
    signature: 'Words are free, choose them wisely.', warnings: [], banInfo: null, ipAddress: '105.112.67.88',
  },
  {
    _id: 'u6', username: 'root_admin', displayName: 'Root', email: 'admin@example.com',
    avatarUrl: '', bio: 'Site owner.', roleId: '4', status: 'active',
    postCount: 50, threadCount: 9, reputation: 999,
    joinedAt: '2021-01-01T00:00:00Z', lastSeenAt: '2026-06-17T08:00:00Z',
    signature: '', warnings: [], banInfo: null, ipAddress: '41.58.21.100',
  },
];