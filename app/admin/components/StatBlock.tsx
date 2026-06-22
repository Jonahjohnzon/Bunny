export default function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#1e1f23] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2.5">
      <p className="text-[15px] font-bold text-[#e4e6eb] leading-tight">{value}</p>
      <p className="text-[10px] text-[#4a4b50] mt-0.5">{label}</p>
    </div>
  );
}