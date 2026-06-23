import Link from 'next/link';
import { ChevronRight, Pin, Lock, Eye, MessageSquare } from 'lucide-react';
import { prefixStyles, formatNumber } from '../../Interfaces/lib/utils';
import { Thread } from '../../types/forum';

interface ThreadViewHeaderProps {
  thread: Thread;
}

export default function ThreadViewHeader({ thread }: ThreadViewHeaderProps) {
  const prefix = thread?.prefix ? prefixStyles[thread?.prefix] : null;
  return (
    <div className="mb-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 font-semibold text-sm text-[#b3b7be] mb-2 flex-wrap">
        <Link href="/" className="hover:text-[#e4e6eb] transition-colors">Home</Link>
        <ChevronRight size={14} className="text-[#4a4b50]" />
        <Link href={`/f/${thread.subforum?._id}`} className="hover:text-[#e4e6eb] transition-colors">{thread.subforum?.name}</Link>
        <ChevronRight size={14} className="text-[#4a4b50]" />
        <span className="text-[#9a9da3] truncate max-w-xs">{thread?.title}</span>
      </div>

      <div className="border-b border-[rgba(255,255,255,0.07)] pb-5">
        {/* Badge row — prefix + status */}
        {(prefix || thread?.isPinned || thread?.isLocked) && (
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {prefix && (
              <span
                className="text-[11px] font-medium px-2.5 py-1 rounded-md"
                style={{ backgroundColor: prefix?.bg, color: prefix?.color }}
              >
                {prefix?.label}
              </span>
            )}
            {thread?.isPinned && (
              <span className="flex items-center gap-1 text-[13px] font-medium px-2 py-1 rounded-md bg-[#f59e0b]/12 text-[#fac775]">
                <Pin size={13} /> Pinned
              </span>
            )}
            {thread?.isLocked && (
              <span className="flex items-center gap-1 text-[13px] font-medium px-2 py-1 rounded-md bg-[rgba(255,255,255,0.06)] text-[#9a9da3]">
                <Lock size={13} /> Locked
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h1 className="text-xl font-semibold text-[#e4e6eb] leading-snug mb-2">
          {thread?.title}
        </h1>

        {/* Meta row */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <span className="flex items-center gap-1.5 text-sm text-[#c1c3c6]">
            <MessageSquare size={14} /> {formatNumber(thread?.replyCount)} replies
          </span>
          <span className="flex items-center gap-1.5 text-sm text-[#b9bcc0]">
            <Eye size={14} /> {formatNumber(thread?.views)} views
          </span>

          {thread?.tags?.length > 0 && (
            <>
              <div className="w-px h-3 bg-[rgba(255,255,255,0.1)]" />
              <div className="flex items-center gap-1.5 flex-wrap">
                {thread.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[12px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.05)] text-[#e6e7e7]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}