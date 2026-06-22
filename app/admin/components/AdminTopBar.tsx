'use client';
import Link from 'next/link';
import { Crown } from 'lucide-react';

export default function AdminTopBar({ crumb }: { crumb: string }) {
  return (
    <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#242528]">
      <div className="max-w-6xl mx-auto px-4 h-11 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#ef4444]/15 flex items-center justify-center">
            <Crown size={12} className="text-[#ef4444]" />
          </div>
          <span className="text-xs font-bold text-[#e4e6eb]">Admin</span>
          <span className="text-[#4a4b50]">/</span>
          <span className="text-xs text-[#8a8d91]">{crumb}</span>
        </div>
        <Link href="/" className="text-[11px] text-[#4a4b50] hover:text-[#8a8d91] transition-colors">
          ← Back to forum
        </Link>
      </div>
    </div>
  );
}