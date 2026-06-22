'use client';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value, onChange, placeholder = 'Search...',
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4a4b50]" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1b1c1f] border border-[rgba(255,255,255,0.08)] rounded-md pl-8 pr-7 py-1.5 text-xs text-[#e4e6eb] placeholder:text-[#4a4b50] outline-none focus:border-[#4b8ef1] transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4a4b50] hover:text-[#8a8d91] transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}