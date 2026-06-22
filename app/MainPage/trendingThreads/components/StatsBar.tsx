import { TrendingUp, BookOpen, MessageSquare, Users } from 'lucide-react';
import { formatNumber } from '../../Interfaces/lib/utils';
import { ForumStats } from '../../types/forum';

interface StatsBarProps {
  stats: ForumStats;
}

export default function StatsBar({ stats }: StatsBarProps) {
const items = [
  { label: 'Threads', value: formatNumber(stats.totalThreads), icon: <BookOpen size={12} /> },
  { label: 'Posts',   value: formatNumber(stats.totalPosts),   icon: <MessageSquare size={12} /> },
  { label: 'Members', value: formatNumber(stats.totalMembers), icon: <Users size={12} /> },
];

  return (
    <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#242528] p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={13} className="text-[#4b8ef1]" />
        <span className="text-[13px] uppercase tracking-widest font-bold text-[#b7b8c2]">Forum Statistics</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(stat => (
          <div key={stat?.label} className="bg-[#1b1c1f] rounded-md px-3 py-2.5 flex items-center gap-2.5">
            <div className="text-[#4b8ef1]">{stat?.icon}</div>
            <div>
              <div className="text-[#e4e6eb] font-bold text-base leading-none">{stat?.value}</div>
              <div className="text-[#94969f] font-semibold text-[12px] mt-0.5">{stat?.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
        <p className="text-[#a8a9b1] text-[13px]">
          Newest member: <a href={`/u/${stats?.newestMember}`} className="text-[#4b8ef1] text-sm font-semibold hover:underline">{stats?.newestMember}</a>
        </p>
      </div>
    </div>
  );
}