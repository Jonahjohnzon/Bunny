'use client';
import { useState, useRef, useEffect } from 'react';
import { Bell, ArrowRight, CheckCheck } from 'lucide-react';
import { Notification } from './types';
import { NotificationItem } from './NotificationItem';

interface NotificationBellProps {
  notifications: Notification[];
  onRead: (id: string) => void;
  onReadAll: () => void;
}

export function NotificationBell({ notifications, onRead, onReadAll }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const preview = notifications.slice(0, 5); // show 5 in popup

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`w-8 h-8 flex items-center cursor-pointer justify-center rounded transition-colors relative
          ${open ? 'bg-[#2d2e32] text-[#e4e6eb]' : 'text-white hover:bg-[#2d2e32] hover:text-[#e4e6eb]'}`}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#ef4444] text-white text-[9px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#242528] border border-[rgba(255,255,255,0.08)] rounded-lg shadow-2xl z-50 overflow-hidden"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#e4e6eb]">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-[#4b8ef1] text-white px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={onReadAll}
                className="flex items-center gap-1 text-[13px] text-[#4b8ef1] hover:text-[#6ba3f5] transition-colors"
              >
                <CheckCheck size={11} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="divide-y divide-[rgba(255,255,255,0.04)] max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-white">
            {preview.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <Bell size={20} className="text-[#4a4b50] mx-auto mb-2" />
                <p className="text-xs text-[#4a4b50]">{`You're all caught up`}</p>
              </div>
            ) : (
              preview.map(n => (
                <NotificationItem
                  key={n._id}
                  notification={n}
                  onRead={onRead}
                  compact
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[rgba(255,255,255,0.06)]">
            <a
              href="/n?page=1"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 text-sm font-medium text-[#4b8ef1] hover:text-[#6ba3f5] hover:bg-[#1b1c1f] transition-colors"
            >
              View all notifications <ArrowRight size={11} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}