'use client';
import { Hash, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { ApiCategory } from '@/app/services/category-service';

export default function CategoryRow({
  category, isEditing, onEdit, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown,
}: {
  category: ApiCategory;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const subforumCount = Array.isArray(category.subforums) ? category.subforums.length : 0;

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors
      ${isEditing ? 'bg-[#1e2535] border-[#4b8ef1]/40' : 'bg-[#1e1f23] border-transparent hover:border-[rgba(255,255,255,0.06)]'}`}>
      <div className="flex flex-col shrink-0">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="text-[#4a4b50] hover:text-[#8a8d91] disabled:opacity-30 disabled:hover:text-[#4a4b50] transition-colors"
        >
          <ChevronUp size={12} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="text-[#4a4b50] hover:text-[#8a8d91] disabled:opacity-30 disabled:hover:text-[#4a4b50] transition-colors"
        >
          <ChevronDown size={12} />
        </button>
      </div>

      <div className="w-7 h-7 rounded-md bg-[#4b8ef1]/15 text-[#4b8ef1] flex items-center justify-center shrink-0">
        <Hash size={13} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#e4e6eb] truncate">{category.name}</p>
        <p className="text-[10px] text-[#4a4b50] mt-0.5 truncate">
          {category.description || 'No description'} · {subforumCount} subforum{subforumCount === 1 ? '' : 's'}
        </p>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="w-6 h-6 flex items-center justify-center rounded text-[#4a4b50] hover:text-[#4b8ef1] hover:bg-[#4b8ef1]/10 transition-colors shrink-0"
      >
        <Pencil size={11} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="w-6 h-6 flex items-center justify-center rounded text-[#4a4b50] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors shrink-0"
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
}