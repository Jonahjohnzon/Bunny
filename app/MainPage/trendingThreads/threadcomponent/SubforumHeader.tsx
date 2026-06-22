import Link from 'next/link';
import { ChevronRight, MessageSquare } from 'lucide-react';
import { SubforumMeta } from '../../types/forum';

interface SubforumHeaderProps {
  subforum: SubforumMeta;
  type:string;
  length:boolean
}

export default function SubforumHeader({ subforum, type,length }: SubforumHeaderProps) {
  console.log(subforum)
  return (
    <div className="mb-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] text-[#b3b6b9] mb-3">
        <Link href="/" className="hover:text-[#e4e6eb] transition-colors">Forum Index</Link>
        <ChevronRight size={13} className="text-[#4a4b50]" />
        <span className="text-[#a8b3cf]">{subforum.name}</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-[#e4e6eb] leading-none" style={{ color: subforum.accentColor }}>
            {subforum.name}
          </h1>
          <p className="text-[#8a8d91] text-sm mt-1">{subforum.description}</p>
        </div>
        {(type === 'threads' || length) &&<Link
            href={{
          pathname: `/f/${subforum._id}/new`,
          query: {
            subforumId: subforum._id,
            categoryId: subforum.category,
            subforumName: subforum.name,
    },
  }}

          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#4b8ef1] hover:bg-[#3a7de0] text-white text-base font-semibold rounded-md transition-colors shrink-0"
        >
          <MessageSquare size={13} />
          New Thread
        </Link>}
      </div>
    </div>
  );
}