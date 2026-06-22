import { MapPin, Globe, Bird, GitFork, Clock } from 'lucide-react';
import { UserProfile } from '../../types';
import { formatTimeAgo } from '@/app/n/component/utils';
interface AboutTabProps {
  profile: UserProfile;
}


export function AboutTab({ profile }: AboutTabProps) {
  const details = [
    { icon: <Globe size={12} />, label: 'Website',  value: profile?.socials?.website, link: true },
    { icon: <MapPin size={12} />,  label: 'Social',   value: profile?.socials?.link,     link: true  },
    { icon: <Clock size={12} />,   label: 'Last seen',value: `${formatTimeAgo(profile?.lastSeenAt)} ago`,         link: false },
  ].filter(d => d.value && d.value !== '@');

  return (
    <div className="space-y-4">
      {profile.bio && (
        <div className="bg-[#242528] rounded-lg border border-[rgba(255,255,255,0.06)] p-4">
          <h3 className="text-[13px] uppercase tracking-widest font-bold text-[#c3c4ca] mb-2">About</h3>
          <p className="text-sm italic text-[#d1d4da] leading-relaxed">{profile?.bio}</p>
        </div>
      )}

      <div className="bg-[#242528] rounded-lg border border-[rgba(255,255,255,0.06)] p-4 space-y-3">
        <h3 className="text-[13px] uppercase tracking-widest font-bold text-[#c3c4ca] mb-3">Details</h3>
        {details.map((detail, i) => (
          <div key={i} className="flex items-center font-medium gap-3">
            <div className="text-[#c3c4ca] flex-shrink-0">{detail.icon}</div>
            <span className="text-[12px] text-[#c3c4ca] w-16 flex-shrink-0">{detail?.label}</span>
            {detail.link ? (
              <a href="#" className="text-sm text-[#4b8ef1] hover:underline truncate">{detail?.value}</a>
            ) : (
              <span className="text-sm text-[#a8b3cf] truncate">{detail?.value}</span>
            )}
          </div>
        ))}
      </div>

      {profile?.signature && (
        <div className="bg-[#242528] rounded-lg border border-[rgba(255,255,255,0.06)] p-4">
          <h3 className="text-[13px] uppercase tracking-widest font-bold text-[#c3c4ca] mb-2">Signature</h3>
          <p className="text-sm text-[#c3c4ca] italic border-l-2 border-[rgba(255,255,255,0.08)] pl-3">
            {profile?.signature}
          </p>
        </div>
      )}
    </div>
  );
}