import type { Permissions } from './types';

// ── Permission groups (used to render grouped toggle lists) ─────────────────
export const PERMISSION_GROUPS: { label: string; keys: (keyof Permissions)[] }[] = [
  {
    label: 'Threads',
    keys: ['canCreateThread', 'canReplyToThread', 'canEditOwnThread', 'canDeleteOwnThread', 'canPinThread', 'canLockThread', 'canMoveThread'],
  },
  {
    label: 'Posts',
    keys: ['canEditOwnPost', 'canDeleteOwnPost', 'canEditAnyPost', 'canDeleteAnyPost'],
  },
  {
    label: 'Profile',
    keys: ['canUploadAvatar', 'canUseSignature', 'canSendDM'],
  },
  {
    label: 'Moderation',
    keys: ['canBanUser', 'canWarnUser', 'canViewReports', 'canManageReports', 'canViewIPs', 'canModerate'],
  },
  {
    label: 'Administration',
    keys: ['canManageRoles', 'canManageCategories', 'canManageThemes', 'canAccessAdmin'],
  },
];

export const PERMISSION_LABELS: Record<keyof Permissions, string> = {
  canCreateThread:     'Create threads',
  canReplyToThread:    'Reply to threads',
  canEditOwnThread:    'Edit own threads',
  canDeleteOwnThread:  'Delete own threads',
  canPinThread:        'Pin threads',
  canLockThread:       'Lock threads',
  canMoveThread:       'Move threads',
  canEditOwnPost:      'Edit own posts',
  canDeleteOwnPost:    'Delete own posts',
  canEditAnyPost:      'Edit any post',
  canDeleteAnyPost:    'Delete any post',
  canUploadAvatar:     'Upload avatar',
  canUseSignature:     'Use signature',
  canSendDM:           'Send direct messages',
  canBanUser:          'Ban users',
  canWarnUser:         'Warn users',
  canViewReports:      'View reports',
  canManageReports:    'Manage reports',
  canViewIPs:          'View IP addresses',
  canModerate:         'Moderate content',
  canManageRoles:      'Manage roles',
  canManageCategories: 'Manage categories',
  canManageThemes:     'Manage themes',
  canAccessAdmin:      'Access admin panel',
};

// ── Default permission sets ──────────────────────────────────────────────
export const DEFAULT_PERMISSIONS: Permissions = {
  canCreateThread: false, canReplyToThread: false, canEditOwnThread: false,
  canDeleteOwnThread: false, canPinThread: false, canLockThread: false, canMoveThread: false,
  canEditOwnPost: false, canDeleteOwnPost: false, canEditAnyPost: false, canDeleteAnyPost: false,
  canUploadAvatar: false, canUseSignature: false, canSendDM: false,
  canBanUser: false, canWarnUser: false, canViewReports: false, canManageReports: false, canViewIPs: false,
  canManageRoles: false, canManageCategories: false, canManageThemes: false, canAccessAdmin: false, canModerate: false,
};

export const PRESET_PERMISSIONS: Record<string, Partial<Permissions>> = {
  member: {
    canCreateThread: true, canReplyToThread: true, canEditOwnThread: true,
    canEditOwnPost: true, canUploadAvatar: true, canUseSignature: true, canSendDM: true,
  },
  seniorMember: {
    canCreateThread: true, canReplyToThread: true, canEditOwnThread: true,
    canDeleteOwnThread: true, canEditOwnPost: true, canDeleteOwnPost: true,
    canUploadAvatar: true, canUseSignature: true, canSendDM: true,
  },
  moderator: {
    canCreateThread: true, canReplyToThread: true, canEditOwnThread: true,
    canDeleteOwnThread: true, canPinThread: true, canLockThread: true, canMoveThread: true,
    canEditOwnPost: true, canDeleteOwnPost: true, canEditAnyPost: true, canDeleteAnyPost: true,
    canUploadAvatar: true, canUseSignature: true, canSendDM: true,
    canBanUser: true, canWarnUser: true, canViewReports: true, canManageReports: true,
    canViewIPs: true, canModerate: true, canAccessAdmin: true,
  },
};