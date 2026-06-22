'use client';
import { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function NewRoleForm({ onAdd, onCancel }: {
  onAdd: (name: string, color: string, preset: string, priority: number) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#8b5cf6');
  const [preset, setPreset] = useState('member');
  const [priority, setPriority] = useState(1);

  return (
    <div className="bg-[#1e1f23] border border-[#4b8ef1]/30 rounded-lg p-4 space-y-3">
      <p className="text-xs font-bold text-[#e4e6eb] uppercase tracking-widest">New Role</p>

      <div>
        <label className="text-[11px] text-[#8a8d91] mb-1 block">Role name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Veteran, VIP..."
          className="w-full bg-[#1b1c1f] border border-[rgba(255,255,255,0.08)] rounded-md px-3 py-1.5 text-xs text-[#e4e6eb] placeholder:text-[#4a4b50] outline-none focus:border-[#4b8ef1] transition-colors"
        />
      </div>

     <div className="flex gap-3">
        <div>
          <label className="text-[11px] text-[#8a8d91] mb-1 block">Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={color} onChange={e => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
            <span className="text-xs text-[#8a8d91] font-mono">{color}</span>
          </div>
        </div>
        <div className="w-20">
          <label className="text-[11px] text-[#8a8d91] mb-1 block">Priority</label>
          <input
            type="number"
            value={priority}
            onChange={e => setPriority(Number(e.target.value))}
            className="w-full bg-[#1b1c1f] border border-[rgba(255,255,255,0.08)] rounded-md px-2 py-1.5 text-xs text-[#e4e6eb] outline-none focus:border-[#4b8ef1]"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] text-[#8a8d91] mb-1 block">Start from</label>
        <select
          value={preset}
          onChange={e => setPreset(e.target.value)}
          className="w-full bg-[#1b1c1f] border border-[rgba(255,255,255,0.08)] rounded-md px-2 py-1.5 text-xs text-[#e4e6eb] outline-none focus:border-[#4b8ef1]"
        >
          <option value="member">Member preset</option>
          <option value="seniorMember">Senior Member preset</option>
          <option value="moderator">Moderator preset</option>
          <option value="blank">Blank (no permissions)</option>
        </select>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => name.trim() && onAdd(name.trim(), color, preset, priority)}
          disabled={!name.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4b8ef1] hover:bg-[#3a7de0] disabled:opacity-40 text-white text-xs font-semibold rounded-md transition-colors"
        >
          <Check size={11} /> Create role
        </button>
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2d2e32] hover:bg-[#363739] text-[#8a8d91] text-xs font-medium rounded-md transition-colors">
          <X size={11} /> Cancel
        </button>
      </div>
    </div>
  );
}