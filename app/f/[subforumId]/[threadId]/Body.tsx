"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../MainPage/trendingThreads/components/Navbar';
import ThreadViewHeader from '../../../MainPage/trendingThreads/threadcomponent/ThreadViewHeader';
import ThreadView from '../../../MainPage/trendingThreads/threadcomponent/ThreadView';
import ForumSidebar from '../../../MainPage/trendingThreads/components/ForumSidebar';
import { ThreadService } from "@/app/services/threads";
import { PostService } from "@/app/services/posts";
import { forumUsers } from '../../../MainPage/Interfaces/lib/mock-posts';
import { stats, onlineUsers, trendingThreads } from '../../../MainPage/Interfaces/lib/mock-data';
import { Thread, Post } from '../../../MainPage/types/forum';
import Pagination from '@/app/MainPage/trendingThreads/components/Pagination';
import AnnouncementBoard from '@/app/MainPage/trendingThreads/components/AnnouncementBoard';

interface ThreadPageProps {
  params_cc: { subforumId: string; threadId: string };
}

function ThreadHeaderSkeleton() {
  return (
    <div className="mb-5">
      <div className="h-5 w-2/3 rounded bg-[#2d2e32] animate-pulse mb-2" />
      <div className="h-3 w-40 rounded bg-[#2d2e32] animate-pulse" />
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-4 border-b border-[rgba(255,255,255,0.06)] last:border-b-0">
      {/* author column */}
      <div className="w-20 shrink-0 flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-[#2d2e32] animate-pulse" />
        <div className="h-2.5 w-14 rounded bg-[#2d2e32] animate-pulse" />
      </div>

      {/* content column */}
      <div className="flex-1 min-w-0 flex flex-col gap-2.5">
        <div className="h-2.5 w-24 rounded bg-[#2d2e32] animate-pulse" />
        <div className="h-3 w-full rounded bg-[#2d2e32] animate-pulse" />
        <div className="h-3 w-11/12 rounded bg-[#2d2e32] animate-pulse" />
        <div className="h-3 w-3/5 rounded bg-[#2d2e32] animate-pulse" />
      </div>
    </div>
  );
}

function ThreadViewSkeleton() {
  return (
    <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#242528] overflow-hidden">
      {[0, 1, 2, 3].map(i => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}

export function Body({ params_cc }: ThreadPageProps) {
  const [thread, setThread]   = useState<Thread | null>(null);
  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [highlightMissing, setHighlightMissing] = useState(false);

  // pagination state
  const [pageSize, setPageSize] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const threadId = params_cc.threadId;
  const subforumId = params_cc.subforumId;
  const searchParams = useSearchParams();
  const highlightPostId = searchParams.get('post') ?? undefined;
  const highlightPage = searchParams.get('page') ?? undefined;
  const currentUser = forumUsers.jonah_dev;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!threadId) {
        setError("Thread not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      let targetPage = highlightPage;

      if (highlightPostId) {
        try {
          const locateRes = await PostService.locate(threadId, highlightPostId) as {
            success: boolean;
            data?: { page: number };
          };
          if (locateRes?.success && locateRes?.data?.page) {
            targetPage = String(locateRes.data.page);
          }
        } catch {
          // fall back to page 1
        }
      }

      const [threadRes, postsRes] = await Promise.all([
        ThreadService.get(threadId),
        PostService.list(threadId, targetPage),
      ]);

      if (cancelled) return;

      if (!threadRes?.success) {
        setError("Thread not found.");
        setLoading(false);
        return;
      }

      setThread(threadRes?.data?.thread);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (postsRes as any)?.success ? (postsRes as any).data : null;
      const postsList = data?.posts ?? [];
      setPosts(postsList);
      setPageSize(data?.pageSize ?? 0);
      setTotalPosts(data?.total ?? 0);
      setCurrentPage(data?.page ?? Number(targetPage) ?? 1);

      if (highlightPostId && !postsList.some((p: Post) => p._id === highlightPostId)) {
        setHighlightMissing(true);
      }

      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [threadId, highlightPostId, highlightPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1b1c1f] text-[#e4e6eb]">
        <Navbar />
        <main className="max-w-8xl mx-auto px-4 py-6">
          <ThreadHeaderSkeleton />
          <div className="flex gap-5">
            <div className="flex-1 min-w-0">
              <ThreadViewSkeleton />
            </div>
            <ForumSidebar stats={stats} onlineUsers={onlineUsers} trendingThreads={trendingThreads} />
          </div>
        </main>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="min-h-screen bg-[#1b1c1f] flex items-center justify-center text-[#ff6b6b] text-sm">
        {error || "Thread not found."}
      </div>
    );
  }

  const totalPages = pageSize > 0 ? Math.ceil(totalPosts / pageSize) : 1;

  return (
    <div className="min-h-screen bg-[#1b1c1f] text-[#e4e6eb]">
      <Navbar />

      <main className="max-w-8xl mx-auto px-4 py-6">
        <ThreadViewHeader thread={thread} />

        {highlightMissing && (
          <div className="mb-4 px-4 py-3 bg-[#1a2a3a] border border-[#4b8ef1]/20 rounded-lg text-base text-[#c4c5c7]">
            The linked post isn&apos;t on this page — it may be further back in the thread.
          </div>
        )}

        <div className="flex gap-5">
          <div className="flex-1 min-w-0">
          <AnnouncementBoard/>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={`/f/${subforumId}/${threadId}`}
              />
            )}
            <ThreadView thread={thread} initialPosts={posts} currentUser={currentUser} highlightPostId={highlightPostId} />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={`/f/${subforumId}/${threadId}`}
              />
            )}
          </div>

          <ForumSidebar stats={stats} onlineUsers={onlineUsers} trendingThreads={trendingThreads} />
        </div>
      </main>
    </div>
  );
}