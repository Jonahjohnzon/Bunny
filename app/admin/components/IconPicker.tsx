// app/admin/components/IconPicker.tsx
'use client';

import { useState } from 'react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const BADGE_ICONS = [
  'Award', 'Trophy', 'Crown', 'Star', 'Shield', 'ShieldCheck', 'Flame',
  'Rocket', 'Zap', 'Gem', 'Medal', 'Heart', 'ThumbsUp', 'Sparkles',
  'Target', 'Diamond', 'Sun', 'Moon', 'Swords', 'BookOpen', 'Pen',
  'Camera', 'Mic', 'Code', 'Bug', 'Wrench', 'Compass', 'MapPin',
  'Anchor', 'Feather',
];

interface IconPickerProps {
  value: string;
  color: string;
  onChange: (icon: string) => void;
}

export default function IconPicker({ value, color, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SelectedIcon = (Icons as any)[value] as LucideIcon | undefined;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-10 h-10 rounded-lg flex items-center justify-center border border-[rgba(255,255,255,0.08)] hover:border-[#4b8ef1]/40 transition-colors"
        style={{ backgroundColor: color + '18', color }}
      >
        {SelectedIcon ? <SelectedIcon size={16} /> : <Icons.HelpCircle size={16} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-12 left-0 z-20 w-64 p-2 bg-[#242528] border border-[rgba(255,255,255,0.08)] rounded-lg shadow-xl grid grid-cols-6 gap-1">
            {BADGE_ICONS.map(name => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const Icon = (Icons as any)[name] as LucideIcon;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => { onChange(name); setOpen(false); }}
                  className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors
                    ${value === name ? 'bg-[#4b8ef1]/15 text-[#4b8ef1]' : 'text-[#8a8d91] hover:bg-[#2d2e32] hover:text-[#e4e6eb]'}`}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}