'use client';
import RoleIcon from './RoleIcon';
import type { Role } from '../lib/types';

export default function RoleSelect({
  roles, value, onChange,
}: {
  roles: Role[]; value: string; onChange: (roleId: string) => void;
}) {
  const sorted = [...roles].sort((a, b) => b.priority - a.priority);
  const current = roles.find(r => r._id === value);

  return (
    <div>
      <label className="text-[11px] text-[#8a8d91] mb-1 block">Role</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none bg-[#1b1c1f] border border-[rgba(255,255,255,0.08)] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#e4e6eb] outline-none focus:border-[#4b8ef1] transition-colors"
        >
          {sorted.map(r => (
            <option key={r._id} value={r._id}>{r.name}</option>
          ))}
        </select>
        {current && (
          <span
            className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: current.color }}
          >
            <RoleIcon name={current.name} size={12} />
          </span>
        )}
      </div>
    </div>
  );
}