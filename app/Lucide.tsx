import * as LucideIcons from 'lucide-react';
import { type LucideIcon, HelpCircle } from 'lucide-react';

export default function CategoryIcon({ name, size = 13 }: { name?: string | null; size?: number }) {
  const Icon = (name && (LucideIcons as unknown as Record<string, LucideIcon>)[name]) || HelpCircle;
  return <Icon size={size} />;
}