import { Shield, Star } from 'lucide-react';
import { Role } from '../../types/forum';

interface RoleBadgeProps {
  role: Role;
  customTitle?: string;
}

export default function RoleBadge({ role, customTitle }: RoleBadgeProps) {
  const Icon = role.icon === 'shield' ? Shield : role.icon === 'star' ? Star : null;

  return (
    <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: role.color }}>
      {Icon && <Icon size={10} />}
      {customTitle || role.name}
    </span>
  );
}