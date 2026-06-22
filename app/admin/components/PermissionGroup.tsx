'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Toggle from './Toggle';
import { PERMISSION_GROUPS, PERMISSION_LABELS } from '../lib/permissions';
import type { Permissions } from '../lib/types';

export default function PermissionGroup({
  group, permissions, onChange, disabled = false, hideEnableAll = false,
}: {
  group: typeof PERMISSION_GROUPS[0];
  permissions: Permissions;
  onChange?: (key: keyof Permissions, value: boolean) => void;
  /** When true, all toggles render disabled (e.g. locked Admin role, or read-only viewer view) */
  disabled?: boolean;
  /** Hide the "Enable all / Disable all" shortcut, e.g. for read-only contexts */
  hideEnableAll?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const enabledCount = group.keys.filter(k => permissions[k]).length;

  return (
    <div className="border border-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(v => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(v => !v);
          }
        }}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#1e1f23] hover:bg-[#232428] transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-[#e4e6eb] uppercase tracking-widest">{group.label}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
            ${enabledCount === group.keys.length ? 'bg-[#4b8ef1]/20 text-[#4b8ef1]' :
              enabledCount === 0 ? 'bg-[#2d2e32] text-[#4a4b50]' :
              'bg-[#10b981]/15 text-[#10b981]'}`}>
            {enabledCount}/{group.keys.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!disabled && !hideEnableAll && onChange && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const allOn = group.keys.every(k => permissions[k]);
                group.keys.forEach(k => onChange(k, !allOn));
              }}
              className="text-[10px] text-[#4a4b50] hover:text-[#8a8d91] transition-colors px-1.5"
            >
              {group.keys.every(k => permissions[k]) ? 'Disable all' : 'Enable all'}
            </button>
          )}
          {open ? <ChevronUp size={13} className="text-[#4a4b50]" /> : <ChevronDown size={13} className="text-[#4a4b50]" />}
        </div>
      </div>

      {open && (
        <div className="divide-y divide-[rgba(255,255,255,0.04)]">
          {group.keys.map(key => (
            <div key={key} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#242528] transition-colors">
              <span className="text-xs text-[#a8b3cf]">{PERMISSION_LABELS[key]}</span>
              <Toggle
                value={permissions[key]}
                onChange={(v) => onChange?.(key, v)}
                disabled={disabled || !onChange}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}