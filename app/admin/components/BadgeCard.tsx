// app/admin/components/BadgeCard.tsx
'use client';

import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Star } from 'lucide-react';
import type { Badge } from '@/app/services/badges';

interface BadgeCardProps {
  badge: Badge;
  isSelected: boolean;
  onSelect: () => void;
}

export default function BadgeCard({ badge, isSelected, onSelect }: BadgeCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[badge.icon] as LucideIcon | undefined;

  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors
        ${isSelected ? 'bg-[#2d2e32]' : 'hover:bg-[#242528]'}`}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: badge.color + '18', color: badge.color }}
      >
        {Icon && <Icon size={12} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#e4e6eb] truncate">{badge.label}</p>
        <p className="text-[10px] text-[#4a4b50] capitalize">{badge.tier}</p>
      </div>
      {badge.isDefault && <Star size={11} className="text-[#f59e0b] shrink-0" fill="#f59e0b" />}
    </button>
  );
}