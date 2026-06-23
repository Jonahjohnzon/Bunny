"use client";
import { RichEditor } from '../threadcomponent/RichEditor'; // adjust this path to match where RichEditor actually lives
import { PostService } from '../../../services/posts';      // adjust this path to match your services folder
import { Post } from '../../types/forum';

interface ReplyBoxProps {
  threadId: string;
  parentPost?: string;        // omit for a top-level reply; set it for a Reddit-style reply attached to a post
  nextPostNumber?: number;    // kept for backward compatibility with the top-level call site; unused here
  onPostCreated: (post: Post) => void;
  onCancel?: () => void;
  compact?: boolean;          // tighter footer for inline nested replies
}

export default function ReplyBox({
  threadId,
  parentPost,
  onPostCreated,
  onCancel,
  compact,
}: ReplyBoxProps) {
  const handleSubmit = async (html: string) => {
    const response = await PostService.create(threadId, {
      content: html,
      parentPost,
    }) as { data: Post; success: boolean };
    if (response.success) onPostCreated(response.data);
  };

  return (
    <RichEditor
      placeholder={parentPost ? "Write a reply…" : "Write something…"}
      submitLabel={parentPost ? "Reply" : "Post Reply"}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      footerNote={compact ? undefined : `Replying`}
      height={'min-h-45'}
    />
  );
}