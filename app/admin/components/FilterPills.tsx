'use client';

export default function FilterPills<T extends string>({
  options, value, onChange,
}: {
  options: { id: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {options.map(opt => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors capitalize
            ${value === opt.id
              ? 'bg-[#4b8ef1]/20 text-[#4b8ef1]'
              : 'bg-[#2d2e32] text-[#8a8d91] hover:bg-[#363739]'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}