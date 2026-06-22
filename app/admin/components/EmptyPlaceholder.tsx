'use client';
import { Settings } from 'lucide-react';

export default function EmptyPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-[#242528] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-3">
        <Settings size={18} className="text-[#4a4b50]" />
      </div>
      <p className="text-sm font-semibold text-[#8a8d91] capitalize">{label}</p>
      <p className="text-xs text-[#4a4b50] mt-1">This section is coming soon.</p>
    </div>
  );
}