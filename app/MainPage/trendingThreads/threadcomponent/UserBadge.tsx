// components/UserBadges.tsx
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserBadge } from '../../types/forum';

interface UserBadgesProps {
  badges?: UserBadge[];
  size?: number;
}

export default function UserBadges({ badges, size = 11 }: UserBadgesProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap justify-center">
      {badges.map(({badge}) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
       
        const Icon = (Icons as any)[badge.icon] as LucideIcon | undefined;
        return (
          <div
            key={badge._id}
            title={badge.label}
            className="w-5 h-5 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.08)]"
            style={{ backgroundColor: badge.color + '18', color: badge.color }}
          >
            {Icon && <Icon size={size - 2} />}
          </div>
        );
      })}
    </div>
  );
}