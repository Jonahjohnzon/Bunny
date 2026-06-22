// app/admin/announcements/components/AnnouncementCard.tsx
'use client';
import { Megaphone, AlertTriangle, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import type { Announcement } from '@/app/services/announcement';

const TYPE_META: Record<Announcement['type'], { color: string; Icon: typeof Megaphone }> = {
  info:    { color: '#4b8ef1', Icon: Megaphone },
  warning: { color: '#f59e0b', Icon: AlertTriangle },
  success: { color: '#10b981', Icon: CheckCircle2 },
  danger:  { color: '#ef4444', Icon: AlertCircle },
};

function timeRemaining(expiresAt: string | null): string | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const hours = Math.floor(diff / (60 * 60 * 1000));
  if (hours < 1) return `${Math.floor(diff / 60000)}m left`;
  if (hours < 24) return `${hours}h left`;
  return `${Math.floor(hours / 24)}d left`;
}

export default function AnnouncementCard({
  announcement, isSelected, onSelect,
}: {
  announcement: Announcement;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meta = TYPE_META[announcement.type] ?? TYPE_META.info;
  const remaining = timeRemaining(announcement.expiresAt);
  const isExpired = remaining === 'Expired';
  const isLive = announcement.isActive && !isExpired;

  return (
    <button
      onClick={onSelect}
      className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-colors w-full
        ${isSelected ? 'bg-[#1e1f23] border-[#4b8ef1]/40' : 'bg-[#1b1c1f] border-transparent hover:border-[rgba(255,255,255,0.08)]'}`}
    >
      <meta.Icon size={13} className="shrink-0 mt-0.5" style={{ color: meta.color }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#e4e6eb] line-clamp-2 leading-snug">{announcement.message}</p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: isLive ? meta.color + '20' : '#2d2e32', color: isLive ? meta.color : '#4a4b50' }}
          >
            {isLive ? 'LIVE' : announcement.isActive ? 'EXPIRED' : 'OFF'}
          </span>
          {remaining && !isExpired && (
            <span className="text-[10px] text-[#4a4b50] flex items-center gap-0.5">
              <Clock size={9} /> {remaining}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}