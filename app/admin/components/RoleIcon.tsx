import type { ReactNode } from 'react';
import { Crown, Star, Shield, User } from 'lucide-react';

const ROLE_ICONS: Record<string, ReactNode> = {
  'Member':        <User size={13} />,
  'Senior Member': <Star size={13} />,
  'Moderator':     <Shield size={13} />,
  'Admin':         <Crown size={13} />,
};

/** Returns the icon associated with a role name, falling back to a generic shield. */
export default function RoleIcon({ name, size = 13 }: { name: string; size?: number }) {
  const icon = ROLE_ICONS[name];
  if (icon) return <>{icon}</>;
  return <Shield size={size} />;
}