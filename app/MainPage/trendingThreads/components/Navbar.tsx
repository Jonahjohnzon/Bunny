// Navbar.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Power, Menu, X, UserPlus } from 'lucide-react';
import Avatar from './Avatar';
import { useSnapshot } from 'valtio';
import { store } from '@/app/store';
import { NotificationBell } from '@/app/n/component/NotificationBell';
import { Notification } from '@/app/n/component/types';
import { NotificationService } from '@/app/services/notifications';
import { useRouter } from 'nextjs-toploader/app';
import { MessagesBell } from '@/app/messages/component/MessagesBell';
import LogoutButton from './LogoutButton';

function NavbarAuthSkeleton() {
  return (
    <div className="ml-auto flex items-center gap-2">
      <div className="w-8 h-8 rounded-md bg-[#2d2e32] animate-pulse" />
      <div className="w-8 h-8 rounded-md bg-[#2d2e32] animate-pulse" />
      <div className="flex items-center gap-2 pl-2 ml-1 border-l border-[rgba(255,255,255,0.06)]">
        <div className="w-7 h-7 rounded-full bg-[#2d2e32] animate-pulse" />
        <div className="w-14 h-3 rounded bg-[#2d2e32] animate-pulse hidden sm:block" />
      </div>
    </div>
  );
}

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const snap = useSnapshot(store);
  const id = snap._id;
  const user_name = snap.username;
  const hydrated = snap.hydrated;
  const avatar = snap.avatar;
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!id) return;
    NotificationService.list(1)
      .then(res => setNotifications(res?.data?.notifications ?? []))
      .catch(err => console.error('Failed to load notifications', err));
  }, [id]);

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  const onRead = async (notifId: string) => {
    setNotifications(prev => prev.map(n => (n._id === notifId ? { ...n, read: true } : n)));
    try { await NotificationService.markRead(notifId); } catch {}
  };

  const onReadAll = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try { await NotificationService.markAllRead(); } catch {}
  };

  const handleSearch = () => {
    const q = search.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[#1b1c1f]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">

          {/* Logo */}
          <Link href="/" className="flex text-[#e4e6eb] hover:text-[#4b8ef1] items-center gap-2 shrink-0">
            <img src="/logo.png" className="w-10" alt="BUNNYFORUM" />
            <span className="font-semibold text-sm tracking-tight hidden sm:block">
              BUNNY FORUM
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-0.5 ml-2">
            {["WHAT'S NEW"].map(item => (
              <a
                key={item}
                href="#"
                className="px-3 py-1.5 text-sm font-medium text-white hover:text-[#e4e6eb] hover:bg-[#2d2e32] rounded transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Desktop right section */}
          {!hydrated ? (
            <NavbarAuthSkeleton />
          ) : id ? (
            <div className="ml-auto hidden md:flex items-center gap-2">
              {/* Search */}
              <div className={`flex items-center gap-2 transition-all duration-200 ${searchOpen ? 'w-48' : 'w-10'}`}>
                {searchOpen && (
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                    onBlur={() => setSearchOpen(false)}
                    className="flex-1 bg-[#2d2e32] border border-[rgba(255,255,255,0.08)] rounded px-2.5 py-1 text-xs text-[#e4e6eb] placeholder:text-[#4a4b50] outline-none focus:border-[#4b8ef1]"
                    placeholder="Search..."
                  />
                )}
                <button
                  onClick={() => searchOpen ? handleSearch() : setSearchOpen(true)}
                  className="w-10 h-10 flex items-center justify-center cursor-pointer rounded hover:bg-[#2d2e32] text-white hover:text-[#e4e6eb] transition-colors shrink-0"
                >
                  <Search size={17} />
                </button>
              </div>

              <MessagesBell />
              <NotificationBell notifications={notifications} onRead={onRead} onReadAll={onReadAll} />
              <LogoutButton />

              <div className="flex items-center gap-2 pl-2 border-l border-[rgba(255,255,255,0.06)]">
                <Link href={`/u/${user_name}`} className="flex items-center group">
                  <Avatar name={user_name} src={avatar} size="md" />
                  <span className="text-sm font-medium text-[#e4e6eb] ml-2 hidden sm:block group-hover:text-[#4b8ef1] transition-colors">
                    {user_name}
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            // logged out desktop
            <div className="ml-auto hidden md:flex items-center gap-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#8a8d91] hover:text-[#e4e6eb] hover:bg-[#2d2e32] rounded transition-colors"
              >
                <Power size={15} />
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#4b8ef1] hover:bg-[#3d7de0] rounded transition-colors"
              >
                <UserPlus size={15} />
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile: right side */}
          <div className="ml-auto flex md:hidden items-center gap-2">
            {hydrated && id && (
              <>
                <MessagesBell />
                <NotificationBell notifications={notifications} onRead={onRead} onReadAll={onReadAll} />
              </>
            )}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#2d2e32] text-[#8a8d91] hover:text-[#e4e6eb] transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-[#1b1c1f] border-b border-[rgba(255,255,255,0.06)] shadow-2xl">
          <div className="px-4 py-4 flex flex-col gap-1">

            {/* Search */}
            <div className="flex items-center gap-2 bg-[#242528] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 mb-2">
              <Search size={15} className="text-[#4a4b50] shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                className="flex-1 bg-transparent text-sm text-[#e4e6eb] placeholder:text-[#4a4b50] outline-none"
                placeholder="Search..."
              />
            </div>

            {/* Nav links */}
            <a
              href="#"
              className="px-3 py-2.5 text-sm font-medium text-[#e4e6eb] hover:bg-[#2d2e32] rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {"WHAT'S NEW"}
            </a>

            <div className="h-px bg-[rgba(255,255,255,0.06)] my-2" />

            {hydrated && id ? (
              <>
                {/* Profile row */}
                <Link
                  href={`/u/${user_name}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#2d2e32] transition-colors"
                >
                  <Avatar name={user_name} src={avatar} size="md" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#e4e6eb]">{user_name}</span>
                    <span className="text-xs text-[#4a4b50]">View profile</span>
                  </div>
                </Link>

                <div className="h-px bg-[rgba(255,255,255,0.06)] my-2" />

                {/* Logout */}
                <div className="px-1">
                  <LogoutButton mobile />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-[#8a8d91] hover:text-[#e4e6eb] hover:bg-[#2d2e32] rounded-lg transition-colors"
                >
                  <Power size={16} />
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-white bg-[#4b8ef1] hover:bg-[#3d7de0] rounded-lg transition-colors"
                >
                  <UserPlus size={16} />
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}