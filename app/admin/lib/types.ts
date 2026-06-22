// ── Permissions ───────────────────────────────────────────────────────────
export interface Permissions {
  // Threads
  canCreateThread: boolean;
  canReplyToThread: boolean;
  canEditOwnThread: boolean;
  canDeleteOwnThread: boolean;
  canPinThread: boolean;
  canLockThread: boolean;
  canMoveThread: boolean;
  // Posts
  canEditOwnPost: boolean;
  canDeleteOwnPost: boolean;
  canEditAnyPost: boolean;
  canDeleteAnyPost: boolean;
  // Profile
  canUploadAvatar: boolean;
  canUseSignature: boolean;
  canSendDM: boolean;
  // Moderation
  canBanUser: boolean;
  canWarnUser: boolean;
  canViewReports: boolean;
  canManageReports: boolean;
  canViewIPs: boolean;
  canModerate: boolean;
  // Administration
  canManageRoles: boolean;
  canManageCategories: boolean;
  canManageThemes: boolean;
  canAccessAdmin: boolean;
}

// ── Roles ─────────────────────────────────────────────────────────────────
export interface Role {
  _id: string;
  name: string;
  color: string;
  priority: number;
  isDefault: boolean;
  permissions: Permissions;
}

// ── Users ─────────────────────────────────────────────────────────────────
export type UserStatus = 'active' | 'warned' | 'banned' | 'suspended';

export interface Warning {
  _id: string;
  reason: string;
  issuedBy: string;
  issuedAt: string; // ISO date
}

export interface BanInfo {
  reason: string;
  bannedBy: string;
  bannedAt: string; // ISO date
  expiresAt: string | null; // null = permanent
}

export interface ForumUser {
  _id: string;
  username: string;       // editable
  displayName: string;    // editable
  email: string;          // editable
  avatarUrl: string;      // editable
  bio: string;            // editable
  role: Role;         // editable (assign role)
  status: UserStatus;     // editable via actions (ban/suspend/warn/restore)
  postCount: number;      // NOT editable — system-tracked stat
  threadCount: number;    // NOT editable — system-tracked stat
  reputation: number;     // NOT editable — system-tracked stat
  createdAt: string;       // NOT editable — immutable record
  lastSeenAt: string;     // NOT editable — system-tracked
  signature: string;      // editable
  warnings: Warning[];    // editable via warn action
  banInfo: BanInfo | null;// editable via ban/unban action
  ipAddress: string;      // NOT editable — visible only to permitted roles
}