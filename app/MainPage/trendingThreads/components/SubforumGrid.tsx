import Link from 'next/link';
import { Lock, ChevronRight } from 'lucide-react';
import Avatar from './Avatar';
import { formatNumber } from '@/app/lib/format';
import CategoryIcon from '@/app/Lucide';
import { useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SubforumGrid({ subforums, accentColor }: { subforums: any[]; accentColor?: string }) {
  if (!subforums.length) {
    return <p className="text-[#4a4b50] text-sm py-10 text-center">No subforums here yet.</p>;
  }
    
  
  return (
    <div className="bg-[#202125] rounded-lg border border-[rgba(255,255,255,0.06)] overflow-hidden">
      {subforums.map((sub) => {
        function isRecentlyUpdated(updatedAt?: string | Date): boolean {
        if (!updatedAt) return false;
        const updated = new Date(updatedAt).getTime();
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        return now - updated < oneDayMs;
        }
        
            
        return(
        <Link
          key={sub._id}
          href={{
         pathname: `/f/${sub._id}`,
         query: { page: 1 },
        }}
         className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-[#2a2b2f] transition-colors duration-150 group cursor-pointer border-b border-[rgba(255,255,255,0.04)] last:border-b-0"
        >
          <div className="w-0.5 h-10 font-semibold rounded-full shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: sub.accentColor ?? accentColor }} />
           <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  style={{ backgroundColor: accentColor + '18', color: accentColor }}
                >
                  <CategoryIcon name={sub.icon} size={16} />
                </div>
              {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 font-semibold">
          <span
            className="text-[#e4e6eb] font-semibold text-base group-hover:text-(--accent) transition-colors truncate"
            style={{ '--accent': accentColor } as React.CSSProperties}
          >
            {sub.name}
          </span>
          {sub.isReadOnly && (
            <span className="flex items-center gap-0.5 text-[10px] text-[#8a8d91] bg-[#1b1c1f] border border-[rgba(255,255,255,0.07)] px-1.5 py-0.5 rounded shrink-0">
              <Lock size={9} /> Read only
            </span>
          )}
          {isRecentlyUpdated(sub?.updatedAt) && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
              style={{ backgroundColor: accentColor + '22', color: accentColor }}
            >
              NEW
            </span>
          )}
        </div>
        <p className="text-[#8a8d91] text-xs font-semibold truncate">{sub.description}</p>
      </div>

          <div className="hidden sm:flex font-semibold items-center gap-6 shrink-0">
            <div className="text-center">
              <div className="text-[#e4e6eb] text-base font-semibold">{formatNumber(sub.threadCount)}</div>
              <div className="text-[#c5c9ce] text-[12px] uppercase tracking-wide">Threads</div>
            </div>
            {<div className="text-center">
              <div className="text-[#c5c9ce] text-base font-semibold">{formatNumber(sub.postCount)}</div>
              <div className="text-[#c5c9ce] text-[12px] uppercase tracking-wide">Posts</div>
            </div>}
          </div>

          {sub?.lastPost?.username&&<div className="hidden md:flex font-semibold  items-center gap-2.5 w-52 shrink-0">
            <Avatar name={sub?.lastPost?.username}  src={sub?.lastPost?.avatar} size='md'/>
            <div className="min-w-0">
              <p className="text-[#e4e6eb] text-sm truncate font-medium leading-tight">{sub?.lastPost?.threadTitle}</p>
              <p className="text-[#b6b8bb] text-[13px] mt-0.5">
                by <span className="text-[#8ba3e6]">{sub?.lastPost?.username}</span>
                <span className="mx-1">·</span>
                {sub?.lastPost?.timeAgo}
              </p>
            </div>
          </div>}

          <ChevronRight size={14} className="text-[#b8bac2] group-hover:text-[#8a8d91] shrink-0 transition-colors" />
        </Link>
        )})}
    </div>
  );
}