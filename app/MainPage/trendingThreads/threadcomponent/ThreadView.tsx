"use client";
import { useState } from 'react';
import { Lock } from 'lucide-react';
import PostList from './PostList';
import ReplyBox from './ReplyBox';
import { Post, Thread } from '../../types/forum';

interface ThreadViewProps {
  thread: Thread;
  initialPosts: Post[];
  highlightPostId?: string;
}

export default function ThreadView({ thread, initialPosts, highlightPostId }: ThreadViewProps) {
  const [posts, setPosts] = useState(initialPosts);
  
  function handlePostCreated(post: Post) {
    setPosts(prev => [...prev, post]);
  }

  return (
    <div className="flex flex-col gap-4">
      <PostList
        threadId={thread?._id}
        posts={posts}
        isLocked={thread?.isLocked}
        highlightPostId={highlightPostId}
      />

      {thread?.isLocked ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#242528] px-4 py-4 text-[#c2c6cc] text-base">
          <Lock size={13} />
          This thread is locked. No replies can be posted.
        </div>
      ) : (
        <ReplyBox
          threadId={thread?._id || ""}
          nextPostNumber={posts.length + 1}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
}