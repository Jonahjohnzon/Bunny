import { Flame } from 'lucide-react';

interface TrendingThread {
  _id: string;
  title: string;
  subforum?: string;
}

interface TrendingPanelProps {
  threads: TrendingThread[];
}

export default function TrendingPanel({ threads }: TrendingPanelProps) {
  return (
    <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#242528] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Flame size={13} className="text-[#f59e0b]" />
        <span className="text-[13px] uppercase tracking-widest font-bold text-[#878a95]">Trending</span>
      </div>
      <div className="flex flex-col gap-2">
        {threads?.length === 0 ? (
          <p className="text-[12px] text-[#000000]">Nothing trending in the last 48 hours.</p>
        ) : (
          threads?.map((t, i) => (
            <a key={t._id} href={`/f/${t.subforum}/${t._id}`} className="text-[14px] text-[#b2b5b9] hover:text-[#e4e6eb] transition-colors leading-snug flex gap-2">
              <span className="text-[#4b8ef1] font-bold shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="line-clamp-2 font-semibold">{t.title}</span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}