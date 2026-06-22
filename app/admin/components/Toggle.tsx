'use client';

export default function Toggle({ value, onChange, disabled = false }: {
  value: boolean; onChange: (v: boolean) => void; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative w-8 h-4 rounded-full transition-colors shrink-0
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${value ? 'bg-[#4b8ef1]' : 'bg-[#2d2e32]'}`}
    >
      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform
        ${value ? 'translate-x-4' : 'translate-x-0.5'}`}
      />
    </button>
  );
}