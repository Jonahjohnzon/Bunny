'use client';
import { useState, useEffect, useCallback } from 'react';
import { ProfileView } from './components/Pagination/ProfileView';
import { EditProfile } from './components/Pagination/EditProfile';
import { UserService } from '@/app/services/users';
import { UserProfile, RecentThread } from './types';
import { store } from '@/app/store';
import { useSnapshot } from 'valtio';
import { useRouter } from 'nextjs-toploader/app';

interface ProfilePageProps {
  params: { username: string };
}

export default function Body({ params }: ProfilePageProps) {
  const { username } = params;
  const router = useRouter()
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const [threads, setThreads] = useState<RecentThread[]>([]);
const [threadsPage, setThreadsPage] = useState(1);
const [threadsTotalPages, setThreadsTotalPages] = useState(1);
const [threadsLoading, setThreadsLoading] = useState(false);
const [totalCount, setTotalCount] = useState(0)
const snap = useSnapshot(store)
const id = snap._id


const loadProfile = useCallback(async () => {
  if(!id) {
    router.replace('/auth/login')
    return
  }
  setLoading(true);
  setError(null);
  try {
    const res = await UserService.getProfile(username);
    setProfile(res?.data?.profile);
    setLoading(false);
  } catch {
    setError('Could not load this profile.');
  } 
}, [username]);

const loadThreads = useCallback(async (page: number) => {
  setThreadsLoading(true);
  try {
    const res = await UserService.getThreads(username, page);
    setThreads(res.data.items);
    setThreadsTotalPages(res.data.pages);
    setThreadsPage(page);
    setTotalCount(res.data.total)
    setThreadsLoading(false);
  } catch(err) {
    console.log(err)
  }
}, [username]);

  useEffect(() => {
    loadProfile();
    loadThreads(1);
  }, [loadProfile, loadThreads]);

if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-page) flex items-center justify-center">
  <div className="flex flex-col items-center gap-3">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-2 border-(--border-soft)" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-(--accent) animate-spin" />
    </div>
  </div>
</div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-(--bg-page) flex items-center justify-center">
        <span className="text-sm text-(--text-muted)">{error ?? 'Profile not found.'}</span>
      </div>
    );
  }

  if (editing) {
    return (
      <EditProfile
        profile={profile}
        onCancel={() => setEditing(false)}
        onSaved={loadProfile}
      />
    );
  }

  return (
<ProfileView
  profile={profile}
  threads={threads}
  threadsPage={threadsPage}
  threadsTotalPages={threadsTotalPages}
  threadsLoading={threadsLoading}
  onThreadsPageChange={loadThreads}
  onEdit={() => setEditing(true)}
  total={totalCount}
/>
  );
}