'use client';
import { Trash2 } from 'lucide-react';
import RoleIcon from './RoleIcon';
import type { Role } from '../lib/types';

export default function RoleCard({
  role, isSelected, onSelect, onDelete,
}: {
  role: Role; isSelected: boolean; onSelect: () => void; onDelete?: () => void;
}) {
  const isAdmin = role.priority === 4;
  const enabledCount = Object.values(role.permissions).filter(Boolean).length;
  const totalCount = Object.keys(role.permissions).length;

  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border
        ${isSelected
          ? 'bg-[#1e2535] border-[#4b8ef1]/40'
          : 'bg-[#1e1f23] border-transparent hover:bg-[#242528] hover:border-[rgba(255,255,255,0.06)]'
        }`}
    >
      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: role.color + '22', color: role.color }}>
        <RoleIcon name={role.name} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-[#e4e6eb] truncate">{role.name}</span>
          {role.isDefault && (
            <span className="text-[9px] bg-[#4b8ef1]/15 text-[#4b8ef1] px-1 py-0.5 rounded font-bold">DEFAULT</span>
          )}
        </div>
        <div className="text-[10px] text-[#4a4b50] mt-0.5">
          {isAdmin ? 'All permissions' : `${enabledCount}/${totalCount} permissions`}
        </div>
      </div>

      {!isAdmin && !role.isDefault && onDelete && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="w-6 h-6 flex items-center justify-center rounded text-[#4a4b50] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors shrink-0"
        >
          <Trash2 size={11} />
        </button>
      )}
    </div>
  );
}