'use client';
import { useState } from 'react';
import { ChevronRight, MessageSquare } from 'lucide-react';
import { Pagination } from '../ui';
import { RecentPost } from '../../types';

const POSTS_PER_PAGE = 10;

interface RecentPostsProps {
  posts: RecentPost[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginated = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <div>
      <div className="flex flex-col gap-3">
        {paginated.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

function PostCard({ post }: { post: RecentPost }) {
  return (
    <div className="bg-[#242528] rounded-lg border border-[rgba(255,255,255,0.06)] p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors group cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] text-[#4a4b50] bg-[#1b1c1f] px-1.5 py-0.5 rounded">
              {post.subforum}
            </span>
            <span className="text-[10px] text-[#4a4b50]">{post.timeAgo}</span>
          </div>
          <a
            href="#"
            className="text-sm font-semibold text-[#e4e6eb] group-hover:text-[#4b8ef1] transition-colors leading-snug block mb-1.5"
          >
            {post.threadTitle}
          </a>
          <p className="text-xs text-[#8a8d91] leading-relaxed line-clamp-2">{post.excerpt}</p>
        </div>
        <ChevronRight
          size={14}
          className="text-[#4a4b50] group-hover:text-[#8a8d91] shrink-0 mt-1 transition-colors"
        />
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[rgba(255,255,255,0.04)]">
        <span className="flex items-center gap-1 text-[11px] text-[#4a4b50]">
          <MessageSquare size={10} /> {post.replyCount} replies
        </span>
      </div>
    </div>
  );
}