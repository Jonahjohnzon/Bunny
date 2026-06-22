'use client';
import { useState, useEffect } from 'react';
import StatsBar from './StatsBar';
import OnlineUsers from './OnlineUsers';
import TrendingPanel from './TrendingPanel';
import { ForumService } from '@/app/services/forum';
import { ForumStats } from '../../types/forum';

interface TrendingThread {
  _id: string;
  title: string;
  subforum: string;
}

export default function ForumSidebar() {
  const [stats, setStats] = useState<ForumStats | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<{ users: string[]; total: number }>({ users: [], total: 0 });
  const [trendingThreads, setTrendingThreads] = useState<TrendingThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ForumService.getStats()
      .then(res => {
        const data = res?.data; // adjust to `res` if your ApiCore doesn't wrap in `.data`
        setStats(data.stats);
        setOnlineUsers(data.onlineUsers);
        setTrendingThreads(data.trendingThreads);
      })
      .catch(err => console?.log('Failed to load forum stats', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <aside className="w-56 shrink-0 sticky top-16 self-start hidden lg:flex flex-col gap-4">
      {loading || !stats ? (
        <SidebarSkeleton />
      ) : (
        <>
         <OnlineUsers users={onlineUsers?.users} total={onlineUsers?.total} />
          <StatsBar stats={stats} />
          <TrendingPanel threads={trendingThreads} />
        </>
      )}
    </aside>
  );
}

function SidebarSkeleton() {
  return (
    <>
      {[0, 1, 2].map(i => (
        <div key={i} className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#242528] p-4 h-28 animate-pulse" />
      ))}
    </>
  );
}