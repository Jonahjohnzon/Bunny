"use client";
import { useParams } from 'next/navigation';
import PostCard, { PostNode } from '../threadcomponent/PostCard';
import { Post } from '../../types/forum';

interface PostListProps {
  posts: Post[]
  isLocked?: boolean;
  threadId?:string;
  highlightPostId?: string;
}

type PostWithParent = Post & { parentPost?: string };

function buildTree(flat: PostWithParent[]): PostNode[] {
  const byId = new Map<string, PostNode>();
  flat.forEach((p) => byId.set(p._id, { ...p, children: [] }));

  const roots: PostNode[] = [];
  flat.forEach((p) => {
    const node = byId.get(p._id)!;
    if (p.parentPost && byId.has(p.parentPost)) {
      const parent = byId.get(p.parentPost)!;
      // Tag the node with who it's directly replying to, so PostCard can
      // render a "↑ replying to {name}" pill for replies-to-replies.
      node.replyingToId = parent._id;
      node.replyingToName = parent.author?.username;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

export default function PostList({ posts,  isLocked, highlightPostId }: PostListProps) {
  const { threadId } = useParams<{ threadId: string }>();
  const tree = buildTree(posts);
  return (
    <div className="flex flex-col gap-4">
      {tree.map((post, i) => (
        <PostCard
          key={post._id}
          post={post}
          threadId={threadId}
          isLocked={isLocked}
          postNumber={i + 1}
          highlightPostId={highlightPostId}
        />
      ))}
    </div>
  );
}