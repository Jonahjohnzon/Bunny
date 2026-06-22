'use client';
import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { CategoryInput } from '@/app/services/category-service';

const ACCENT_COLORS = [
  '#4b8ef1', // blue (default app accent)
  '#1d9e75', // teal
  '#d85a30', // coral
  '#d4537e', // pink
  '#a35dd0', // purple
  '#639922', // green
  '#ba7517', // amber
  '#e24b4a', // red
];

export default function CategoryForm({
  initial, submitLabel, onSubmit, onCancel,
}: {
  initial?: CategoryInput;
  submitLabel: string;
  onSubmit: (input: CategoryInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [icon, setIcon] = useState(initial?.icon ?? '');
  const [accentColor, setAccentColor] = useState(initial?.accentColor ?? ACCENT_COLORS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        icon: icon.trim() || null,
        accentColor,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1e1f23] border border-[#4b8ef1]/30 rounded-lg p-4 space-y-3">
      <div>
        <label className="text-[11px] text-[#8a8d91] mb-1 block">Category name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. General Discussion"
          className="w-full bg-[#1b1c1f] border border-[rgba(255,255,255,0.08)] rounded-md px-3 py-1.5 text-xs text-[#e4e6eb] placeholder:text-[#4a4b50] outline-none focus:border-[#4b8ef1] transition-colors"
        />
      </div>

      <div>
        <label className="text-[11px] text-[#8a8d91] mb-1 block">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Optional short description shown under the category name"
          rows={2}
          className="w-full bg-[#1b1c1f] border border-[rgba(255,255,255,0.08)] rounded-md px-3 py-1.5 text-xs text-[#e4e6eb] placeholder:text-[#4a4b50] outline-none focus:border-[#4b8ef1] transition-colors resize-none"
        />
      </div>

      <div>
        <label className="text-[11px] text-[#8a8d91] mb-1 block">Icon (lucide icon name, optional)</label>
        <input
          value={icon}
          onChange={e => setIcon(e.target.value)}
          placeholder="e.g. MessageSquare"
          className="w-full bg-[#1b1c1f] border border-[rgba(255,255,255,0.08)] rounded-md px-3 py-1.5 text-xs text-[#e4e6eb] placeholder:text-[#4a4b50] outline-none focus:border-[#4b8ef1] transition-colors"
        />
      </div>

      <div>
        <label className="text-[11px] text-[#8a8d91] mb-1.5 block">Accent color</label>
        <div className="flex items-center gap-2 flex-wrap">
          {ACCENT_COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setAccentColor(color)}
              aria-label={`Select color ${color}`}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{
                backgroundColor: color,
                outline: accentColor === color ? `2px solid ${color}` : 'none',
                outlineOffset: '2px',
              }}
            >
              {accentColor === color && <Check size={11} className="text-white" strokeWidth={3} />}
            </button>
          ))}

          {/* custom color fallback */}
          <label className="relative w-6 h-6 rounded-full overflow-hidden border border-dashed border-[rgba(255,255,255,0.2)] cursor-pointer flex items-center justify-center">
            <input
              type="color"
              value={accentColor}
              onChange={e => setAccentColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span
              className="w-full h-full block"
              style={{ backgroundColor: ACCENT_COLORS.includes(accentColor) ? 'transparent' : accentColor }}
            />
          </label>
        </div>
      </div>

      {error && <p className="text-[11px] text-[#ef4444]">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!name.trim() || submitting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4b8ef1] hover:bg-[#3a7de0] disabled:opacity-40 text-white text-xs font-semibold rounded-md transition-colors"
        >
          <Check size={11} /> {submitting ? 'Saving…' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2d2e32] hover:bg-[#363739] text-[#8a8d91] text-xs font-medium rounded-md transition-colors disabled:opacity-40"
        >
          <X size={11} /> Cancel
        </button>
      </div>
    </div>
  );
}