import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function getPageRange(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const delta = 1; // pages shown on each side of current
  const range: (number | 'ellipsis')[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== 'ellipsis') {
      range.push('ellipsis');
    }
  }

  return range;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const pageRange = getPageRange(currentPage, totalPages);

  const pageHref = (p: number) => `${basePath}?page=${p}`;

  return (
    <div className="flex items-center my-4 justify-center gap-1 flex-wrap mt-4">
      <Link
        href={pageHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage <= 1}
        className={`flex items-center justify-center w-8 h-8 rounded-md text-xs border border-[#2a2b2f] transition-colors
          ${currentPage <= 1 ? 'text-[#4a4b50] pointer-events-none' : 'text-[#8a8d91] hover:bg-[#2a2b2f] hover:text-[#e4e6eb]'}`}
      >
        <ChevronLeft size={14} />
      </Link>

      {pageRange.map((p, idx) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex items-center justify-center min-w-8 h-8 text-xs text-[#5a5b60]"
          >
            …
          </span>
        ) : p === currentPage ? (
          <span
            key={p}
            className="flex items-center justify-center min-w-8 h-8 px-1 rounded-md text-xs font-medium bg-[#1a2a3a] text-[#4b8ef1]"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(p)}
            className="flex items-center justify-center min-w-8 h-8 px-1 rounded-md text-xs border border-[#2a2b2f] text-[#8a8d91] hover:bg-[#2a2b2f] hover:text-[#e4e6eb] transition-colors"
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={pageHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage >= totalPages}
        className={`flex items-center justify-center w-8 h-8 rounded-md text-xs border border-[#2a2b2f] transition-colors
          ${currentPage >= totalPages ? 'text-[#4a4b50] pointer-events-none' : 'text-[#8a8d91] hover:bg-[#2a2b2f] hover:text-[#e4e6eb]'}`}
      >
        <ChevronRight size={14} />
      </Link>
    </div>
  );
}