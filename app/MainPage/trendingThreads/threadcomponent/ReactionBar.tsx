"use client";
import { useState } from 'react';
import { ReactionCount, ReactionType } from '../../types/forum';

const reactionEmoji: Record<ReactionType, string> = {
  like: '👍', love: '❤️', haha: '😂', wow: '😮', sad: '😢', angry: '😠',
};

interface ReactionBarProps {
  reactions: ReactionCount;
}

export default function ReactionBar({ reactions }: ReactionBarProps) {
  const [liked, setLiked] = useState(false);
  const [counts, setCounts] = useState(reactions);

  const active = (Object.entries(counts) as [ReactionType, number][]).filter(([, count]) => count > 0);
  const total = active.reduce((sum, [, count]) => sum + count, 0);

  function toggleLike() {
    setCounts(prev => ({ ...prev, like: prev.like + (liked ? -1 : 1) }));
    setLiked(l => !l);
  }

  if (total === 0 && !liked) {
    return (
      <button
        onClick={toggleLike}
        className="text-[11px] text-[#8a8d91] hover:text-[#4b8ef1] transition-colors font-medium"
      >
        👍 Like
      </button>
    );
  }

  return (
    <button
      onClick={toggleLike}
      className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full transition-colors ${
        liked ? 'bg-[#4b8ef1]/15 text-[#4b8ef1]' : 'bg-[#1b1c1f] text-[#8a8d91] hover:text-[#e4e6eb]'
      }`}
    >
      <span className="flex -space-x-1">
        {active.slice(0, 3).map(([type]) => (
          <span key={type}>{reactionEmoji[type]}</span>
        ))}
      </span>
      {total}
    </button>
  );
}