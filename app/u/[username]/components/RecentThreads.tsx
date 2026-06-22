'use client';
import { ChevronRight, MessageSquare, Eye } from 'lucide-react';
import { Pagination } from './ui';
import { RecentThread } from '../types/index';

interface RecentThreadsProps {
  threads: RecentThread[];
  page: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export function RecentThreads({ threads, page, totalPages, loading, onPageChange }: RecentThreadsProps) {
  if (!loading && threads.length === 0) {
    return (
      <div className="text-center py-10 text-lg text-[#bfc1cc]">
        No threads started yet.
      </div>
    );
  }

  return (
    <div>
      <div className={`flex flex-col gap-3 transition-opacity ${loading ? 'opacity-50' : ''}`}>
        {threads.map(thread => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

function ThreadCard({ thread }: { thread: RecentThread }) {
  return (
    <div className="bg-[#242528] rounded-lg border border-[rgba(255,255,255,0.06)] p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors group cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[12px] font-semibold text-[#aeafb4] bg-[#1b1c1f] px-1.5 py-0.5 rounded">
              {thread.subforum}
            </span>
            <span className='text-base'>{thread.threadTitle}</span>
          
          </div>
          <p className="text-sm text-[#d0d3d8] leading-relaxed line-clamp-2">{thread.excerpt}</p>
        </div>
        <ChevronRight
          size={14}
          className="text-[#e5e6ec] group-hover:text-[#8a8d91] shrink-0 mt-1 transition-colors"
        />
      </div>
      <div className="flex items-center font-medium gap-4 mt-3 pt-3 border-t border-[rgba(255,255,255,0.04)]">
        <span className="flex items-center gap-1 text-[13px] text-[#d4d5da]">
          <MessageSquare size={10} /> {thread.replyCount} replies
        </span>
        <span className="flex items-center gap-1 text-[13px] text-[#d4d5da]">
          <Eye size={10} /> {thread.views} views
        </span>
      </div>
    </div>
  )
}