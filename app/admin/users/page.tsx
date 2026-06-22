// app/admin/users/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import AdminTopBar from '../components/AdminTopBar';
import AdminSidebar from '../components/AdminSidebar';
import SearchBar from '../components/SearchBar';
import FilterPills from '../components/FilterPills';
import UserListItem from '../components/UserListItem';
import UserDetailPanel from '../components/UserDetailPanel';
import EmptyPlaceholder from '../components/EmptyPlaceholder';

import { UserService } from '../../services/users';
import { RoleService } from '../../services/role';
import type { ForumUser, Role, UserStatus } from '../lib/types';

const STATUS_FILTERS: { id: UserStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'warned', label: 'Warned' },
  { id: 'suspended', label: 'Suspended' },
  { id: 'banned', label: 'Banned' },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<ForumUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [activeSection, setActiveSection] = useState('users');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The viewing admin's own role priority — drives both IP visibility and how much
  // of the panel (role dropdown, permission toggles) they're allowed to touch.
  // -1 = not loaded yet, keeps everything locked until we know the real value.
  const [myPriority, setMyPriority] = useState<number>(-1);
  const viewerCanViewIPs = myPriority > 0;

  // Load roles once.
  useEffect(() => {
    RoleService.list()
      .then(({ roles }) => setRoles(roles))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load roles'));
  }, []);

  // Load the viewer's own profile once, to get their role priority.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await UserService.getMyProfile() as {
          success?: boolean;
          data?: { role?: { _id?: string; name?: string; priority?: number } };
        };
        if (cancelled) return;
        if (!data?.success) return;
        setMyPriority(data.data?.role?.priority ?? -1);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      (async () => {
        try {
          setLoading(true);
          const { data } = await UserService.list({ query: query.trim() || undefined, status: statusFilter });
          const fetched = data.users;
          if (cancelled) return;
          setUsers(fetched);
          setSelectedId(prev => prev ?? fetched[0]?._id ?? null);
          setError(null);
          setLoading(false)
        } catch (err) {
          if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load roles');
        } 
      })();
    }, 300);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [query, statusFilter]);

  const selected = users.find(u => u._id === selectedId) ?? null;

  const handleNav = (section: string) => {
    if (section === 'roles') {
      router.push('/admin/roles');
      return;
    }
     else if (section === 'categories')
    {
      router.push('/admin/categories');
      return;
    }
     else if (section === 'badges')
    {
      router.push('/admin/badges');
      return;
    }
    else if(section === 'announcements'){
      router.push('/admin/announcements');
      return;
    }
    setActiveSection(section);
  };

  const handleUpdateUser = (id: string, patch: Partial<ForumUser>) => {
    setUsers(prev => prev.map(u => (u._id === id ? { ...u, ...patch } : u)));
  };
    if (loading) {
    return (
      <div className="min-h-screen bg-[#1b1c1f] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#4a4b50]" size={20} />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#1b1c1f]">
      <AdminTopBar crumb="Users" />

      <div className="max-w-6xl mx-auto px-4 py-5 flex gap-5">
        <AdminSidebar activeSection={activeSection} onNav={handleNav} />

        <div className="flex-1 min-w-0">
          {error && (
            <p className="text-xs text-[#ef4444] mb-3">{error}</p>
          )}

          {activeSection === 'users' && (
            <div className="flex gap-4">
              <div className="w-64 shrink-0 flex flex-col gap-2.5">
                <p className="text-[10px] font-bold text-[#4a4b50] uppercase tracking-widest">
                  Users <span className="text-[#4a4b50] font-normal">({users.length})</span>
                </p>

                <SearchBar value={query} onChange={setQuery} placeholder="Search by name, username, or email" />
                <FilterPills options={STATUS_FILTERS} value={statusFilter} onChange={setStatusFilter} />

                <div className="flex flex-col gap-1.5 mt-1">
                  {loading && (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 size={14} className="animate-spin text-[#4a4b50]" />
                    </div>
                  )}
                  {!loading && users.length === 0 && (
                    <p className="text-[11px] text-[#4a4b50] px-1 py-3 text-center">No users match your search.</p>
                  )}
                  {!loading && users.map(user => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      role={roles.find(r => r._id === user.role._id)}
                      isSelected={selectedId === user._id}
                      onSelect={() => setSelectedId(user._id)}
                    />
                  ))}
                </div>
              </div>

              {selected ? (
                <UserDetailPanel
                  user={selected}
                  roles={roles}
                  canViewIPs={viewerCanViewIPs}
                  myPriority={myPriority}
                  onUpdate={handleUpdateUser}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-[#4a4b50]">
                  {loading ? '' : 'Select a user to view details.'}
                </div>
              )}
            </div>
          )}

          {activeSection !== 'users' && <EmptyPlaceholder label={activeSection} />}
        </div>
      </div>
    </div>
  );
}