// app/admin/announcements/components/AnnouncementForm.tsx
'use client';
import { useState } from 'react';
import { Check, Megaphone, AlertTriangle, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import type { Announcement, AnnouncementInput } from '@/app/services/announcement';

const TYPE_META: Record<Announcement['type'], { label: string; color: string; Icon: typeof Megaphone }> = {
  info:    { label: 'Info',    color: '#4b8ef1', Icon: Megaphone },
  warning: { label: 'Warning', color: '#f59e0b', Icon: AlertTriangle },
  success: { label: 'Success', color: '#10b981', Icon: CheckCircle2 },
  danger:  { label: 'Danger',  color: '#ef4444', Icon: AlertCircle },
};

export default function AnnouncementForm({
  mode, initial, onSubmit, onCancel,
}: {
  mode: 'create' | 'edit';
  initial?: Partial<Announcement>;
  onSubmit: (input: AnnouncementInput) => Promise<void>;
  onCancel?: () => void;
}) {
  const [message, setMessage] = useState(initial?.message ?? '');
  const [type, setType] = useState<Announcement['type']>(initial?.type ?? 'info');
  const [hasDuration, setHasDuration] = useState(!!initial?.expiresAt);
  const [durationHours, setDurationHours] = useState(24);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.trim()) { setError('Message is required.'); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        message: message.trim(),
        type,
        durationHours: hasDuration ? durationHours : undefined,
        expiresAt: hasDuration ? undefined : null,
      });
      if (mode === 'create') {
        setMessage('');
        setType('info');
        setHasDuration(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-[11px] text-[#8a8d91] mb-1 block">Message</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="e.g. Scheduled maintenance tonight at 10pm UTC — expect brief downtime."
          rows={3}
          maxLength={500}
          className="w-full bg-[#1b1c1f] border border-[rgba(255,255,255,0.08)] rounded-md px-2.5 py-2 text-xs text-[#e4e6eb] placeholder:text-[#4a4b50] outline-none focus:border-[#4b8ef1] transition-colors resize-none"
        />
        <p className="text-[10px] text-[#4a4b50] mt-1 text-right">{message.length}/500</p>
      </div>

      <div>
        <p className="text-[11px] text-[#8a8d91] mb-1.5">Type</p>
        <div className="grid grid-cols-4 gap-1.5">
          {(Object.keys(TYPE_META) as Announcement['type'][]).map(t => {
            const meta = TYPE_META[t];
            const selected = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-md border transition-colors"
                style={{
                  backgroundColor: selected ? meta.color + '15' : '#1b1c1f',
                  borderColor: selected ? meta.color + '60' : 'rgba(255,255,255,0.06)',
                  color: selected ? meta.color : '#8a8d91',
                }}
              >
                <meta.Icon size={13} />
                <span className="text-[10px] font-medium">{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-1.5 cursor-pointer mb-2">
          <button
            type="button"
            onClick={() => setHasDuration(v => !v)}
            className={`relative w-8 h-4 rounded-full transition-colors ${hasDuration ? 'bg-[#4b8ef1]' : 'bg-[#2d2e32]'}`}
          >
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${hasDuration ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-[11px] text-[#8a8d91]">Auto-expire</span>
        </label>

        {hasDuration ? (
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-[#4a4b50] shrink-0" />
            <input
              type="number"
              min={1}
              value={durationHours}
              onChange={e => setDurationHours(Math.max(1, Number(e.target.value) || 1))}
              className="w-20 bg-[#1b1c1f] border border-[rgba(255,255,255,0.08)] rounded-md px-2.5 py-1.5 text-xs text-[#e4e6eb] outline-none focus:border-[#4b8ef1] transition-colors"
            />
            <span className="text-[11px] text-[#8a8d91]">hours from now</span>
          </div>
        ) : (
          <p className="text-[10px] text-[#4a4b50]">Stays live until manually deactivated</p>
        )}
      </div>

      {error && <p className="text-[11px] text-[#ef4444]">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || submitting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4b8ef1] hover:bg-[#3a7de0] disabled:opacity-40 text-white text-xs font-semibold rounded-md transition-colors"
        >
          <Check size={11} /> {submitting ? 'Saving…' : mode === 'create' ? 'Post announcement' : 'Save changes'}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={submitting}
            className="text-[11px] text-[#8a8d91] hover:text-[#e4e6eb] px-2.5 py-1.5 bg-[#2d2e32] hover:bg-[#363739] rounded-md transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}