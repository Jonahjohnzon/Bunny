'use client';
import { AlertTriangle, Ban, Clock, RotateCcw } from 'lucide-react';
import type { UserStatus } from '../lib/types';

export default function ModerationActions({
  status, onWarn, onSuspend, onBan, onRestore,
}: {
  status: UserStatus;
  onWarn: () => void;
  onSuspend: () => void;
  onBan: () => void;
  onRestore: () => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={onWarn}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2d2e32] hover:bg-[#363739] text-[#f59e0b] text-xs font-medium rounded-md transition-colors"
      >
        <AlertTriangle size={11} /> Warn
      </button>

      {status !== 'suspended' && status !== 'banned' && (
        <button
          onClick={onSuspend}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2d2e32] hover:bg-[#363739] text-[#f59e0b] text-xs font-medium rounded-md transition-colors"
        >
          <Clock size={11} /> Suspend
        </button>
      )}

      {status !== 'banned' && (
        <button
          onClick={onBan}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-[#ef4444] text-xs font-semibold rounded-md transition-colors"
        >
          <Ban size={11} /> Ban
        </button>
      )}

      {(status === 'banned' || status === 'suspended') && (
        <button
          onClick={onRestore}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#10b981]/15 hover:bg-[#10b981]/25 text-[#10b981] text-xs font-semibold rounded-md transition-colors"
        >
          <RotateCcw size={11} /> Restore access
        </button>
      )}
    </div>
  );
}