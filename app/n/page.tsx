// NotificationsPage.tsx
'use client';
import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { Notification, NotificationType } from './component/types';
import { NotificationItem } from './component/NotificationItem';
import { TYPE_META } from './component/utils';
import { NotificationService } from '@/app/services/notifications';
import { useRouter } from 'next/navigation';

type FilterType = 'all' | NotificationType;

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all',      label: 'All'       },
  { id: 'reply',    label: 'Replies'   },
  { id: 'quote',    label: 'Quotes'    },
  { id: 'reaction', label: 'Reactions' },
  { id: 'mention',  label: 'Mentions'  },
  { id: 'dm',       label: 'Messages'  },
  { id: 'warning',  label: 'Warnings'  },
  { id: 'system',   label: 'System'    },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    NotificationService.list(1)
      .then(res => {
        setNotifications(res.data.notifications ?? []);
        setHasMore(!!res.data.hasMore);
        setPage(1);
      })
      .catch(err => console.error('Failed to load notifications', err))
      .finally(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await NotificationService.list(page + 1);
      setNotifications(prev => [...prev, ...(res.data.notifications ?? [])]);
      setHasMore(!!res.data.hasMore);
      setPage(p => p + 1);
    } catch (err) {
      console.log('Failed to load more notifications', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (showUnreadOnly && n.read) return false;
    if (filter !== 'all' && n.type !== filter) return false;
    return true;
  });

  const handleRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    try { await NotificationService.markRead(id); }
    catch (err) { console.error('Failed to mark notification read', err); }
  };

  const handleReadAll = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try { await NotificationService.markAllRead(); }
    catch (err) { console.error('Failed to mark all notifications read', err); }
  };

  const handleDelete = async (id: string) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
    try { await NotificationService.delete(id); }
    catch (err) { console.error('Failed to delete notification', err); }
  };

  const handleClearRead = async () => {
    setNotifications(prev => prev.filter(n => !n.read));
    try { await NotificationService.clearRead(); }
    catch (err) { console.error('Failed to clear read notifications', err); }
  };

  return (
    <div className="min-h-screen bg-[#1b1c1f]">
      {/* Page header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#242528]">
         <div className=' max-w-5xl cursor-pointer mb-2  mx-auto pt-5'>
          <div onClick={()=>router.back()}>
          <ArrowLeft />
          </div>
          </div>
        <div className="max-w-5xl mx-auto px-4 pb-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#4b8ef1]/10 flex items-center justify-center">
            <Bell size={16} className="text-[#4b8ef1]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#e4e6eb]">Notifications</h1>
            <p className="text-[13px] font-medium text-[#b3b5bd]">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar + content */}
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-5">
        {/* ── Floating sidebar ── */}
        <aside className="hidden sm:block w-56 shrink-0">
          <div
            className="sticky top-6 bg-[#242528] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.35)' }}
          >
            {/* Filter list */}
            <nav className="p-1.5">
              {FILTERS.map(f => {
                const count = f.id === 'all'
                  ? notifications.length
                  : notifications.filter(n => n.type === f.id).length;
                if (count === 0 && f.id !== 'all') return null;

                const active = filter === f.id;
                const meta = f.id !== 'all' ? TYPE_META[f.id as NotificationType] : null;

                return (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-base font-medium transition-colors relative
                      ${active ? 'bg-[#4b8ef1]/10 text-[#e4e6eb]' : 'text-[#b8babd] hover:bg-[#6e6f72] hover:text-[#e4e6eb]'}`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-[#4b8ef1]" />
                    )}
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[13px]"
                      style={{
                        backgroundColor: meta ? `${meta.color}1f` : 'rgba(75,142,241,0.12)',
                        color: meta ? meta.color : '#4b8ef1',
                      }}
                    >
                      {meta ? meta.icon : <Bell size={11} />}
                    </span>
                    <span className="flex-1 text-left truncate">{f.label}</span>
                    <span
                      className={`text-[13px] font-bold px-1.5 py-0.5 rounded-full shrink-0
                        ${active ? 'bg-[#4b8ef1]/20 text-[#4b8ef1]' : 'bg-[#1b1c1f] text-[#4a4b50]'}`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-[rgba(255,255,255,0.06)]" />

            {/* Unread-only switch */}
            <div className="px-3.5 py-3 flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#cdd1db]">Unread only</span>
              <button
                onClick={() => setShowUnreadOnly(v => !v)}
                aria-pressed={showUnreadOnly}
                className={`relative w-8 h-4.5 rounded-full transition-colors shrink-0 ${showUnreadOnly ? 'bg-[#4b8ef1]' : 'bg-[#1b1c1f] border border-[rgba(255,255,255,0.1)]'}`}
              >
                <span
                  className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${showUnreadOnly ? 'translate-x-4' : 'translate-x-0.5'}`}
                />
              </button>
            </div>

            <div className="border-t border-[rgba(255,255,255,0.06)]" />

            {/* Actions */}
            <div className="p-1.5 space-y-0.5">
              {unreadCount > 0 && (
                <button
                  onClick={handleReadAll}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-base font-medium text-[#4b8ef1] hover:bg-[#4b8ef1]/10 transition-colors"
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
              <button
                onClick={handleClearRead}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-base font-medium text-[#c6c8ca] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
              >
                <Trash2 size={13} /> Clear read
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main list ── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={20} className="animate-spin text-[#4a4b50]" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState filter={filter} showUnreadOnly={showUnreadOnly} />
          ) : (
            <>
              <div className="bg-[#242528] rounded-xl border border-[rgba(255,255,255,0.06)] overflow-hidden divide-y divide-[rgba(255,255,255,0.04)]">
                {filtered.map(n => (
                  <NotificationRow key={n._id} notification={n} onRead={handleRead} onDelete={handleDelete} />
                ))}
              </div>

              {hasMore && filter === 'all' && !showUnreadOnly && (
                <div className="flex justify-center mt-4">
                  <button onClick={loadMore} disabled={loadingMore} className="px-4 py-2 text-xs font-medium text-[#4b8ef1] hover:text-[#6ba3f5] disabled:opacity-50 transition-colors">
                    {loadingMore ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationRow({ notification, onRead, onDelete }: {
  notification: Notification; onRead: (id: string) => void; onDelete: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <NotificationItem notification={notification} onRead={onRead} compact={false} />
      {hovered && (
        <button
          onClick={(e) => { e.preventDefault(); onDelete(notification._id); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded hover:bg-[#ef4444]/10 text-[#cacbd1] hover:text-[#ef4444] transition-colors"
          title="Delete notification"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

function EmptyState({ filter, showUnreadOnly }: { filter: FilterType; showUnreadOnly: boolean }) {
  const message = showUnreadOnly ? 'No unread notifications' : filter !== 'all' ? `No ${filter} notifications` : 'No notifications yet';
  const sub = showUnreadOnly ? "You've read everything." : filter !== 'all' ? 'Nothing in this category yet.' : "When someone replies, quotes, or mentions you, it'll show up here.";

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-[#242528] rounded-xl border border-[rgba(255,255,255,0.06)]">
      <div className="w-12 h-12 rounded-full bg-[#1b1c1f] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-3">
        <Bell size={18} className="text-[#b1b3b9]" />
      </div>
      <p className="text-base font-semibold text-[#ced0d1]">{message}</p>
      <p className="text-sm text-[#aeaeb1] mt-1 max-w-xs">{sub}</p>
    </div>
  );
}