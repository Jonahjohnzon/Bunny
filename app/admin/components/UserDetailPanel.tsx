/* eslint-disable @typescript-eslint/no-unused-vars */
// components/UserDetailPanel.tsx
'use client';
import { useState } from 'react';
import { Check, Ban, Eye, EyeOff, AlertTriangle } from 'lucide-react';

import Field from './Field';
import StatBlock from './StatBlock';
import RoleSelect from './RoleSelect';
import RoleIcon from './RoleIcon';
import ModerationActions from './ModerationActions';
import ConfirmModal from './ConfirmModal';
import WarningsList from './WarningsList';

import { formatDate, timeAgo } from '../lib/date';
import { UserService } from '../../services/users';
import type { ForumUser, Role } from '../lib/types';
import Avatar from '@/app/MainPage/trendingThreads/components/Avatar';

type ModalKind = 'warn' | 'suspend' | 'ban' | null;

export default function UserDetailPanel({
  user, roles, canViewIPs, myPriority, onUpdate,
}: {
  user: ForumUser;
  roles: Role[];
  canViewIPs: boolean;
  // The viewing admin's own role priority. Drives whether they can change this
  // user's role or touch their effective permissions — see isLocked below.
  myPriority: number;
  onUpdate: (id: string, patch: Partial<ForumUser>) => void;
}) {
  const [modal, setModal] = useState<ModalKind>(null);
  const [showIp, setShowIp] = useState(false);
  const [roleSaved, setRoleSaved] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const role = roles.find(r => r._id === user.role._id);

  // Locked if the target user's current role outranks (or matches) the viewer's own —
  // i.e. you can only manage users whose role sits strictly below your own.
  // role?.priority defaulting to Infinity means "unknown role" fails closed (locked),
  // rather than accidentally unlocking if a role lookup ever comes back empty.
  const isLocked = (role?.priority ?? Infinity) >= myPriority;

  const handleRoleChange = async (roleId: string) => {
    const prevRole = user.role;
    const newRole = roles.find(r => r._id === roleId);
    if (!newRole) return;
    onUpdate(user._id, { role: newRole }); // optimistic
    setActionError(null);
    try {
      const { user: updated } = await UserService.update(user._id, { role: roleId });
      onUpdate(user._id, updated);
      setRoleSaved(true);
      setTimeout(() => setRoleSaved(false), 1500);
    } catch (err) {
      onUpdate(user._id, { role: prevRole }); // rollback
      setActionError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const handleWarn = async (reason: string) => {
    setPending(true);
    setActionError(null);
    try {
      const { user: updated } = await UserService.warn(user._id, reason);
      onUpdate(user._id, updated);
      setModal(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to issue warning');
    } finally {
      setPending(false);
    }
  };

  const handleSuspend = async (reason: string) => {
    setPending(true);
    setActionError(null);
    try {
      const { user: updated } = await UserService.suspend(user._id, reason);
      onUpdate(user._id, updated);
      setModal(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to suspend user');
    } finally {
      setPending(false);
    }
  };

  const handleBan = async (reason: string) => {
    setPending(true);
    setActionError(null);
    try {
      const { user: updated } = await UserService.ban(user._id, reason);
      onUpdate(user._id, updated);
      setModal(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to ban user');
    } finally {
      setPending(false);
    }
  };

  const handleRestore = async () => {
    setPending(true);
    setActionError(null);
    try {
      const { user: updated } = await UserService.restore(user._id);
      onUpdate(user._id, updated);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to restore user');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={user.username}/>
        <div>
          <h2 className="text-sm font-bold text-[#e4e6eb]">{user.displayName}</h2>
          <p className="text-[10px] text-[#4a4b50]">@{user.username} · joined {formatDate(user.createdAt)}</p>
        </div>
      </div>

      {actionError && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#ef4444]/08 border border-[#ef4444]/20 rounded-lg mb-4">
          <AlertTriangle size={13} className="text-[#ef4444] shrink-0" />
          <p className="text-xs text-[#ef4444]">{actionError}</p>
        </div>
      )}

      {user.status === 'banned' && user.banInfo && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#ef4444]/08 border border-[#ef4444]/20 rounded-lg mb-4">
          <Ban size={13} className="text-[#ef4444] shrink-0" />
          <p className="text-xs text-[#ef4444]">
            Banned by {user.banInfo.bannedBy} on {formatDate(user.banInfo.bannedAt)} — {user.banInfo.reason}
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2.5 mb-4">
        <StatBlock label="Posts" value={user.postCount} />
        <StatBlock label="Threads" value={user.threadCount} />
        <StatBlock label="Reputation" value={user.reputation} />
        <StatBlock label="Last seen" value={timeAgo(user.lastSeenAt)} />
      </div>

      <div className="mb-5">
        <p className="text-[10px] font-bold text-[#4a4b50] uppercase tracking-widest mb-2">Moderation</p>
        <ModerationActions
          status={user.status}
          onWarn={() => setModal('warn')}
          onSuspend={() => setModal('suspend')}
          onBan={() => setModal('ban')}
          onRestore={handleRestore}
        />
      </div>

      <div className="mb-5">
        <p className="text-[10px] font-bold text-[#4a4b50] uppercase tracking-widest mb-2">Profile</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Username" value={`@${user.username}`} readOnly />
          <Field label="Display name" value={user.displayName} readOnly />
          <Field label="Email" value={user.email} readOnly />
          <Field label="Joined" value={formatDate(user.createdAt)} readOnly />
          <div className="col-span-2">
            <Field label="Bio" value={user.bio} readOnly placeholder="No bio set" multiline />
          </div>
          <div className="col-span-2">
            <Field label="Signature" value={user.signature} readOnly placeholder="No signature set" multiline />
          </div>
          {canViewIPs ? (
            <div className="relative">
              <Field label="IP address" value={showIp ? user.ipAddress : '••••••••••'} readOnly />
              <button
                type="button"
                onClick={() => setShowIp(v => !v)}
                className="absolute right-2 top-6.5 text-[#4a4b50] hover:text-[#8a8d91] transition-colors"
              >
                {showIp ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
          ) : (
            <Field label="IP address" value="Restricted — requires canViewIPs" readOnly />
          )}
        </div>
        <p className="text-[10px] text-[#4a4b50] mt-2">
          Profile fields are set by the user and can&apos;t be edited from here. Use the moderation actions above to warn, suspend, or ban, and the role control below to change permissions.
        </p>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold text-[#4a4b50] uppercase tracking-widest">Role</p>
          {roleSaved && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#10b981]">
              <Check size={10} /> Updated
            </span>
          )}
        </div>
        {isLocked ? (
          <p className="text-xs text-[#4a4b50]">
            You don&apos;t have permission to change this user&apos;s role.
          </p>
        ) : (
          <div className="max-w-xs">
            <RoleSelect roles={roles} value={user.role._id} onChange={handleRoleChange} />
          </div>
        )}
      </div>

      <div className="mb-5">
        <p className="text-[10px] font-bold text-[#4a4b50] uppercase tracking-widest mb-2">Warning history</p>
        <WarningsList warnings={user.warnings} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[10px] font-bold text-[#4a4b50] uppercase tracking-widest">Effective permissions</p>
          {role && (
            <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: role.color }}>
              <RoleIcon name={role.name} size={10} /> via {role.name}
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#4a4b50] mt-2">
          Permissions come from the assigned role. To change what this user can do, edit their role above or visit Roles & Permissions.
        </p>
      </div>

      {modal === 'warn' && (
        <ConfirmModal
          title="Warn user"
          description={`Issue a warning to ${user.displayName}. They'll see the reason on their account.`}
          confirmLabel="Issue warning"
          danger={false}
          requireReason
          onConfirm={handleWarn}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'suspend' && (
        <ConfirmModal
          title="Suspend user"
          description={`Temporarily block ${user.displayName} from posting until reinstated.`}
          confirmLabel="Suspend"
          requireReason
          onConfirm={handleSuspend}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'ban' && (
        <ConfirmModal
          title="Ban user"
          description={`Permanently block ${user.displayName} from accessing the forum. This can be reversed later from this page.`}
          confirmLabel="Ban user"
          requireReason
          onConfirm={handleBan}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}