'use client';
import { AlertTriangle } from 'lucide-react';
import type { Warning } from '../lib/types';
import { formatDateTime } from '../lib/date';

export default function WarningsList({ warnings }: { warnings: Warning[] }) {
  if (warnings?.length === 0) {
    return <p className="text-[11px] text-[#4a4b50] px-1">No warnings on record.</p>;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {warnings?.map(w => (
        <div key={w._id} className="flex items-start gap-2.5 px-3 py-2 bg-[#1e1f23] border border-[rgba(255,255,255,0.06)] rounded-lg">
          <AlertTriangle size={12} className="text-[#f59e0b] shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs text-[#a8b3cf]">{w.reason}</p>
            <p className="text-[10px] text-[#4a4b50] mt-0.5">
              {w.issuedBy} · {formatDateTime(w.issuedAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}