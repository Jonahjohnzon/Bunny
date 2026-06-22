'use client';
import { Lock } from 'lucide-react';

interface FieldProps {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  /** Read-only fields show a lock icon and muted styling, and cannot be typed into */
  readOnly?: boolean;
  multiline?: boolean;
  placeholder?: string;
}

export default function Field({ label, value, onChange, readOnly = false, multiline = false, placeholder }: FieldProps) {
  const baseClasses = `w-full bg-[#1b1c1f] border rounded-md px-3 py-1.5 text-xs outline-none transition-colors
    ${readOnly
      ? 'border-transparent text-[#6b6d72] cursor-not-allowed'
      : 'border-[rgba(255,255,255,0.08)] text-[#e4e6eb] placeholder:text-[#4a4b50] focus:border-[#4b8ef1]'
    }`;

  return (
    <div>
      <label className="text-[11px] text-[#8a8d91] mb-1 flex items-center gap-1.5">
        {label}
        {readOnly && <Lock size={9} className="text-[#4a4b50]" />}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange?.(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          rows={2}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange?.(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}