interface OnlineUsersProps {
  users?: string[];
  total?: number;
}

export default function OnlineUsers({ users = [], total = 0 }: OnlineUsersProps) {
  const remaining = Math.max(total - users.length, 0);

  return (
    <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#242528] p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
        <span className="text-[13px] uppercase tracking-widest font-bold text-[#a7a9b3]">Staff Online</span>
        <span className="ml-auto text-[11px] bg-[#10b981]/10 text-[#10b981] px-1.5 py-0.5 rounded font-bold">{total}</span>
      </div>
      {users?.length === 0 ? (
        <p className="text-[13px] font-semibold text-[#9a9ca5]">No Staff online</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {users?.map(u => (
            <a key={u} href={`/u/${u}`} className="text-[12px] font-semibold text-[#a8b3cf] hover:text-[#4b8ef1] transition-colors bg-[#1b1c1f] px-2 py-1 rounded">
              {u}
            </a>
          ))}
          {remaining > 0 && <span className="text-[11px] text-[#4a4b50] px-2 py-1">+{remaining} more</span>}
        </div>
      )}
    </div>
  );
}